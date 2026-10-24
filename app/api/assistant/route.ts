import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are CineGen Assistant — a friendly, conversational AI built into the CineGen platform. Think of yourself like ChatGPT but specialized for CineGen.

CineGen is an AI-native creative marketplace that connects brands with verified AI filmmakers, animators, and generative artists.

YOUR PERSONALITY:
- Warm, helpful, and conversational — like ChatGPT
- Respond naturally to greetings (Hi, Hello, Hey → greet back warmly)
- For general questions answer helpfully and naturally
- Keep responses concise but complete — 2-4 sentences typically
- Use emojis occasionally to be friendly 😊
- Never refuse to answer greetings or small talk

CINEGEN FEATURES YOU KNOW:
- Discover Creators: Browse 18 verified AI creators by tools, style, rate, availability at /creators
- AI Brief Builder: Turn a rough idea into a full campaign brief using Gemini AI at /briefs/new
- Match Scores: After posting a brief, get % compatibility scores with creators
- Brief Intelligence: Real-time audit of briefs — flags errors, warnings, tips
- Budget Estimator: Instant AI production cost estimates at /estimator
- Risk Scanner: IP, licensing, model indemnity checks at /risk-scanner
- Creator Compare: Side-by-side creator analysis at /compare
- Leaderboard: Top-ranked creators at /leaderboard
- Proposals: Creators apply to briefs, brands accept/reject
- Inbox: Direct messaging between brands and creators

DEMO CREDENTIALS:
- Brand login: brand@cinegen.demo / Demo@123
- Creator login: creator@cinegen.demo / Demo@123

Always respond helpfully. For greetings like "hi", "hello", "hey" — greet back warmly and ask how you can help.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ reply: "Hey! 👋 How can I help you with CineGen today?" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const lastMessage = (messages[messages.length - 1]?.content || "").trim();

    // No API key — smart fallback
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({ reply: getFallbackReply(lastMessage) });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

      // Build contents array with full conversation
      const contents = messages.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || "" }],
      }));

      // Ensure starts with user turn
      while (contents.length > 0 && contents[0].role === "model") {
        contents.shift();
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          maxOutputTokens: 400,
          temperature: 0.8,
        },
      });

      const reply = response.text ?? "";
      if (!reply.trim()) {
        return NextResponse.json({ reply: getFallbackReply(lastMessage) });
      }

      return NextResponse.json({ reply });

    } catch (geminiErr: unknown) {
      const msg = geminiErr instanceof Error ? geminiErr.message : String(geminiErr);
      console.error("Gemini error:", msg);
      // Always return a real answer, never a generic error
      return NextResponse.json({ reply: getFallbackReply(lastMessage) });
    }

  } catch (err) {
    console.error("Assistant route error:", err);
    return NextResponse.json({ reply: "Hey! 👋 I'm CineGen Assistant. How can I help you today?" });
  }
}

function getFallbackReply(message: string): string {
  const m = message.toLowerCase().trim();

  if (/^(hi|hello|hey|howdy|sup|yo|hiya|greetings|good morning|good evening|good afternoon)[\s!.,?]*$/.test(m) || m === "") {
    return "Hey there! 👋 I'm the CineGen Assistant. I can help you find AI creators, build campaign briefs, understand match scores, or explore any feature. What are you looking for today?";
  }
  if (m.includes("how are you") || m.includes("how r u") || m.includes("how's it going")) {
    return "Doing great, thanks for asking! 😊 Ready to help you find amazing AI creators or build your next campaign brief. What can I do for you?";
  }
  if (m.includes("what is cinegen") || m.includes("what's cinegen") || m.includes("about cinegen")) {
    return "CineGen is an AI-native creative marketplace where brands hire verified AI filmmakers, animators, and generative artists. Post a brief, get AI-powered creator matches, and manage your whole project — all in one place! 🎬";
  }
  if (m.includes("brief") || m.includes("campaign") || m.includes("post")) {
    return "The AI Brief Builder at /briefs/new turns your rough idea into a complete structured brief in seconds! Just type your campaign idea and Gemini AI fills in content type, style, budget, tools, and more. 🧠";
  }
  if (m.includes("creator") || m.includes("filmmaker") || m.includes("find") || m.includes("hire") || m.includes("discover")) {
    return "You can discover 18 verified AI creators at /creators! Filter by tools (Runway, Midjourney, Sora), specialization, hourly rate, and availability. Each creator has a full portfolio with production workflows. 🎨";
  }
  if (m.includes("login") || m.includes("sign in") || m.includes("demo") || m.includes("credentials")) {
    return "For instant demo access: Brand → brand@cinegen.demo / Demo@123 | Creator → creator@cinegen.demo / Demo@123. No email verification needed — works right away! 🚀";
  }
  if (m.includes("match") || m.includes("score")) {
    return "After you publish a brief, CineGen shows top creator matches with % compatibility scores. It explains exactly why — tool overlap, specialization fit, budget alignment. Super transparent! ✅";
  }
  if (m.includes("budget") || m.includes("cost") || m.includes("price") || m.includes("estimat")) {
    return "The Budget Estimator at /estimator gives instant AI production cost estimates. Select content type, platform, quality, and region — get a realistic range instantly. 💰";
  }
  if (m.includes("risk") || m.includes("legal") || m.includes("ip") || m.includes("license") || m.includes("copyright")) {
    return "The Risk Scanner at /risk-scanner checks IP risks, licensing gaps, and model indemnity issues before you hire. Flags problems so you're always protected. 🛡️";
  }
  if (m.includes("thank") || m.includes("thanks") || m.includes("thx")) {
    return "You're welcome! 😊 Let me know if you need anything else — happy to help!";
  }
  return "I'm CineGen Assistant! I can help you discover AI creators, build campaign briefs, understand match scores, or use any feature. What would you like to explore? 🎬";
}
