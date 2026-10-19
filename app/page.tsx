"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Star, CheckCircle } from "lucide-react";

const FEATURED_CREATORS = [
  { name: "Aryan Kapoor", handle: "@aryanvisuals", headline: "AI Filmmaker & Cinematic Visual Storyteller", badge: "Studio", rate: 95, rating: 4.9, tools: ["Runway", "Kling", "Midjourney"], avatar: "https://picsum.photos/seed/aryan/200/200", id: "creator-001", availability: "Available", category: "AI Filmmaking" },
  { name: "Marcus Chen", handle: "@marcusaivfx", headline: "AI VFX Director | Epic Sci-Fi & Fantasy Visuals", badge: "Studio", rate: 150, rating: 5.0, tools: ["Sora", "Runway", "ComfyUI"], avatar: "https://picsum.photos/seed/marcus/200/200", id: "creator-005", availability: "Limited", category: "3D & CGI" },
  { name: "Lena Volkov", handle: "@lenamusicals", headline: "Music Video Director | Ethereal AI Aesthetics", badge: "Studio", rate: 130, rating: 4.9, tools: ["Higgsfield", "Runway", "Kling"], avatar: "https://picsum.photos/seed/lena/200/200", id: "creator-008", availability: "Available", category: "Music Video" },
  { name: "Aisha Okafor", handle: "@aishacreatives", headline: "AI Brand Storyteller | Purpose-Driven Campaigns", badge: "Studio", rate: 85, rating: 4.9, tools: ["Veo", "Runway", "ElevenLabs"], avatar: "https://picsum.photos/seed/aisha/200/200", id: "creator-012", availability: "Available", category: "Brand Film" },
  { name: "Zara Ahmed", handle: "@zarafashionai", headline: "AI Fashion Filmmaker | High-Fashion Campaigns", badge: "Verified", rate: 120, rating: 4.85, tools: ["Midjourney", "Flux", "Adobe Firefly"], avatar: "https://picsum.photos/seed/zara/200/200", id: "creator-004", availability: "Available", category: "Fashion" },
  { name: "Rahul Sharma", handle: "@rahul3d", headline: "3D Gaussian Splatting Artist & Product Visualizer", badge: "Studio", rate: 110, rating: 4.95, tools: ["ComfyUI", "Flux", "Topaz"], avatar: "https://picsum.photos/seed/rahul/200/200", id: "creator-003", availability: "Limited", category: "Product Viz" },
];

const CATEGORIES = [
  { name: "AI Filmmaking", count: 4, bg: "bg-[#1a2e1a]", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80" },
  { name: "3D & CGI", count: 3, bg: "bg-[#2e1a1a]", image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&q=80" },
  { name: "Brand Film", count: 5, bg: "bg-[#1a1a2e]", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80" },
  { name: "Fashion", count: 2, bg: "bg-[#2e2a1a]", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80" },
];

const STATS = [
  { value: "18", label: "Verified AI creators" },
  { value: "4", label: "Active campaigns" },
  { value: "15+", label: "AI tools covered" },
  { value: "4.9★", label: "Average rating" },
];

export default function HomePage() {
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>

      {/* Judge banner */}
      {!bannerDismissed && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-2.5 px-4 text-sm font-medium relative"
          style={{ background: "var(--dark-green)", color: "white" }}>
          🎯 Hackathon Demo —{" "}
          <Link href="/login" className="underline underline-offset-2 font-semibold" style={{ color: "var(--lime-light)" }}>
            Click here for instant 1-click access
          </Link>
          {" "}· Brand & Creator accounts ready · No signup needed
          <button onClick={() => setBannerDismissed(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100">✕</button>
        </motion.div>
      )}

      {/* Hero */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-label mb-4">CREATIVE ENERGY, CONNECTED</div>
            <h1 className="heading-editorial text-5xl sm:text-6xl lg:text-7xl mb-6" style={{ color: "var(--text-primary)" }}>
              Better<br />together.{" "}
              <span style={{ color: "var(--lime)", fontStyle: "italic" }}>Always.</span>
            </h1>
            <p className="text-lg mb-8" style={{ color: "var(--text-secondary)", maxWidth: "480px", lineHeight: "1.7" }}>
              CineGen connects brands with verified AI filmmakers, animators, and generative artists. Post a brief, discover talent, get matched — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/creators" className="btn-lime flex items-center gap-2 px-6 py-3 text-sm">
                Discover creators <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/register" className="btn-dark flex items-center gap-2 px-6 py-3 text-sm">
                Get started free
              </Link>
              <Link href="/demo" className="btn-outline flex items-center gap-2 px-6 py-3 text-sm">
                Try the demo
              </Link>
            </div>
          </motion.div>

          {/* Creator cards mosaic */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="hidden lg:grid grid-cols-2 gap-3">
            {FEATURED_CREATORS.slice(0, 4).map((creator, i) => (
              <Link key={creator.id} href={`/creators/${creator.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-white rounded-2xl p-4 border border-[var(--cream-dark)] hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{creator.name}</div>
                      <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{creator.category}</div>
                    </div>
                  </div>
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{creator.headline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>${creator.rate}/hr</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${creator.availability === "Available" ? "text-green-700 bg-green-100" : "text-amber-700 bg-amber-100"}`}>
                      {creator.availability}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-y border-[var(--cream-dark)] bg-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: "Playfair Display, serif", color: "var(--text-primary)" }}>{stat.value}</div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="section-label mb-3">CREATIVE CRAFT</div>
            <h2 className="heading-editorial text-4xl" style={{ color: "var(--text-primary)" }}>
              Find your craft.
            </h2>
          </div>
          <Link href="/categories" className="flex items-center gap-1 text-sm font-medium hover:underline" style={{ color: "var(--text-primary)" }}>
            All categories <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link href={`/categories`}>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] group cursor-pointer">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="section-label mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>{i + 1} / CREATIVE CRAFT</div>
                    <div className="font-bold text-lg text-white">{cat.name}</div>
                    <div className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{cat.count} creators</div>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-20 border-t border-[var(--cream-dark)]" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-label mb-3">TALENT</div>
              <h2 className="heading-editorial text-4xl" style={{ color: "var(--text-primary)" }}>
                Discover creators.
              </h2>
            </div>
            <Link href="/creators" className="flex items-center gap-1 text-sm font-medium hover:underline" style={{ color: "var(--text-primary)" }}>
              View all 18 <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED_CREATORS.map((creator, i) => (
              <motion.div key={creator.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link href={`/creators/${creator.id}`}>
                  <div className="bg-white border border-[var(--cream-dark)] rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                    <div className="flex items-start gap-3 mb-4">
                      <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{creator.name}</div>
                        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{creator.handle}</div>
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${creator.badge === "Studio" ? "text-[var(--lime)] bg-green-50" : "text-blue-600 bg-blue-50"}`}>
                            {creator.badge}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{creator.headline}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {creator.tools.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[var(--cream)] border border-[var(--cream-dark)]" style={{ color: "var(--text-secondary)" }}>{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--cream-dark)]">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium" style={{ color: "var(--text-primary)" }}>{creator.rating}</span>
                      </div>
                      <span className={`text-xs font-medium ${creator.availability === "Available" ? "text-green-600" : "text-amber-600"}`}>
                        ● {creator.availability}
                      </span>
                      <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>${creator.rate}/hr</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-label mb-4">PLATFORM TOOLS</div>
        <h2 className="heading-editorial text-4xl mb-12" style={{ color: "var(--text-primary)" }}>
          Everything you need.
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { emoji: "🧠", label: "Brief Intelligence", desc: "AI audits your brief in real-time", href: "/briefs/new" },
            { emoji: "⚖️", label: "Creator Compare", desc: "Side-by-side analysis", href: "/compare" },
            { emoji: "💰", label: "Budget Estimator", desc: "Instant cost estimate", href: "/estimator" },
            { emoji: "🛡️", label: "Risk Scanner", desc: "IP & licensing check", href: "/risk-scanner" },
            { emoji: "🏆", label: "Leaderboard", desc: "Top-ranked creators", href: "/leaderboard" },
            { emoji: "🧬", label: "Style DNA", desc: "Creator style radar", href: "/creators" },
            { emoji: "🎯", label: "Match Scoring", desc: "Explainable % match", href: "/briefs/new" },
            { emoji: "✅", label: "Verification", desc: "Audited proof of work", href: "/creators" },
          ].map((f) => (
            <Link key={f.label} href={f.href}>
              <div className="bg-white border border-[var(--cream-dark)] rounded-xl p-4 hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer">
                <div className="text-2xl mb-2">{f.emoji}</div>
                <div className="font-semibold text-sm mb-0.5" style={{ color: "var(--text-primary)" }}>{f.label}</div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{f.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="rounded-3xl p-12" style={{ background: "var(--dark-green)" }}>
            <div className="section-label mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>GET STARTED</div>
            <h2 className="heading-editorial text-4xl mb-4 text-white">
              Your next campaign<br />starts here.
            </h2>
            <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "0 auto 2rem" }}>
              Discover 18 verified AI creators, build structured briefs with Gemini AI, and get explainable match scores.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/login" className="btn-lime flex items-center gap-2 px-8 py-3.5 text-sm">
                Try the demo
              </Link>
              <Link href="/creators" className="btn-outline flex items-center gap-2 px-8 py-3.5 text-sm" style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>
                Browse creators <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
