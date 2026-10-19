"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CheckCircle, ArrowRight, Star, ChevronRight } from "lucide-react";
import { seedCreators } from "@/lib/seed/creators";
import { computeMatchScore } from "@/lib/matchScore";

const CONTENT_TYPES = ["AI Filmmaking", "Brand Film", "Animation", "Social Media Pack", "Product Visualization", "Fashion Editorial"];
const PLATFORMS = ["Instagram", "YouTube", "TikTok", "TV / OTT", "All Platforms"];
const BUDGETS = ["Under $500", "$500–$1,500", "$1,500–$5,000", "$5,000+"];

type Step = 1 | 2 | 3 | 4;

export default function DemoPage() {
  const [step, setStep] = useState<Step>(1);
  const [title, setTitle] = useState("Launch film for a new café");
  const [contentType, setContentType] = useState("Brand Film");
  const [platform, setPlatform] = useState("Instagram");
  const [budget, setBudget] = useState("$500–$1,500");
  const [shortlisted, setShortlisted] = useState<string | null>(null);

  const matches = useMemo(() => {
    return seedCreators
      .map((c) => ({
        creator: c,
        score: Math.floor(Math.random() * 40 + 60), // demo scores
        reasons: [`${contentType} specialist`, `${platform} platform`, "Available now"],
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [contentType, platform]);

  const steps = [
    { num: 1, label: "Brief" },
    { num: 2, label: `${matches.length} creator matches` },
    { num: 3, label: "Choose a creator" },
    { num: 4, label: "Preview inquiry" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="section-label mb-3">INTERACTIVE PRODUCT WALKTHROUGH / NO SIGN-IN</div>
          <h1 className="heading-editorial text-5xl mb-3" style={{ color: "var(--text-primary)" }}>
            Try the whole idea.
          </h1>
          <p className="text-lg mb-4" style={{ color: "var(--text-secondary)" }}>
            Edit a brief, inspect explainable matches, shortlist a creator, and preview an inquiry.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--cream-dark)] bg-white text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--lime)" }} />
            Public demonstration — nothing is published, sent, or saved.
          </div>
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => step > s.num && setStep(s.num as Step)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  step === s.num
                    ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-white"
                    : step > s.num
                    ? "border-[var(--lime)] bg-[var(--lime)]/10 text-[var(--text-primary)] cursor-pointer"
                    : "border-[var(--cream-dark)] bg-white text-[var(--text-secondary)]"
                }`}>
                {step > s.num && <CheckCircle className="w-3.5 h-3.5 text-[var(--lime)]" />}
                <span>0{s.num}</span>
                <span>{s.label}</span>
                {step > s.num && <CheckCircle className="w-3.5 h-3.5" />}
              </button>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-secondary)" }} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Step 1 — Brief */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="brief" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-[var(--cream-dark)] rounded-2xl p-6">
                <div className="section-label mb-4">01 / YOUR CAMPAIGN</div>
                <h2 className="heading-editorial text-3xl mb-6" style={{ color: "var(--text-primary)" }}>
                  Shape the brief.
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block" style={{ color: "var(--text-primary)" }}>Project title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)}
                      className="input-editorial w-full" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block" style={{ color: "var(--text-primary)" }}>Content type</label>
                    <div className="flex flex-wrap gap-2">
                      {CONTENT_TYPES.map((ct) => (
                        <button key={ct} onClick={() => setContentType(ct)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-all ${contentType === ct ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-white" : "border-[var(--cream-dark)] bg-white hover:border-[var(--text-primary)]"}`}
                          style={{ color: contentType === ct ? "white" : "var(--text-secondary)" }}>
                          {ct}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block" style={{ color: "var(--text-primary)" }}>Platform</label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((p) => (
                        <button key={p} onClick={() => setPlatform(p)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-all ${platform === p ? "border-[var(--lime)] bg-[var(--lime)]/10 text-[var(--text-primary)]" : "border-[var(--cream-dark)] bg-white"}`}
                          style={{ color: platform === p ? "var(--text-primary)" : "var(--text-secondary)" }}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block" style={{ color: "var(--text-primary)" }}>Budget</label>
                    <div className="flex flex-wrap gap-2">
                      {BUDGETS.map((b) => (
                        <button key={b} onClick={() => setBudget(b)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-all ${budget === b ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-white" : "border-[var(--cream-dark)] bg-white"}`}
                          style={{ color: budget === b ? "white" : "var(--text-secondary)" }}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={() => setStep(2)}
                  className="btn-dark flex items-center gap-2 px-6 py-3 text-sm mt-6">
                  See creator matches <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 2 — Matches */}
            {step === 2 && (
              <motion.div key="matches" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-[var(--cream-dark)] rounded-2xl p-6">
                <div className="section-label mb-4">02 / EXPLAINABLE MATCHES</div>
                <h2 className="heading-editorial text-3xl mb-2" style={{ color: "var(--text-primary)" }}>
                  See the fit.
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                  Scores show overlap with category, skills, platform, and budget.
                </p>

                <div className="space-y-3">
                  {matches.slice(0, 5).map((match, i) => (
                    <div key={match.creator.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:border-[var(--text-primary)] ${shortlisted === match.creator.id ? "border-[var(--lime)] bg-[var(--lime)]/5" : "border-[var(--cream-dark)]"}`}
                      onClick={() => { setShortlisted(match.creator.id); setStep(3); }}>
                      <img src={match.creator.avatarUrl} alt={match.creator.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{match.creator.name}</div>
                        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{match.creator.headline}</div>
                        <div className="flex gap-1 mt-1">
                          {match.reasons.slice(0, 2).map((r) => (
                            <span key={r} className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--cream)] border border-[var(--cream-dark)]" style={{ color: "var(--text-secondary)" }}>{r}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold" style={{ color: match.score >= 80 ? "var(--lime)" : "var(--text-primary)" }}>{match.score}</div>
                        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>/100</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3 — Choose creator */}
            {step === 3 && (
              <motion.div key="choose" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-[var(--cream-dark)] rounded-2xl p-6">
                <div className="section-label mb-4">03 / INQUIRY PREVIEW</div>
                <h2 className="heading-editorial text-3xl mb-2" style={{ color: "var(--text-primary)" }}>
                  Choose a creator above.
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                  This is a private drafting preview. It does not contact the creator.
                </p>

                {shortlisted && (() => {
                  const creator = seedCreators.find((c) => c.id === shortlisted);
                  if (!creator) return null;
                  return (
                    <div>
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--cream-dark)] mb-4">
                        <img src={creator.avatarUrl} alt={creator.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{creator.name}</div>
                          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{creator.headline}</div>
                        </div>
                      </div>
                      <button onClick={() => setStep(4)} className="btn-lime flex items-center gap-2 px-6 py-3 text-sm w-full justify-center">
                        Preview inquiry <ArrowRight className="w-4 h-4" />
                      </button>
                      <Link href={`/creators/${creator.id}`}
                        className="flex items-center justify-center gap-1 mt-3 text-sm hover:underline" style={{ color: "var(--text-secondary)" }}>
                        View public profile →
                      </Link>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* Step 4 — Inquiry */}
            {step === 4 && (
              <motion.div key="inquiry" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="bg-white border border-[var(--cream-dark)] rounded-2xl p-6">
                <div className="section-label mb-4">04 / CREATOR INQUIRY</div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="heading-editorial text-2xl" style={{ color: "var(--text-primary)" }}>Message draft</h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">DEMO ONLY</span>
                </div>
                <textarea
                  defaultValue={`Hi, I like your work. Would you be interested in working on "${title}"? We're looking for ${contentType} content for ${platform}, budget ${budget}.`}
                  rows={6}
                  className="input-editorial w-full resize-none mb-4"
                />
                <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
                  In a real account, this message would be sent via the CineGen inbox. Nothing is sent in demo mode.
                </p>
                <div className="flex gap-3">
                  <button className="btn-dark flex items-center gap-2 px-6 py-3 text-sm flex-1 justify-center opacity-50 cursor-not-allowed">
                    Send inquiry (demo only)
                  </button>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--cream-dark)] text-center">
                  <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>Ready to try for real?</p>
                  <Link href="/register" className="btn-lime px-6 py-2.5 text-sm inline-block">
                    Create a free account
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right panel — always show brief summary */}
          <div className="space-y-4">
            <div className="bg-white border border-[var(--cream-dark)] rounded-2xl p-6">
              <div className="section-label mb-3">YOUR BRIEF SUMMARY</div>
              <div className="space-y-3">
                {[
                  { label: "Title", value: title },
                  { label: "Content Type", value: contentType },
                  { label: "Platform", value: platform },
                  { label: "Budget", value: budget },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-[var(--cream-dark)] last:border-0">
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[var(--cream-dark)] rounded-2xl p-6">
              <div className="section-label mb-3">WANT THE FULL EXPERIENCE?</div>
              <h3 className="heading-editorial text-xl mb-3" style={{ color: "var(--text-primary)" }}>
                Post a real brief.
              </h3>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                Create an account to publish a live brief, receive real proposals, and hire a creator.
              </p>
              <Link href="/register" className="btn-dark flex items-center gap-2 px-5 py-2.5 text-sm w-full justify-center">
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="flex items-center justify-center gap-1 mt-3 text-sm hover:underline" style={{ color: "var(--text-secondary)" }}>
                Already a member? Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
