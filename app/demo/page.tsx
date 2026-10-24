"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Zap, Users, ArrowRight, Play, CheckCircle } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import Link from "next/link";

const FEATURES = [
  "18 verified AI creator profiles with Style DNA",
  "Gemini-powered AI Brief Builder",
  "Explainable match scores (6 weighted factors)",
  "Brief Intelligence real-time audit",
  "Budget Estimator & IP Risk Scanner",
  "Full project + messaging workflow",
];

export default function DemoPage() {
  const { loginAsRole } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<"brand" | "creator" | null>(null);

  const handleDemo = (role: "brand" | "creator") => {
    setLoading(role);
    loginAsRole(role);
    toast.success(
      role === "brand"
        ? "✨ Logged in as Brand — Arjun Mehta"
        : "✨ Logged in as Creator — Aryan Kapoor",
      { duration: 3000 }
    );
    setTimeout(() => {
      router.push(role === "brand" ? "/briefs/new" : "/briefs");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl"
        />
      </div>

      <div className="relative w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Live Interactive Demo — No signup needed
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">
            Try <span className="gradient-text">CineGen</span> Right Now
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Jump into a fully loaded demo with real data, AI features, and creator profiles — instantly.
          </p>
        </motion.div>

        {/* Two demo cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* Brand demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl border border-violet-500/20 p-6 hover:border-violet-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-display font-bold text-xl mb-2">I'm a Brand</h2>
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
              Post a brief with Gemini AI, see explainable creator matches, hire in one click.
            </p>
            <ul className="space-y-2 mb-6">
              {["AI Brief Builder", "Creator matching", "Brief Intelligence audit"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleDemo("brand")}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-violet-400 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-60"
            >
              {loading === "brand" ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Loading brand demo...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start as Brand
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-xs text-center text-muted-foreground mt-2">brand@cinegen.demo</p>
          </motion.div>

          {/* Creator demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-display font-bold text-xl mb-2">I'm a Creator</h2>
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
              Browse live briefs, see your match scores, submit proposals, manage projects.
            </p>
            <ul className="space-y-2 mb-6">
              {["Browse open briefs", "Submit proposals", "Project management"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleDemo("creator")}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-60"
            >
              {loading === "creator" ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Loading creator demo...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  Start as Creator
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-xs text-center text-muted-foreground mt-2">creator@cinegen.demo</p>
          </motion.div>
        </div>

        {/* Features strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl border border-white/5 p-5"
        >
          <p className="text-xs text-muted-foreground text-center uppercase tracking-widest mb-4 font-medium">
            What you'll experience
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-violet-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground leading-relaxed">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Or{" "}
          <Link href="/creators" className="text-violet-400 hover:text-violet-300 transition-colors">
            browse creators as a guest
          </Link>{" "}
          without signing in.
        </p>
      </div>
    </div>
  );
}
