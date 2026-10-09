"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play, Search, FileText, Handshake, Star, CheckCircle2, Zap, TrendingUp, Users, Briefcase } from "lucide-react";
import { seedCreators } from "@/lib/seed/creators";

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

const FEATURED_IDS = ["creator-001", "creator-005", "creator-008", "creator-012", "creator-015", "creator-003"];

export default function HomePage() {
  const featured = seedCreators.filter((c) => FEATURED_IDS.includes(c.id));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Native Creative Marketplace</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6"
          >
            Hire the world's best{" "}
            <span className="gradient-text">AI creators</span>
            <br />
            for your brand
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            CineGen connects brands and agencies with verified AI filmmakers, animators, and generative artists. Post a brief, discover talent, and go from idea to content in days — not months.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
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
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <div className="flex -space-x-2">
              {featured.slice(0, 5).map((c) => (
                <img
                  key={c.id}
                  src={c.avatarUrl}
                  alt={c.name}
                  className="w-7 h-7 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <span>Trusted by 850+ brands worldwide</span>
          </motion.div>
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
            {featured.map((creator, i) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
              >
                <Link href={`/creators/${creator.id}`}>
                  <div className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all group hover:-translate-y-1 cursor-pointer">
                    {/* Cover */}
                    <div className="relative h-28 overflow-hidden">
                      <img src={creator.coverUrl} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {/* Badge */}
                      <div className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium ${
                        creator.verification.badge === "Studio" ? "bg-violet-500/80 text-white" :
                        creator.verification.badge === "Verified" ? "bg-cyan-500/80 text-white" :
                        creator.verification.badge === "Rising" ? "bg-amber-500/80 text-white" :
                        "bg-white/20 text-white"
                      }`}>
                        {creator.verification.badge}
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Avatar + name */}
                      <div className="flex items-start gap-3 -mt-8 mb-3">
                        <img
                          src={creator.avatarUrl}
                          alt={creator.name}
                          className="w-12 h-12 rounded-xl border-2 border-background object-cover"
                        />
                        <div className="mt-5">
                          <div className="font-semibold text-sm">{creator.name}</div>
                          <div className="text-xs text-muted-foreground">{creator.handle}</div>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{creator.headline}</p>

                      {/* Tools */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {creator.verifiedTools.slice(0, 3).map((t) => (
                          <span key={t.name} className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-muted-foreground">
                            {t.name}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" />
                          {creator.stats.avgRating}
                        </span>
                        <span className={creator.availability === "Available" ? "text-green-400" : creator.availability === "Limited" ? "text-amber-400" : "text-red-400"}>
                          {creator.availability}
                        </span>
                        <span className="text-foreground font-medium">${creator.hourlyRateUsd}/hr</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/creators" className="inline-flex items-center gap-2 px-6 py-3 glass border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition-all">
              View all 18 creators <ArrowRight className="w-4 h-4" />
            </Link>
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
              <Link href="/creators" className="flex items-center gap-2 px-8 py-4 glass border border-white/10 rounded-xl font-semibold text-base hover:bg-white/5 transition-all">
                Browse Creators <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
