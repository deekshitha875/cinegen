"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, Shield, X, ArrowLeft, Zap, Play, Eye, MapPin, Clock, BarChart3 } from "lucide-react";
import { useCreator } from "@/hooks/useCreators";
import { useSession } from "@/hooks/useSession";
import { PortfolioItem, WorkflowStep } from "@/types";
import { toast } from "sonner";
import { StyleDNA } from "@/components/creators/StyleDNA";

const BADGE_CONFIG = {
  Studio: { bg: "#0f1729", text: "★ Studio Verified" },
  Verified: { bg: "#1a4a2e", text: "✓ Verified Creator" },
  Rising: { bg: "#7a4a00", text: "↑ Rising Creator" },
  Unverified: { bg: "#3a3a3a", text: "Unverified" },
};

const PROF_STYLES: Record<string, { bg: string; color: string }> = {
  Expert: { bg: "rgba(232,184,75,0.12)", color: "#8a6a10" },
  Advanced: { bg: "rgba(59,130,246,0.1)", color: "#1d4ed8" },
  Intermediate: { bg: "rgba(16,185,129,0.1)", color: "#065f46" },
  Beginner: { bg: "rgba(0,0,0,0.05)", color: "#666" },
};

function WorkflowTimeline({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={step.step} className="flex gap-3">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--navy)" }}>
              {step.step}
            </div>
            {i < steps.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: "var(--border)" }} />}
          </div>
          <div className="pb-4 flex-1">
            <span className="text-sm font-bold" style={{ color: "var(--gold-dark)" }}>{step.tool}</span>
            {step.prompt && (
              <div className="mt-1.5 p-3 rounded-lg text-xs font-mono italic" style={{ background: "var(--bg)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                "{step.prompt}"
              </div>
            )}
            {step.note && <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{step.note}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function PortfolioModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl"
            style={{ borderColor: "var(--border)" }}>
            <div>
              <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{item.title}</h2>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.contentType} · {item.aspectRatio} · {item.year}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Media */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ paddingBottom: item.aspectRatio === "9:16" ? "60%" : "56.25%" }}>
              <img src={item.thumbnailUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(232,184,75,0.9)", boxShadow: "0 4px 20px rgba(232,184,75,0.4)" }}>
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>
              <div className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-semibold text-white"
                style={{ background: "rgba(232,184,75,0.9)" }}>✨ AI-Generated</div>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.description}</p>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Style</p>
              <div className="flex flex-wrap gap-1.5">
                {item.styleTags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>#{tag}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Tools Used</p>
              <div className="flex flex-wrap gap-1.5">
                {item.toolsUsed.map((tool) => (
                  <span key={tool} className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: "rgba(232,184,75,0.12)", color: "var(--gold-dark)", border: "1px solid rgba(232,184,75,0.3)" }}>{tool}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Production Workflow</p>
              <WorkflowTimeline steps={item.workflow} />
            </div>

            <div className="p-4 rounded-xl grid grid-cols-3 gap-4" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              {[
                { label: "License", value: item.commercialUse.licenseTier },
                { label: "Model Indemnity", value: item.commercialUse.modelIndemnity ? "✓ Included" : "✗ Not included", ok: item.commercialUse.modelIndemnity },
                { label: "Training Data", value: item.commercialUse.trainingDataClean ? "✓ Clean" : "⚠ Unverified", ok: item.commercialUse.trainingDataClean },
              ].map((c) => (
                <div key={c.label} className="text-center">
                  <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{c.label}</div>
                  <div className="text-sm font-bold" style={{ color: c.ok === false ? "#dc2626" : c.ok === true ? "#16a34a" : "var(--gold-dark)" }}>{c.value}</div>
                </div>
              ))}
            </div>

            <button onClick={() => { toast.success("Request sent!"); onClose(); }}
              className="btn-dark w-full justify-center py-3.5 text-sm">
              Request This Workflow
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function CreatorProfilePage({ params }: { params: { id: string } }) {
  const creator = useCreator(params.id);
  const { session } = useSession();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <h2 className="font-bold text-2xl mb-3" style={{ color: "var(--text-primary)" }}>Creator not found</h2>
          <Link href="/creators" className="font-medium hover:underline" style={{ color: "var(--navy)" }}>← Back to creators</Link>
        </div>
      </div>
    );
  }

  const badge = BADGE_CONFIG[creator.verification.badge];

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Hero cover */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img src={creator.coverUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,23,41,0.8) 0%, transparent 60%)" }} />
        {/* Back button */}
        <Link href="/creators" className="absolute top-4 left-4 flex items-center gap-1.5 text-sm font-medium text-white px-3 py-2 rounded-xl transition-colors"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        {/* Badge */}
        <div className="absolute top-4 right-4 text-xs font-bold text-white px-3 py-1.5 rounded-full"
          style={{ background: badge.bg }}>
          {badge.text}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="relative -mt-16 mb-8 flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <img src={creator.avatarUrl} alt={creator.name}
            className="w-28 h-28 rounded-2xl object-cover shadow-xl"
            style={{ border: "4px solid white" }} />
          <div className="flex-1 min-w-0 sm:pb-2">
            <h1 className="font-black text-3xl mb-0.5" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{creator.name}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{creator.handle}</span>
              <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                <MapPin className="w-3.5 h-3.5" />{creator.location}
              </span>
              <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                <Clock className="w-3.5 h-3.5" />{creator.stats.responseTime}
              </span>
            </div>
            <p className="text-sm font-semibold mt-1" style={{ color: "var(--gold-dark)" }}>{creator.headline}</p>
          </div>
          <div className="sm:pb-2 flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>${creator.hourlyRateUsd}<span className="text-base font-normal" style={{ color: "var(--text-secondary)" }}>/hr</span></div>
              <div className={`text-sm font-semibold ${creator.availability === "Available" ? "text-green-600" : creator.availability === "Limited" ? "text-amber-600" : "text-red-500"}`}>
                ● {creator.availability}
              </div>
            </div>
            {session?.role === "brand" && (
              <div className="flex flex-col gap-2">
                <button onClick={() => toast.success(`Invited ${creator.name}!`)} className="btn-gold text-sm px-5 py-2.5">
                  Invite to Brief
                </button>
                <Link href="/briefs/new" className="btn-outline text-sm px-5 py-2.5 text-center">
                  Post a Brief
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid var(--border)" }}>
              <h2 className="font-bold text-lg mb-3" style={{ color: "var(--text-primary)" }}>About</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{creator.bio}</p>
            </div>

            {/* Portfolio */}
            <div>
              <h2 className="font-bold text-xl mb-4" style={{ color: "var(--text-primary)" }}>Portfolio</h2>
              <div className="columns-1 sm:columns-2 gap-4 space-y-4">
                {creator.portfolio.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                    onClick={() => setSelectedItem(item)}
                    className="break-inside-avoid bg-white rounded-xl overflow-hidden cursor-pointer group transition-all hover:-translate-y-1"
                    style={{ border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)")}>
                    <div className="relative overflow-hidden" style={{ aspectRatio: item.aspectRatio === "9:16" ? "9/16" : "16/9", maxHeight: "200px" }}>
                      <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(0,0,0,0.3)" }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(232,184,75,0.9)" }}>
                          {item.mediaType === "video" ? <Play className="w-4 h-4 text-white fill-white ml-0.5" /> : <Eye className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full capitalize text-white font-medium"
                        style={{ background: "rgba(0,0,0,0.5)" }}>{item.mediaType}</div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                      <p className="text-xs line-clamp-2 mb-2" style={{ color: "var(--text-secondary)" }}>{item.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {item.toolsUsed.slice(0, 3).map((t) => (
                          <span key={t} className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{ background: "rgba(232,184,75,0.1)", color: "var(--gold-dark)" }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-5">
            {/* Stats */}
            <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--border)" }}>
              <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: creator.stats.projectsCompleted, label: "Projects", color: "var(--navy)" },
                  { value: `${creator.stats.avgRating}★`, label: "Rating", color: "#d97706" },
                  { value: `${creator.stats.repeatClientRate}%`, label: "Repeat Clients", color: "#16a34a" },
                  { value: creator.stats.responseTime, label: "Response", color: "var(--gold-dark)", small: true },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: "var(--bg)" }}>
                    <div className={`${s.small ? "text-sm" : "text-xl"} font-black mb-0.5`} style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification */}
            <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--border)" }}>
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Shield className="w-4 h-4" style={{ color: "var(--gold-dark)" }} /> Verification & Evidence
              </h3>
              <div className="space-y-3">
                {[
                  { key: "toolsVerified", label: "Tools Verified", evidence: ["ComfyUI node graph exported", "Runway API usage logs"] },
                  { key: "workflowVerified", label: "Workflow Verified", evidence: ["Step-by-step screenshots", "Intermediate render passes"] },
                  { key: "pastWorkVerified", label: "Past Work Verified", evidence: ["2 client references confirmed", "Invoice history reviewed"] },
                ].map((v) => {
                  const verified = creator.verification[v.key as keyof typeof creator.verification] as boolean;
                  return (
                    <div key={v.key} className="p-3 rounded-xl" style={{ background: verified ? "rgba(22,163,74,0.05)" : "var(--bg)", border: `1px solid ${verified ? "rgba(22,163,74,0.2)" : "var(--border)"}` }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: verified ? "rgba(22,163,74,0.15)" : "rgba(0,0,0,0.06)" }}>
                          {verified ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <X className="w-3 h-3" style={{ color: "var(--text-muted)" }} />}
                        </div>
                        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{v.label}</span>
                      </div>
                      {verified && (
                        <div className="ml-7 space-y-1">
                          {v.evidence.map((e) => (
                            <div key={e} className="text-xs flex items-center gap-1.5 text-green-700">
                              <div className="w-1 h-1 rounded-full bg-green-500" />{e}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Tools */}
            <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--border)" }}>
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Zap className="w-4 h-4" style={{ color: "var(--gold-dark)" }} /> AI Tools & Proficiency
              </h3>
              <div className="space-y-2">
                {creator.verifiedTools.map((t) => {
                  const style = PROF_STYLES[t.proficiency] || PROF_STYLES.Beginner;
                  return (
                    <div key={t.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {t.verified && <CheckCircle className="w-3.5 h-3.5 text-green-600" />}
                        <span className="text-sm" style={{ color: "var(--text-primary)" }}>{t.name}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: style.bg, color: style.color }}>
                        {t.proficiency}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Style DNA */}
            <StyleDNA creator={creator} />

            {/* Skills */}
            <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--border)" }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text-primary)" }}>Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {creator.skills.map((s) => (
                  <span key={s} className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--border)" }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text-primary)" }}>Languages</h3>
              <div className="flex flex-wrap gap-1.5">
                {creator.languages.map((l) => (
                  <span key={l} className="text-xs px-2 py-1 rounded-lg font-medium"
                    style={{ background: "rgba(232,184,75,0.1)", border: "1px solid rgba(232,184,75,0.25)", color: "var(--gold-dark)" }}>
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedItem && <PortfolioModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}
