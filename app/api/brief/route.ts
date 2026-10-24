import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { generateFallbackBrief } from "@/lib/briefFallback";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const idea: string = body?.idea;

    if (!idea || typeof idea !== "string" || idea.trim().length < 5) {
      return NextResponse.json({ error: "idea field is required (min 5 chars)" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const systemPrompt = `You are a creative brief generator for an AI content marketplace called CineGen.
Given a plain-language campaign idea, extract and return ONLY a valid JSON object (no markdown, no code fences, no explanation) with these exact fields:
{
  "campaignTitle": string,
  "objective": string,
  "contentType": one of ["Short-form Video","Long-form Video","Animation","Motion Graphics","Image Campaign","Social Media Pack","Brand Film"],
  "style": string (describe the visual style in 1-2 sentences),
  "aspectRatios": array of one or more of ["16:9","9:16","1:1","4:5","2.39:1"],
  "durationSeconds": number or null (null for image campaigns),
  "resolution": one of ["1080p","4K","8K"],
  "quantity": number,
  "toolsPreferred": array of tools from ["Midjourney","Runway","Kling","Veo","Sora","Pika","Luma","Flux","ComfyUI","Stable Diffusion","ElevenLabs","Suno","HeyGen","Topaz","Higgsfield"],
  "budgetMin": number (USD),
  "budgetMax": number (USD),
  "deadline": ISO date string (30 days from today),
  "commercialUse": {
    "licenseTier": one of ["Full Buyout","Commercial 1yr","Editorial Only","Royalty-Free","Limited"],
    "modelIndemnityRequired": boolean,
    "workflowHandoffRequired": boolean,
    "usageRegions": array of strings,
    "usageDurationMonths": number,
    "exclusivity": boolean
  },
  "negativeKeywords": array of strings
}

Be specific and creative. Infer the best options from the idea. Today's date: ${new Date().toISOString().split("T")[0]}`;

        // Use the new @google/genai SDK — supports AQ. key format
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nCampaign idea: ${idea}` }] }],
          config: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
          },
        });

        const rawText = response.text ?? "";

        // Strip code fences if present
        const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);

        return NextResponse.json({ brief: { ...parsed, generatedByAI: true, rawIdea: idea }, source: "gemini" });
      } catch (geminiError) {
        console.error("Gemini error, falling back:", geminiError);
        // Fall through to rule-based fallback
      }
    }

    // Rule-based fallback
    const fallback = generateFallbackBrief(idea);
    return NextResponse.json({ brief: fallback, source: "fallback" });
  } catch (err) {
    console.error("Brief API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
