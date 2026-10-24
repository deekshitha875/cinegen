import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createServiceClient } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/ai/rateLimit";

const DIRECTOR_SYSTEM_PROMPT = `You are CineGen Voice Director — an intelligent AI assistant that helps brands create compelling video campaign briefs through natural conversation.

Your role:
- Guide users through creating a video campaign brief conversationally
- Ask smart follow-up questions to gather all necessary details
- Suggest creative ideas, styles, and approaches
- Be encouraging, creative, and professional
- Keep replies concise (2-3 sentences max for voice)

Campaign details you gather:
- Campaign title and objective
- Content type (Short-form Video, Long-form Video, Animation, Motion Graphics, etc.)
- Visual style and mood
- Aspect ratios (16:9, 9:16, 1:1, 4:5)
- Duration in seconds
- Preferred AI tools (Runway, Midjourney, Sora, Kling, etc.)
- Budget range (min/max in USD)
- Deadline

Always respond with valid JSON:
{
  "reply": "Your conversational response here",
  "action": "none",
  "campaignDraft": {}
}

Set action to "open_discovery" if user wants to find creators, "prepare_brief" if ready to post.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, conversationId, userId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Rate limiting
    const identifier = userId || "anonymous";
    const { allowed, retryAfterMs } = checkRateLimit(identifier, "director-chat", 20, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded", retryAfterMs },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback when no API key
    if (!apiKey) {
      const lastMsg = messages[messages.length - 1]?.text?.toLowerCase() || "";
      let reply = "I'm your CineGen Voice Director! What's your campaign idea?";
      if (lastMsg.includes("social") || lastMsg.includes("instagram")) {
        reply = "Perfect for social! What vibe — energetic and trendy, or polished and cinematic?";
      } else if (lastMsg.includes("budget") || lastMsg.includes("cost")) {
        reply = "AI video budgets range from $500 for short clips to $5,000+ for brand films. What range works for you?";
      }
      return NextResponse.json({ reply, action: "none", campaignDraft: {}, conversationId });
    }

    // Use the new @google/genai SDK — supports AQ. key format
    const ai = new GoogleGenAI({ apiKey });
    const lastUserMessage = messages[messages.length - 1];

    const contents = messages.slice(-20).map((m: { role: string; text: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text || "" }],
    }));
    while (contents.length > 0 && contents[0].role === "model") contents.shift();

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: DIRECTOR_SYSTEM_PROMPT,
        maxOutputTokens: 500,
        temperature: 0.8,
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text ?? "{}";

    let parsed: { reply?: string; action?: string; campaignDraft?: Record<string, unknown> } = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = { reply: rawText, action: "none", campaignDraft: {} };
    }

    // Persist to Supabase if available
    if (userId && conversationId && !conversationId.startsWith("temp-")) {
      try {
        const supabaseAdmin = createServiceClient();
        if (lastUserMessage) {
          await supabaseAdmin.from("director_messages").insert({
            conversation_id: conversationId,
            role: "user",
            content: lastUserMessage.text,
            input_source: lastUserMessage.source || "text",
          });
        }
        if (parsed.reply) {
          await supabaseAdmin.from("director_messages").insert({
            conversation_id: conversationId,
            role: "assistant",
            content: parsed.reply,
          });
        }
      } catch (dbErr) {
        console.error("DB persist error (non-fatal):", dbErr);
      }
    }

    return NextResponse.json({
      reply: parsed.reply || "How can I help with your campaign?",
      action: parsed.action || "none",
      campaignDraft: parsed.campaignDraft || {},
      conversationId,
    });
  } catch (error) {
    console.error("Director chat error:", error);
    return NextResponse.json(
      { error: "Internal error", reply: "Something went wrong. Please try again!" },
      { status: 500 }
    );
  }
}
