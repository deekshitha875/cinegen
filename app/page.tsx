"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Star, Sparkles, Play, Zap, Shield, Trophy, BarChart3 } from "lucide-react";

const CREATORS = [
  { name: "Aryan Kapoor", role: "AI Filmmaker", rate: 95, rating: 4.9, tools: ["Runway", "Kling"], avatar: "https://picsum.photos/seed/aryan/200/200", id: "creator-001", available: true },
  { name: "Marcus Chen", role: "VFX Director", rate: 150, rating: 5.0, tools: ["Sora", "ComfyUI"], avatar: "https://picsum.photos/seed/marcus/200/200", id: "creator-005", available: false },
  { name: "Lena Volkov", role: "Music Video Dir.", rate: 130, rating: 4.9, tools: ["Higgsfield", "Runway"], avatar: "https://picsum.photos/seed/lena/200/200", id: "creator-008", available: true },
  { name: "Aisha Okafor", role: "Brand Storyteller", rate: 85, rating: 4.9, tools: ["Veo", "ElevenLabs"], avatar: "https://picsum.photos/seed/aisha/200/200", id: "creator-012", available: true },
  { name: "Zara Ahmed", role: "Fashion Filmmaker", rate: 120, rating: 4.85, tools: ["Midjourney", "Flux"], avatar: "https://picsum.photos/seed/zara/200/200", id: "creator-004", available: true },
  { name: "Rahul Sharma", role: "3D Visualizer", rate: 110, rating: 4.95, tools: ["ComfyUI", "Flux"], avatar: "https://picsum.photos/seed/rahul/200/200", id: "creator-003", available: false },
];

const STATS = [
  { value: 18, suffix: "", label: "Verified creators" },
  { value: 15, suffix: "+", label: "AI tools covered" },
  { value: 4.9, suffix: "★", label: "Avg. rating" },
  { value: 100, suffix: "%", label: "Satisfaction rate" },
];

const FEATURES = [
  { icon: Sparkles, title: "AI Brief Builder", desc: "Gemini turns your rough idea into a complete structured brief in seconds.", color: "#e8b84b" },
  { icon: Zap, title: "Smart Matching", desc: "Explainable % scores show exactly why each creator fits your brief.", color: "#3b82f6" },
  { icon: Shield, title: "Risk Scanner", desc: "IP, licensing, and commercial-use risks flagged before you engage.", color: "#ef4444" },
  { icon: BarChart3, title: "Brief Intelligence", desc: "Real-time audit of your brief — score, errors, warnings, fixes.", color: "#8b5cf6" },
  { icon: Trophy, title: "Creator Leaderboard", desc: "Rankings by projects, rating, and repeat clients.", color: "#f59e0b" },
  { icon: ArrowUpRight, title: "Style DNA", desc: "Radar chart showing each creator's dominant visual style.", color: "#10b981" },
];

// Animated counter component
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(parseFloat(current.toFixed(1)));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// 3D tilt card
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(10px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  };

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.15s ease", transformStyle: "preserve-3d" }}
      className={className}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const featuresRef = useRef(null);
  const creatorsRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const creatorsInView = useInView(creatorsRef, { once: true, margin: "-100px" });

  return (
    <div style={{ background: "var(--bg)", overflowX: "hidden" }}>

      {/* Judge banner */}
      {!bannerDismissed && (
        <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }}
          className="relative text-center py-3 px-4 text-sm font-medium"
          style={{ background: "var(--navy)", color: "white" }}>
          🎯 Hackathon Demo —{" "}
          <Link href="/login" className="font-bold underline" style={{ color: "var(--gold)" }}>
            1-click instant access
          </Link>
          {" "}· Brand & Creator accounts ready · No signup needed
          <button onClick={() => setBannerDismissed(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 text-lg">×</button>
        </motion.div>
      )}

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="mesh-gradient float-1" style={{ width: "600px", height: "600px", background: "var(--gold)", top: "-20%", left: "-10%" }} />
          <div className="mesh-gradient float-2" style={{ width: "500px", height: "500px", background: "var(--navy)", top: "20%", right: "-10%" }} />
          <div className="mesh-gradient float-3" style={{ width: "400px", height: "400px", background: "#3b82f6", bottom: "-10%", left: "30%" }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left — text */}
          <div className="lg:col-span-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="label mb-5 flex items-center gap-2">
                <span className="w-6 h-px" style={{ background: "var(--gold)" }} />
                AI-NATIVE CREATIVE MARKETPLACE
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="heading-xl mb-6" style={{ color: "var(--text-primary)" }}>
              Hire the{" "}
              <span className="relative inline-block">
                <span className="gradient-gold">world's best</span>
              </span>
              <br />
              <span style={{ color: "var(--navy)" }}>AI creators.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl mb-10 leading-relaxed" style={{ color: "var(--text-secondary)", maxWidth: "480px" }}>
              CineGen connects brands with verified AI filmmakers, animators and generative artists. Post a brief, get matched, create.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10">
              <Link href="/creators" className="btn-gold">
                Discover creators <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/demo" className="btn-dark">
                <Play className="w-4 h-4" /> Try the demo
              </Link>
              <Link href="/login" className="btn-outline">
                Judge login ↗
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {CREATORS.slice(0, 5).map((c) => (
                  <img key={c.id} src={c.avatar} alt={c.name}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>18 verified creators</div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                  <span className="text-xs ml-1" style={{ color: "var(--text-secondary)" }}>4.9 avg rating</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — floating creator cards */}
          <div className="lg:col-span-6 hidden lg:block relative h-[500px]">
            {CREATORS.slice(0, 4).map((creator, i) => {
              const positions = [
                { top: "0%", left: "10%", rotate: -3 },
                { top: "5%", right: "0%", rotate: 4 },
                { bottom: "10%", left: "0%", rotate: 2 },
                { bottom: "5%", right: "10%", rotate: -2 },
              ];
              const pos = positions[i];
              const floatClass = [`float-1`, `float-2`, `float-3`, `float-4`][i];

              return (
                <motion.div key={creator.id}
                  initial={{ opacity: 0, scale: 0.8, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                  className={`absolute ${floatClass}`}
                  style={{ ...pos, width: "200px" }}>
                  <TiltCard>
                    <div className="card-light p-4 shadow-xl">
                      <div className="flex items-center gap-2.5 mb-3">
                        <img src={creator.avatar} alt={creator.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
                        <div>
                          <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{creator.name}</div>
                          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{creator.role}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {creator.tools.map((t) => (
                          <span key={t} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--bg)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>${creator.rate}/hr</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${creator.available ? "badge-green" : "text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 text-xs font-medium"}`}>
                          {creator.available ? "● Available" : "● Limited"}
                        </span>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 border-y" style={{ background: "var(--navy)", borderColor: "var(--border-dark)" }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center">
              <div className="text-4xl font-black mb-1 gradient-gold">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CREATORS SHOWCASE ── */}
      <section className="py-24" ref={creatorsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }}
            animate={creatorsInView ? { opacity: 1, y: 0 } : {}}
            className="flex items-end justify-between mb-12">
            <div>
              <div className="label mb-3">TALENT</div>
              <h2 className="heading-lg" style={{ color: "var(--text-primary)" }}>
                Featured creators.
              </h2>
            </div>
            <Link href="/creators" className="btn-outline text-sm">
              View all 18 <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CREATORS.map((creator, i) => (
              <motion.div key={creator.id}
                initial={{ opacity: 0, y: 40 }}
                animate={creatorsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}>
                <TiltCard>
                  <Link href={`/creators/${creator.id}`}>
                    <div className="card-light p-5 cursor-pointer">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="relative">
                          <img src={creator.avatar} alt={creator.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md" />
                          {creator.available && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white" style={{ background: "#22c55e" }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{creator.name}</div>
                          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{creator.role}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{creator.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-lg" style={{ color: "var(--text-primary)" }}>${creator.rate}</div>
                          <div className="text-xs" style={{ color: "var(--text-muted)" }}>/hr</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {creator.tools.map((t) => (
                          <span key={t} className="badge-navy">{t}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                        <span className={creator.available ? "badge-green" : "text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 text-xs font-semibold"}>
                          {creator.available ? "Available" : "Limited"}
                        </span>
                        <span className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--navy)" }}>
                          View profile <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24" style={{ background: "var(--navy)" }} ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16">
            <div className="label mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>PLATFORM TOOLS</div>
            <h2 className="heading-lg text-white mb-4">
              Built for AI creative work.
            </h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.5)", maxWidth: "500px", margin: "0 auto" }}>
              Every tool you need to discover, brief, and hire AI creators — in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}>
                <TiltCard>
                  <div className="card-dark p-6" style={{ minHeight: "160px" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}>
                      <f.icon className="w-5 h-5" style={{ color: f.color }} />
                    </div>
                    <h3 className="font-bold text-base mb-2 text-white">{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{f.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* Feature links */}
          <motion.div initial={{ opacity: 0 }} animate={featuresInView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-10">
            {[
              { label: "💰 Budget Estimator", href: "/estimator" },
              { label: "🛡️ Risk Scanner", href: "/risk-scanner" },
              { label: "⚖️ Compare Creators", href: "/compare" },
              { label: "🏆 Leaderboard", href: "/leaderboard" },
              { label: "📂 Categories", href: "/categories" },
              { label: "🎯 Try Demo", href: "/demo" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {item.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative rounded-3xl p-14 overflow-hidden"
            style={{ background: "linear-gradient(135deg, var(--navy) 0%, #1e2d5a 100%)" }}>
            {/* Gold glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "var(--gold)", filter: "blur(80px)", opacity: 0.15 }} />
            <div className="relative">
              <div className="label mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>GET STARTED TODAY</div>
              <h2 className="heading-lg text-white mb-4">
                Your next campaign<br />
                <span className="gradient-gold">starts here.</span>
              </h2>
              <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.55)", maxWidth: "440px", margin: "0 auto 2.5rem" }}>
                Join brands using CineGen to discover AI creators and produce world-class content faster.
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
