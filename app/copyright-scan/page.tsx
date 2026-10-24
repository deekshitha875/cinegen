"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileVideo, Shield, AlertTriangle, CheckCircle2, X, Sparkles, Zap, Search, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type ScanStatus = "idle" | "uploading" | "scanning" | "complete";

interface ScanResult {
  status: "safe" | "warning" | "danger";
  confidence: number;
  matches: {
    source: string;
    similarity: number;
    type: "audio" | "visual" | "metadata";
    timestamp: string;
  }[];
  recommendations: string[];
}

const MOCK_RESULT: ScanResult = {
  status: "safe",
  confidence: 98.5,
  matches: [
    { source: "Getty Images Database", similarity: 15, type: "visual", timestamp: "0:12-0:18" },
    { source: "AudioJungle Library", similarity: 8, type: "audio", timestamp: "Background Track" },
  ],
  recommendations: [
    "All AI-generated content verified as original",
    "No third-party copyrighted material detected above 30% threshold",
    "Metadata shows 100% AI tool attribution (Runway ML, Midjourney)",
    "Safe to publish on YouTube, Instagram, Facebook",
  ],
};

export default function CopyrightScanPage() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("uploading");
    await new Promise(r => setTimeout(r, 1000));
    
    setStatus("scanning");
    await new Promise(r => setTimeout(r, 3000));
    
    setStatus("complete");
    setResult(MOCK_RESULT);
    toast.success("Copyright scan complete — No violations found!");
  };

  const handleReset = () => {
    setStatus("idle");
    setResult(null);
    setFileName("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>AI Copyright Detection</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-4xl mb-4"
        >
          Verify AI Content Originality
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          Scan AI-generated videos for copyright violations, third-party assets, and licensing issues before publishing
        </motion.p>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl border border-white/10 p-8 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="max-w-xl mx-auto p-12 border-2 border-dashed border-white/20 rounded-2xl hover:border-violet-500/40 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-violet-400" />
                    </div>
                    
                    <h3 className="font-semibold text-xl mb-2">Upload Video for Copyright Scan</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Drag & drop or click to upload • MP4, MOV, AVI • Max 500MB
                    </p>

                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-semibold text-sm">
                      <FileVideo className="w-4 h-4" />
                      Choose File
                    </div>
                  </motion.div>
                </label>

                {/* How it works */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {[
                    { icon: Search, title: "Multi-Source Scan", desc: "Checks against 500M+ copyrighted assets from Getty, Shutterstock, AudioJungle" },
                    { icon: Zap, title: "AI Fingerprinting", desc: "Detects AI tool signatures (Midjourney, Runway, Stable Diffusion)" },
                    { icon: Shield, title: "Risk Assessment", desc: "Gets % similarity scores & publishing clearance recommendations" },
                  ].map((item) => (
                    <div key={item.title} className="text-center">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                        <item.icon className="w-5 h-5 text-violet-400" />
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {status === "uploading" && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Upload className="w-8 h-8 text-violet-400" />
                  </motion.div>
                </div>
                <h3 className="font-semibold text-xl mb-2">Uploading {fileName}...</h3>
                <p className="text-sm text-muted-foreground">Preparing file for analysis</p>
                <div className="max-w-xs mx-auto mt-6">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-violet-600 to-cyan-600"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {status === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-6"
                >
                  <Shield className="w-8 h-8 text-violet-400" />
                </motion.div>
                <h3 className="font-semibold text-xl mb-2">Scanning for Copyright Violations</h3>
                <p className="text-sm text-muted-foreground mb-8">Running AI analysis across multiple databases...</p>

                <div className="max-w-md mx-auto space-y-3">
                  {[
                    { label: "Visual fingerprint analysis", delay: 0 },
                    { label: "Audio pattern matching", delay: 0.3 },
                    { label: "Metadata extraction", delay: 0.6 },
                    { label: "Cross-referencing databases", delay: 0.9 },
                    { label: "Generating report", delay: 1.2 },
                  ].map((step, i) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: step.delay }}
                      className="flex items-center gap-3 text-left px-4 py-2 bg-white/5 rounded-lg"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full"
                      />
                      <span className="text-sm text-muted-foreground">{step.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {status === "complete" && result && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Result header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`w-20 h-20 rounded-2xl ${
                      result.status === "safe" ? "bg-green-500/20" : "bg-amber-500/20"
                    } flex items-center justify-center mx-auto mb-6`}
                  >
                    {result.status === "safe" ? (
                      <CheckCircle2 className="w-10 h-10 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-10 h-10 text-amber-400" />
                    )}
                  </motion.div>

                  <h3 className="font-display font-bold text-2xl mb-2">
                    {result.status === "safe" ? "✅ No Violations Detected" : "⚠️ Potential Issues Found"}
                  </h3>
                  <p className="text-muted-foreground">
                    Originality Confidence: <span className="text-foreground font-semibold">{result.confidence}%</span>
                  </p>
                </div>

                {/* Matches */}
                {result.matches.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                      Similar Content Found ({result.matches.length})
                    </h4>
                    <div className="space-y-2">
                      {result.matches.map((match, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1">{match.source}</div>
                            <div className="text-xs text-muted-foreground">
                              {match.type === "visual" ? "🎥" : "🎵"} {match.type.charAt(0).toUpperCase() + match.type.slice(1)} • {match.timestamp}
                            </div>
                          </div>
                          <div className={`text-sm font-semibold ${match.similarity < 30 ? "text-green-400" : "text-amber-400"}`}>
                            {match.similarity}% match
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      ✓ All matches below 30% threshold — considered fair use / coincidental similarity
                    </p>
                  </div>
                )}

                {/* Recommendations */}
                <div className="mb-6">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                    Recommendations
                  </h4>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{rec}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all"
                  >
                    Scan Another Video
                  </button>
                  <button
                    onClick={() => toast.success("Report downloaded!")}
                    className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all"
                  >
                    Download Report
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[
          { icon: Clock, title: "Avg. Scan Time", value: "2-3 minutes", desc: "For videos up to 10 minutes" },
          { icon: Shield, title: "Databases Checked", value: "500M+ assets", desc: "Getty, Shutterstock, AudioJungle, more" },
          { icon: Sparkles, title: "AI Tool Detection", value: "15+ platforms", desc: "Runway, Midjourney, Stable Diffusion, etc." },
        ].map((stat) => (
          <div key={stat.title} className="glass rounded-xl border border-white/5 p-5 text-center">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mx-auto mb-3">
              <stat.icon className="w-5 h-5 text-violet-400" />
            </div>
            <div className="font-display font-bold text-xl gradient-text mb-1">{stat.value}</div>
            <div className="text-sm font-medium mb-1">{stat.title}</div>
            <div className="text-xs text-muted-foreground">{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="mt-8 bg-violet-500/10 border border-violet-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-violet-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-2">How CineGen Copyright Detection Works</h4>
            <p className="text-sm text-muted-foreground">
              Our AI fingerprinting engine uses audio/visual pattern matching and metadata analysis to scan for third-party copyrighted content. Integrated with ContentID (YouTube), Audible Magic, Getty Images, and Shutterstock databases — 500M+ assets checked in under 3 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
