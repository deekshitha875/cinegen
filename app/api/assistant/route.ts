import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are CineGen Assistant — a helpful AI guide for the CineGen AI-native creative marketplace.

CineGen connects brands and agencies with verified AI content creators — filmmakers, animators, and generative artists.

Key features you can help with:
- Discovering AI creators by tools, specialization, rate, and availability
- Creating campaign briefs with the AI Brief Builder (powered by Gemini)
- Understanding match scores — explainable % compatibility between briefs and creators
- Brief Intelligence — real-time audit of briefs with error/warning/tip system
- Budget Estimator — instant AI production cost estimates
- Commercial Risk Scanner — IP, licensing, and model indemnity risk checks
- Creator Comparison — side-by-side analysis of multiple creators
- Creator Leaderboard — rankings by projects, rating, and repeat clients
- Style DNA — radar chart showing creator's visual style profile
- Proposals — creators apply to briefs, brands accept/reject
- Inbox — messaging between brands and creators
- Portfolio — creators showcase AI-generated work with full production workflows

Demo credentials (for judges):
- Brand: brand@cinegen.demo / Demo@123
- Creator: creator@cinegen.demo / Demo@123

Keep answers short, helpful, and conversational. If asked about something outside CineGen, gently redirect to what CineGen can help with.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const lastMessage = messages[messages.length - 1]?.content || "";

    if (!apiKey) {
      // Smart fallback responses
      const fallbacks: Record<string, string> = {
        "brief": "The AI Brief Builder turns your rough idea into a complete structured brief in seconds! Go to Briefs → Create Brief and type your campaign idea.",
        "creator": "You can discover 18 verified AI creators at /creators. Filter by tools like Runway, Midjourney, or Sora, specialization, rate, and availability.",
        "login": "Use brand@cinegen.demo / Demo@123 for brand access, or creator@cinegen.demo / Demo@123 for creator access. Both work instantly — no email needed!",
        "match": "After publishing a brief, CineGen shows you top creator matches with % compatibility scores and explainable reasons — tool overlap, specialization, budget fit.",
        "price": "The Budget Estimator at /estimator calculates AI production costs instantly based on content type, platform, quality level, and region.",
        "risk": "The Risk Scanner at /risk-scanner flags IP risks, licensing gaps, and model indemnity issues before you engage a creator.",
        "demo": "Try the interactive demo at /demo — no sign-in needed! Edit a brief and see creator matches update in real time.",
      };

      const lower = lastMessage.toLowerCase();
      for (const [key, response] of Object.entries(fallbacks)) {
        if (lower.includes(key)) {
          return NextResponse.json({ reply: response });
        }
      }

      return NextResponse.json({
        reply: "I'm CineGen Assistant! I can help you discover AI creators, build campaign briefs, understand match scores, or navigate any feature. What would you like to know?",
      });
    }

    // Use Gemini
    const conversationHistory = messages.slice(-8).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: conversationHistory,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help! Ask me anything about CineGen.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ reply: "I'm having a moment — try asking again!" });
  }
}
