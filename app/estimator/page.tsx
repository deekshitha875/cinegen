"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Sparkles, ArrowRight, DollarSign, Clock, Users, TrendingUp, Zap, Film, Image, Music } from "lucide-react";
import Link from "next/link";

const CONTENT_TYPES = [
  { id: "short-video", label: "Short-form Video", icon: Film, base: 800, desc: "Reels, TikTok, YouTube Shorts" },
  { id: "brand-film", label: "Brand Film", icon: Film, base: 3500, desc: "60–90 second cinematic" },
  { id: "animation", label: "Animation", icon: Zap, base: 1500, desc: "2D/3D animated content" },
  { id: "image-campaign", label: "Image Campaign", icon: Image, base: 600, desc: "AI photography/editorial" },
  { id: "social-pack", label: "Social Media Pack", icon: TrendingUp, base: 1200, desc: "Multi-format content set" },
  { id: "motion-graphics", label: "Motion Graphics", icon: Zap, base: 900, desc: "Animated titles & graphics" },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", multiplier: 1.0 },
  { id: "youtube", label: "YouTube", multiplier: 1.2 },
  { id: "tiktok", label: "TikTok", multiplier: 0.9 },
  { id: "tv", label: "TV / OTT", multiplier: 2.5 },
  { id: "all", label: "All Platforms", multiplier: 1.8 },
];

const QUALITY_LEVELS = [
  { id: "standard", label: "Standard", desc: "1080p, fast turnaround", multiplier: 1.0 },
  { id: "premium", label: "Premium", desc: "4K, detailed workflow", multiplier: 1.6 },
  { id: "ultra", label: "Ultra", desc: "8K, full commercial rights", multiplier: 2.4 },
];

const REGIONS = [
  { id: "india", label: "India only", multiplier: 1.0 },
  { id: "asia", label: "Asia Pacific", multiplier: 1.3 },
  { id: "global", label: "Worldwide", multiplier: 1.7 },
];

export default function EstimatorPage() {
  const [contentType, setContentType] = useState(CONTENT_TYPES[0]);
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [quality, setQuality] = useState(QUALITY_LEVELS[0]);
  const [region, setRegion] = useState(REGIONS[0]);
  const [quantity, setQuantity] = useState(1);
  const [idea, setIdea] = useState("");
  const [showResult, setShowResult] = useState(false);

  const estimate = useMemo(() => {
    const base = contentType.base * platform.multiplier * quality.multiplier * region.multiplier * quantity;
    const min = Math.round(base * 0.8 / 100) * 100;
    const max = Math.round(base * 1.3 / 100) * 100;
    const traditional = Math.round(base * 5 / 100) * 100;
    const savings = Math.round(((traditional - max) / traditional) * 100);
    const days = quality.id === "standard" ? "5–10" : quality.id === "premium" ? "10–18" : "18–30";
    const creators = quality.id === "standard" ? 12 : quality.id === "premium" ? 7 : 4;
    return { min, max, traditional, savings, days, creators };
  }, [contentType, platform, quality, region, quantity]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-medium mb-4">
          <Calculator className="w-4 h-4" /> Budget Estimator
        </div>
        <h1 className="font-display font-bold text-4xl mb-2">How much will your campaign cost?</h1>
        <p className="text-muted-foreground">Get an instant AI production budget estimate — no signup required</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Config */}
        <div className="space-y-6">
          {/* Content Type */}
          <div>
            <label className="block text-sm font-semibold mb-3">Content Type</label>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPES.map((ct) => (
                <button key={ct.id} onClick={() => setContentType(ct)}
                  className={`p-3 rounded-xl border text-left transition-all ${contentType.id === ct.id ? "bg-amber-500/10 border-amber-400/30 text-amber-600" : "glass border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"}`}>
                  <div className="font-medium text-sm">{ct.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{ct.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-semibold mb-3">Distribution Platform</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button key={p.id} onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${platform.id === p.id ? "bg-blue-500/10 border-blue-400/30 text-blue-600" : "glass border-white/10 text-muted-foreground hover:text-foreground"}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-sm font-semibold mb-3">Production Quality</label>
            <div className="grid grid-cols-3 gap-2">
              {QUALITY_LEVELS.map((q) => (
                <button key={q.id} onClick={() => setQuality(q)}
                  className={`p-3 rounded-xl border text-center transition-all ${quality.id === q.id ? "bg-amber-500/20 border-amber-500/40 text-amber-300" : "glass border-white/10 text-muted-foreground hover:text-foreground"}`}>
                  <div className="font-semibold text-sm">{q.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{q.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Region + Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-3">Usage Region</label>
              <div className="space-y-2">
                {REGIONS.map((r) => (
                  <button key={r.id} onClick={() => setRegion(r)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm text-left transition-all ${region.id === r.id ? "bg-amber-500/10 border-amber-400/30 text-amber-600" : "glass border-white/10 text-muted-foreground hover:text-foreground"}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3">Quantity: {quantity}</label>
              <input type="range" min={1} max={10} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-violet-500 mt-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 piece</span><span>10 pieces</span>
              </div>
              <div className="mt-4 p-3 bg-white/3 border border-white/5 rounded-xl">
                <div className="text-xs text-muted-foreground">Campaign idea (optional)</div>
                <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={3}
                  placeholder="Describe your campaign..."
                  className="w-full bg-transparent text-sm mt-1 resize-none focus:outline-none placeholder:text-muted-foreground/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="lg:sticky lg:top-24">
          <motion.div
            key={`${contentType.id}-${platform.id}-${quality.id}-${region.id}-${quantity}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-2xl border border-amber-400/30 p-6 space-y-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h2 className="font-display font-semibold text-lg">Your Estimate</h2>
            </div>

            {/* Price range */}
            <div className="text-center p-5 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 border border-amber-400/30 rounded-2xl">
              <div className="text-xs text-muted-foreground mb-1">Estimated AI Production Cost</div>
              <div className="font-display font-bold text-4xl font-bold text-amber-600">
                ${estimate.min.toLocaleString()} – ${estimate.max.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">for {quantity} {contentType.label.toLowerCase()}{quantity > 1 ? "s" : ""}</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/3 border border-white/5 rounded-xl text-center">
                <div className="text-xl font-bold text-green-400">{estimate.savings}%</div>
                <div className="text-xs text-muted-foreground">Savings vs traditional</div>
              </div>
              <div className="p-3 bg-white/3 border border-white/5 rounded-xl text-center">
                <div className="text-xl font-bold text-blue-600">{estimate.days}</div>
                <div className="text-xs text-muted-foreground">Days to deliver</div>
              </div>
              <div className="p-3 bg-white/3 border border-white/5 rounded-xl text-center">
                <div className="text-xl font-bold text-amber-400">{estimate.creators}</div>
                <div className="text-xs text-muted-foreground">Matching creators</div>
              </div>
              <div className="p-3 bg-white/3 border border-white/5 rounded-xl text-center">
                <div className="text-xl font-bold text-amber-600">${estimate.traditional.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Traditional agency cost</div>
              </div>
            </div>

            {/* Savings bar */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>AI Production</span>
                <span>Traditional Agency</span>
              </div>
              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                  animate={{ width: `${100 - estimate.savings}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-green-400 text-center mt-1">You save ~{estimate.savings}% with AI creators</p>
            </div>

            <Link href="/briefs/new"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#0f1729] to-cyan-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg">
              <Sparkles className="w-4 h-4" /> Post This Brief Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/creators"
              className="w-full flex items-center justify-center gap-2 py-2.5 glass border border-white/10 text-sm rounded-xl hover:bg-white/5 transition-all">
              Browse {estimate.creators} matching creators
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
