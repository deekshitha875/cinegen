"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, Play, Search, FileText, Handshake,
  Star, CheckCircle2, Zap, TrendingUp, Users, Briefcase, Film
} from "lucide-react";

const STATS = [
  { label: "AI Creators", value: "2,400+", icon: Users },
  { label: "Brands Served", value: "850+", icon: Briefcase },
  { label: "Projects Completed", value: "12,000+", icon: CheckCircle2 },
  { label: "Avg. Rating", value: "4.8★", icon: Star },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Discover AI Creators",
    desc: "Search and filter 2,400+ verified AI filmmakers, animators, and generative artists by tools, specialization, and style.",
    icon: Search,
    color: "from-violet-500 to-violet-600",
  },
  {
    step: "02",
    title: "Post Your Brief",
    desc: "Use our AI-powered brief builder to transform a rough idea into a complete structured brief in seconds. Or build manually with our guided form.",
    icon: FileText,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    step: "03",
    title: "Hire & Deliver",
    desc: "Review proposals from matched creators, hire the right fit, and manage the entire engagement from brief to final delivery.",
    icon: Handshake,
    color: "from-violet-500 to-cyan-500",
  },
];

const FEATURED_CREATORS = [
  { name: "Aryan Kapoor", handle: "@aryanvisuals", headline: "AI Filmmaker & Cinematic Visual Storyteller", badge: "Studio", rate: 95, rating: 4.9, tools: ["Runway", "Kling", "Midjourney"], avatar: "https://picsum.photos/seed/aryan/200/200", cover: "https://picsum.photos/seed/aryancover/800/300", id: "creator-001", availability: "Available" },
  { name: "Marcus Chen", handle: "@marcusaivfx", headline: "AI VFX Director | Epic Sci-Fi & Fantasy Visuals", badge: "Studio", rate: 150, rating: 5.0, tools: ["Sora", "Runway", "ComfyUI"], avatar: "https://picsum.photos/seed/marcus/200/200", cover: "https://picsum.photos/seed/marcuscover/800/300", id: "creator-005", availability: "Limited" },
  { name: "Lena Volkov", handle: "@lenamusicals", headline: "Music Video Director | Ethereal AI Aesthetics", badge: "Studio", rate: 130, rating: 4.9, tools: ["Higgsfield", "Runway", "Kling"], avatar: "https://picsum.photos/seed/lena/200/200", cover: "https://picsum.photos/seed/lenacover/800/300", id: "creator-008", availability: "Available" },
  { name: "Aisha Okafor", handle: "@aishacreatives", headline: "AI Brand Storyteller | Purpose-Driven Campaigns", badge: "Studio", rate: 85, rating: 4.9, tools: ["Veo", "Runway", "ElevenLabs"], avatar: "https://picsum.photos/seed/aisha/200/200", cover: "https://picsum.photos/seed/aishacover/800/300", id: "creator-012", availability: "Available" },
  { name: "Zara Ahmed", handle: "@zarafashionai", headline: "AI Fashion Filmmaker | High-Fashion Campaigns", badge: "Verified", rate: 120, rating: 4.85, tools: ["Midjourney", "Flux", "Adobe Firefly"], avatar: "https://picsum.photos/seed/zara/200/200", cover: "https://picsum.photos/seed/zaracover/800/300", id: "creator-004", availability: "Available" },
  { name: "Meera Iyer", handle: "@meeravisualai", headline: "AI Visual Artist | Experimental & Art-House Films", badge: "Studio", rate: 100, rating: 5.0, tools: ["Stable Diffusion", "ComfyUI", "Runway"], avatar: "https://picsum.photos/seed/meera/200/200", cover: "https://picsum.photos/seed/meeracover/800/300", id: "creator-015", availability: "Limited" },
];

const BADGE_STYLES: Record<string, string> = {
  Studio: "bg-violet-500/80 text-white",
  Verified: "bg-cyan-500/80 text-white",
  Rising: "bg-amber-500/80 text-white",
  Unverified: "bg-white/20 text-white",
};

const AVAIL_COLOR: Record<string, string> = {
  Available: "text-green-400",
  Limited: "text-amber-400",
  Booked: "text-red-400",
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Cinematic background */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-[0.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Native Creative Marketplace</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6">
            Hire the world&apos;s best{" "}
            <span className="gradient-text">AI creators</span>
            <br />
            for your brand
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            CineGen connects brands and agencies with verified AI filmmakers, animators, and generative artists. Post a brief, discover talent, and go from idea to content in days — not months.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/creators"
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl font-semibold text-base hover:from-violet-500 hover:to-violet-400 transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4" />
              Discover Creators
            </Link>
            <Link
              href="/briefs/new"
              className="flex items-center gap-2 px-6 py-3.5 glass border border-white/10 text-foreground rounded-xl font-semibold text-base hover:bg-white/5 transition-all hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              AI Brief Builder
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-600/20 to-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl font-semibold text-base hover:from-cyan-600/30 hover:to-cyan-500/30 transition-all hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4" />
              Judges: Try Demo
            </Link>
          </div>

          {/* Avatar row */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {FEATURED_CREATORS.slice(0, 5).map((c) => (
                <img
                  key={c.id}
                  src={c.avatar}
                  alt={c.name}
                  className="w-7 h-7 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <span>Trusted by 850+ brands worldwide</span>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-8 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="text-center"
              >
                <div className="text-3xl font-display font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl mb-4">How CineGen works</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From idea to delivered content — in three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="glass rounded-2xl p-6 border border-white/5 hover:border-violet-500/20 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-4xl font-display font-bold text-white/10 mb-2">{step.step}</div>
              <h3 className="font-display font-semibold text-xl mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-16 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display font-bold text-3xl mb-2">Featured Creators</h2>
              <p className="text-muted-foreground">Handpicked AI creators available for your next campaign</p>
            </div>
            <Link
              href="/creators"
              className="hidden sm:flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED_CREATORS.map((creator, i) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
              >
                <Link href={`/creators/${creator.id}`}>
                  <div className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all group hover:-translate-y-1 cursor-pointer h-full">
                    {/* Cover */}
                    <div className="relative h-28 overflow-hidden">
                      <img
                        src={creator.cover}
                        alt=""
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_STYLES[creator.badge]}`}>
                        {creator.badge === "Studio" && "★ "}{creator.badge}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start gap-3 -mt-8 mb-3 relative z-10">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-12 h-12 rounded-xl border-2 border-background object-cover shadow-xl"
                        />
                        <div className="mt-5">
                          <div className="font-semibold text-sm">{creator.name}</div>
                          <div className="text-xs text-muted-foreground">{creator.handle}</div>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{creator.headline}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {creator.tools.map((t) => (
                          <span key={t} className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-muted-foreground">{t}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {creator.rating}
                        </span>
                        <span className={`font-medium ${AVAIL_COLOR[creator.availability]}`}>
                          ● {creator.availability}
                        </span>
                        <span className="text-foreground font-semibold">${creator.rate}/hr</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/creators"
              className="inline-flex items-center gap-2 px-6 py-3 glass border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition-all"
            >
              View all 18 creators <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Film, title: "AI-Native Portfolios", desc: "Every creator shows the full production workflow — tools, prompts, and steps used to create each piece.", color: "text-violet-400" },
            { icon: CheckCircle2, title: "Verified Trust Signals", desc: "3-tier verification: tools verified, workflow verified, and past work confirmed by our team.", color: "text-cyan-400" },
            { icon: Zap, title: "AI Brief Builder", desc: "Turn a rough idea into a complete structured brief in seconds. Powered by Gemini 2.0.", color: "text-amber-400" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="glass rounded-2xl border border-white/5 p-6 hover:border-violet-500/20 transition-all"
            >
              <item.icon className={`w-8 h-8 ${item.color} mb-4`} />
              <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-8 font-medium">Everything you need to hire AI creators</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { emoji: "🧠", label: "Brief Intelligence", desc: "AI audits your brief in real-time", href: "/briefs/new" },
              { emoji: "⚖️", label: "Creator Compare", desc: "Side-by-side creator analysis", href: "/compare" },
              { emoji: "💰", label: "Budget Estimator", desc: "Instant AI production cost estimate", href: "/estimator" },
              { emoji: "🛡️", label: "Risk Scanner", desc: "IP & licensing compliance check", href: "/risk-scanner" },
              { emoji: "🏆", label: "Leaderboard", desc: "Top-ranked AI creators", href: "/leaderboard" },
              { emoji: "🧬", label: "Style DNA", desc: "Radar chart of creator aesthetics", href: "/creators" },
              { emoji: "🎯", label: "Match Scoring", desc: "Explainable % match engine", href: "/briefs/new" },
              { emoji: "✅", label: "Verification Evidence", desc: "Audited proof of AI production", href: "/creators" },
            ].map((f) => (
              <Link key={f.label} href={f.href}
                className="glass rounded-xl border border-white/5 hover:border-violet-500/20 p-4 transition-all group">
                <div className="text-2xl mb-2">{f.emoji}</div>
                <div className="font-semibold text-sm group-hover:text-violet-300 transition-colors">{f.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{f.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass rounded-3xl border border-violet-500/20 p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-cyan-500/5 pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              Ready to create?
            </div>
            <h2 className="font-display font-bold text-4xl mb-4">
              Your next campaign starts here
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join 850+ brands using CineGen to discover AI creators and produce world-class content at a fraction of traditional costs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-semibold text-base hover:opacity-90 transition-all shadow-xl shadow-violet-500/30"
              >
                <Sparkles className="w-5 h-5" />
                Start for Free
              </Link>
              <Link
                href="/creators"
                className="flex items-center gap-2 px-8 py-4 glass border border-white/10 rounded-xl font-semibold text-base hover:bg-white/5 transition-all"
              >
                Browse Creators <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/estimator"
                className="flex items-center gap-2 px-8 py-4 glass border border-green-500/20 text-green-300 rounded-xl font-semibold text-base hover:bg-green-500/5 transition-all"
              >
                💰 Budget Estimator
              </Link>
              <Link
                href="/risk-scanner"
                className="flex items-center gap-2 px-8 py-4 glass border border-red-500/20 text-red-300 rounded-xl font-semibold text-base hover:bg-red-500/5 transition-all"
              >
                🛡️ Risk Scanner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
