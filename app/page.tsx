"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight, Star, Sparkles, Play, Zap, Shield, Trophy, BarChart3, CheckCircle, Search } from "lucide-react";

const CREATORS = [
  { name: "Aryan Kapoor", role: "AI Filmmaker", rate: 95, rating: 4.9, tools: ["Runway", "Kling"], avatar: "https://picsum.photos/seed/aryan/200/200", id: "creator-001", available: true, projects: 47 },
  { name: "Marcus Chen", role: "VFX Director", rate: 150, rating: 5.0, tools: ["Sora", "ComfyUI"], avatar: "https://picsum.photos/seed/marcus/200/200", id: "creator-005", available: false, projects: 28 },
  { name: "Lena Volkov", role: "Music Video", rate: 130, rating: 4.9, tools: ["Higgsfield", "Runway"], avatar: "https://picsum.photos/seed/lena/200/200", id: "creator-008", available: true, projects: 35 },
  { name: "Aisha Okafor", role: "Brand Stories", rate: 85, rating: 4.9, tools: ["Veo", "ElevenLabs"], avatar: "https://picsum.photos/seed/aisha/200/200", id: "creator-012", available: true, projects: 52 },
  { name: "Zara Ahmed", role: "Fashion Film", rate: 120, rating: 4.85, tools: ["Midjourney", "Flux"], avatar: "https://picsum.photos/seed/zara/200/200", id: "creator-004", available: true, projects: 55 },
  { name: "Rahul Sharma", role: "3D Visualizer", rate: 110, rating: 4.95, tools: ["ComfyUI", "Flux"], avatar: "https://picsum.photos/seed/rahul/200/200", id: "creator-003", available: false, projects: 31 },
];

const FEATURES = [
  { icon: Sparkles, title: "AI Brief Builder", desc: "Gemini turns your idea into a complete structured brief in seconds.", color: "#e8b84b", href: "/briefs/new" },
  { icon: Zap, title: "Smart Matching", desc: "Explainable % scores show exactly why each creator fits your brief.", color: "#3b82f6", href: "/briefs/new" },
  { icon: Shield, title: "Risk Scanner", desc: "IP, licensing, and commercial risks flagged before you engage.", color: "#ef4444", href: "/risk-scanner" },
  { icon: BarChart3, title: "Brief Intelligence", desc: "Real-time audit — score, errors, warnings, fix suggestions.", color: "#8b5cf6", href: "/briefs/new" },
  { icon: Trophy, title: "Leaderboard", desc: "Creator rankings by projects, rating, and repeat clients.", color: "#f59e0b", href: "/leaderboard" },
  { icon: Search, title: "Style DNA", desc: "Radar chart showing each creator's dominant visual style.", color: "#10b981", href: "/creators" },
];

const STEPS = [
  { num: "01", title: "Discover", desc: "Search 18+ verified AI creators by tools, specialization, and rate.", icon: Search },
  { num: "02", title: "Build a Brief", desc: "Use AI Brief Builder to generate a complete creative brief from your idea.", icon: Sparkles },
  { num: "03", title: "Get Matched", desc: "See explainable % match scores and hire the right creator.", icon: CheckCircle },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const duration = 1200;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(parseFloat(start.toFixed(1)));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* Banner */}
      {!dismissed && (
        <div className="relative text-center py-2.5 px-4 text-sm font-medium" style={{ background: "var(--navy)", color: "white" }}>
          🎯 Hackathon Demo —{" "}
          <Link href="/login" className="font-bold underline" style={{ color: "var(--gold)" }}>instant 1-click access</Link>
          {" "}· Brand & Creator accounts ready
          <button onClick={() => setDismissed(true)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100">×</button>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute rounded-full opacity-10" style={{ width: 700, height: 700, background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)", top: "-200px", right: "-200px" }} />
          <div className="absolute rounded-full opacity-8" style={{ width: 500, height: 500, background: "radial-gradient(circle, var(--navy) 0%, transparent 70%)", bottom: "-100px", left: "-100px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Top label */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gold)" }} />
            <span className="label">AI-NATIVE CREATIVE MARKETPLACE · KAMPUS.VC HACKATHON</span>
          </motion.div>

          {/* Hero content + visual side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, color: "var(--text-primary)" }}>
                Hire the{" "}
                <span className="relative">
                  <span style={{ color: "var(--gold-dark)", fontStyle: "italic" }}>world's best</span>
                </span>
                <br />
                <span style={{ color: "var(--navy)" }}>AI creators.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-6 text-lg leading-relaxed" style={{ color: "var(--text-secondary)", maxWidth: "440px" }}>
                CineGen connects brands with verified AI filmmakers, animators, and generative artists. Post a brief, get matched, create.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3 mt-8">
                <Link href="/creators" className="btn-gold">
                  Discover creators <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/briefs/new" className="btn-dark">
                  <Sparkles className="w-4 h-4" /> AI Brief Builder
                </Link>
                <Link href="/demo" className="btn-outline">
                  <Play className="w-4 h-4" /> Try Demo
                </Link>
              </motion.div>

              {/* Avatars */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex items-center gap-3 mt-8">
                <div className="flex -space-x-2">
                  {CREATORS.slice(0, 5).map((c) => (
                    <img key={c.id} src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>18 verified AI creators</div>
                  <div className="flex gap-0.5 items-center">
                    {[1,2,3,4,5].map((s) => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                    <span className="text-xs ml-1" style={{ color: "var(--text-secondary)" }}>4.9 avg</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right — Creator cards grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {CREATORS.slice(0, 4).map((creator, i) => (
                <motion.div key={creator.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }}
                  style={{ background: "white", border: "1px solid var(--border)", borderRadius: 16, padding: 16, cursor: "pointer", transition: "box-shadow 0.3s ease" }}>
                  <Link href={`/creators/${creator.id}`}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="relative">
                        <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                          style={{ background: creator.available ? "#22c55e" : "#f59e0b" }} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{creator.name}</div>
                        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{creator.role}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {creator.tools.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(232,184,75,0.1)", color: "var(--gold-dark)", border: "1px solid rgba(232,184,75,0.25)" }}>{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>${creator.rate}/hr</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{creator.rating}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-14 border-y" style={{ background: "var(--navy)", borderColor: "#1e2540" }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 18, suffix: "", label: "Verified creators" },
            { value: 15, suffix: "+", label: "AI tools covered" },
            { value: 4.9, suffix: "★", label: "Avg. creator rating" },
            { value: 100, suffix: "%", label: "Satisfaction rate" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-4xl font-black mb-1" style={{ color: "var(--gold)", fontFamily: "Syne, Inter, sans-serif" }}>
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="label mb-3">HOW IT WORKS</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            From idea to delivery<br /><span style={{ color: "var(--gold-dark)" }}>in three steps.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div key={step.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <div className="relative p-7 rounded-2xl h-full" style={{ background: "white", border: "1px solid var(--border)" }}>
                <div className="text-6xl font-black mb-4 opacity-10" style={{ color: "var(--navy)", fontFamily: "Syne, Inter, sans-serif" }}>{step.num}</div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(232,184,75,0.12)", border: "1px solid rgba(232,184,75,0.25)" }}>
                  <step.icon className="w-5 h-5" style={{ color: "var(--gold-dark)" }} />
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: "var(--text-primary)" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 rounded-full flex items-center justify-center z-10"
                    style={{ background: "white", border: "1px solid var(--border)" }}>
                    <ArrowRight className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CREATORS GRID ── */}
      <section className="py-24 border-t px-4 sm:px-6 lg:px-8" style={{ background: "white", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="label mb-3">FEATURED TALENT</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                Meet the creators.
              </h2>
            </motion.div>
            <Link href="/creators" className="btn-outline text-sm hidden sm:flex">
              All 18 creators <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CREATORS.map((creator, i) => (
              <motion.div key={creator.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}>
                <Link href={`/creators/${creator.id}`}>
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 20, padding: 20, cursor: "pointer", transition: "box-shadow 0.25s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="relative flex-shrink-0">
                        <img src={creator.avatar} alt={creator.name} className="w-14 h-14 rounded-2xl object-cover" style={{ border: "2px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                          style={{ background: creator.available ? "#22c55e" : "#f59e0b" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{creator.name}</div>
                        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{creator.role}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{creator.rating}</span>
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>({creator.projects} projects)</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-black text-xl" style={{ color: "var(--text-primary)" }}>${creator.rate}</div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>/hr</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {creator.tools.map((t) => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: "white", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${creator.available ? "text-green-700 bg-green-100" : "text-amber-700 bg-amber-100"}`}>
                        ● {creator.available ? "Available" : "Limited"}
                      </span>
                      <span className="text-sm font-semibold flex items-center gap-1" style={{ color: "var(--navy)" }}>
                        View profile <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="label mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>UNIQUE CAPABILITIES</div>
            <h2 className="text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Built for AI creative work.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}>
                <Link href={f.href}>
                  <div className="p-6 rounded-2xl h-full cursor-pointer transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.borderColor = `${f.color}40`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                      <f.icon className="w-5 h-5" style={{ color: f.color }} />
                    </div>
                    <h3 className="font-bold text-base mb-2 text-white">{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{f.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative rounded-3xl p-14 overflow-hidden"
            style={{ background: "linear-gradient(135deg, var(--navy) 0%, #1e2d5a 60%, #0f1729 100%)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(232,184,75,0.2) 0%, transparent 60%)" }} />
            <div className="relative">
              <div className="label mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>START TODAY — FREE</div>
              <h2 className="text-white mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Your next campaign<br />
                <span style={{ color: "var(--gold)" }}>starts here.</span>
              </h2>
              <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.5)", maxWidth: "400px", margin: "0 auto 2.5rem" }}>
                Discover verified AI creators, build briefs with Gemini AI, get explainable match scores.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login" className="btn-gold">
                  <Sparkles className="w-4 h-4" /> Try Demo — Instant Access
                </Link>
                <Link href="/creators" className="btn-outline" style={{ borderColor: "rgba(255,255,255,0.2)", color: "white" }}>
                  Browse creators <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
