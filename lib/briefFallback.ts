import { AiTool, ContentType, AspectRatio, LicenseTier } from "@/types";

function detectContentType(lower: string): ContentType {
  if (lower.includes("reel") || lower.includes("tiktok") || lower.includes("short") || lower.includes("15") || lower.includes("30"))
    return "Short-form Video";
  if (lower.includes("animation") || lower.includes("animated") || lower.includes("cartoon"))
    return "Animation";
  if (lower.includes("motion") || lower.includes("explainer") || lower.includes("infographic"))
    return "Motion Graphics";
  if (lower.includes("social") || lower.includes("pack") || lower.includes("instagram") || lower.includes("facebook"))
    return "Social Media Pack";
  if (lower.includes("photo") || lower.includes("image") || lower.includes("campaign") || lower.includes("poster"))
    return "Image Campaign";
  if (lower.includes("film") || lower.includes("brand film") || lower.includes("documentary"))
    return "Brand Film";
  if (lower.includes("ad") || lower.includes("commercial") || lower.includes("launch") || lower.includes("promo"))
    return "Short-form Video";
  return "Brand Film";
}

function detectTools(lower: string): AiTool[] {
  const tools: AiTool[] = [];
  if (lower.includes("midjourney") || lower.includes("image") || lower.includes("visual")) tools.push("Midjourney");
  if (lower.includes("runway") || lower.includes("video") || lower.includes("motion")) tools.push("Runway");
  if (lower.includes("kling") || lower.includes("realistic")) tools.push("Kling");
  if (lower.includes("veo") || lower.includes("documentary") || lower.includes("realistic film")) tools.push("Veo");
  if (lower.includes("pika") || lower.includes("animate") || lower.includes("reel")) tools.push("Pika");
  if (lower.includes("elevenlabs") || lower.includes("voice") || lower.includes("audio") || lower.includes("narration")) tools.push("ElevenLabs");
  if (lower.includes("heygen") || lower.includes("spokesperson") || lower.includes("avatar")) tools.push("HeyGen");
  if (lower.includes("suno") || lower.includes("music") || lower.includes("jingle")) tools.push("Suno");
  if (lower.includes("flux") || lower.includes("product") || lower.includes("photo")) tools.push("Flux");
  if (tools.length === 0) tools.push("Midjourney", "Runway");
  return tools.slice(0, 4);
}

function detectAspectRatios(lower: string): AspectRatio[] {
  const ratios: AspectRatio[] = [];
  if (lower.includes("reel") || lower.includes("tiktok") || lower.includes("story") || lower.includes("vertical")) ratios.push("9:16");
  if (lower.includes("youtube") || lower.includes("horizontal") || lower.includes("widescreen") || lower.includes("film")) ratios.push("16:9");
  if (lower.includes("square") || lower.includes("instagram") || lower.includes("post")) ratios.push("1:1");
  if (lower.includes("portrait") || lower.includes("4:5")) ratios.push("4:5");
  if (ratios.length === 0) ratios.push("16:9", "9:16");
  return ratios;
}

function extractBudget(lower: string): { min: number; max: number } {
  if (lower.includes("luxury") || lower.includes("premium") || lower.includes("high-end")) return { min: 8000, max: 20000 };
  if (lower.includes("enterprise") || lower.includes("corporate") || lower.includes("national")) return { min: 5000, max: 12000 };
  if (lower.includes("startup") || lower.includes("small") || lower.includes("indie")) return { min: 1000, max: 3000 };
  return { min: 2500, max: 7500 };
}

function detectLicense(lower: string): LicenseTier {
  if (lower.includes("buyout") || lower.includes("own") || lower.includes("full rights")) return "Full Buyout";
  if (lower.includes("editorial") || lower.includes("press") || lower.includes("news")) return "Editorial Only";
  if (lower.includes("global") || lower.includes("worldwide") || lower.includes("international")) return "Commercial 1yr";
  return "Commercial 1yr";
}

function extractTitle(idea: string): string {
  const firstSentence = idea.split(/[.!?]/)[0].trim();
  const words = firstSentence.split(" ").slice(0, 8);
  return words.join(" ");
}

function detectStyle(lower: string): string {
  if (lower.includes("luxury") || lower.includes("premium")) return "Cinematic, dark luxury, dramatic lighting, premium feel";
  if (lower.includes("fun") || lower.includes("playful") || lower.includes("kids")) return "Bright, playful, energetic, bold colors";
  if (lower.includes("minimal") || lower.includes("clean") || lower.includes("corporate")) return "Clean, minimal, professional, modern";
  if (lower.includes("nature") || lower.includes("organic") || lower.includes("sustainable")) return "Natural, warm, authentic, earthy tones";
  if (lower.includes("tech") || lower.includes("saas") || lower.includes("app")) return "Tech-forward, gradient accents, clean UI aesthetic";
  if (lower.includes("fashion") || lower.includes("beauty") || lower.includes("cosmetic")) return "Editorial, high-fashion, glamorous";
  return "Cinematic, modern, brand-aligned";
}

export function generateFallbackBrief(idea: string) {
  const lower = idea.toLowerCase();
  const contentType = detectContentType(lower);
  const tools = detectTools(lower);
  const aspectRatios = detectAspectRatios(lower);
  const budget = extractBudget(lower);
  const licenseTier = detectLicense(lower);
  const style = detectStyle(lower);
  const title = extractTitle(idea);

  const deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const negativeKeywords: string[] = [];
  if (lower.includes("luxury")) negativeKeywords.push("cheap", "casual", "cartoon");
  if (lower.includes("kids") || lower.includes("family")) negativeKeywords.push("adult", "dark", "violent");
  if (lower.includes("professional") || lower.includes("corporate")) negativeKeywords.push("casual", "meme", "informal");

  return {
    campaignTitle: title,
    objective: idea,
    contentType,
    style,
    aspectRatios,
    toolsPreferred: tools,
    budgetMin: budget.min,
    budgetMax: budget.max,
    deadline,
    quantity: contentType === "Social Media Pack" ? 10 : contentType === "Image Campaign" ? 8 : 3,
    resolution: budget.max > 10000 ? "4K" : "1080p",
    durationSeconds: contentType === "Short-form Video" ? 30 : contentType === "Brand Film" ? 60 : undefined,
    commercialUse: {
      licenseTier,
      modelIndemnityRequired: budget.max > 5000,
      workflowHandoffRequired: false,
      usageRegions: ["India"],
      usageDurationMonths: 12,
      exclusivity: false,
    },
    negativeKeywords,
    generatedByAI: true,
    rawIdea: idea,
  };
}
