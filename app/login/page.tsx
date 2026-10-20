"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, ArrowRight, Copy, Check, Zap } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded-lg transition-colors hover:bg-black/5">
      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />}
    </button>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginAsRole, session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) { window.location.href = "/dashboard"; }
  }, [session]);

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "var(--gold)" }} />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const ok = login(email, password);
    if (ok) {
      toast.success("Welcome to CineGen!");
      window.location.href = "/dashboard";
    } else {
      setError("Invalid credentials. Try the demo accounts below.");
    }
    setLoading(false);
  };

  const handleOneClick = (role: "brand" | "creator") => {
    loginAsRole(role);
    toast.success(`Logged in as ${role === "brand" ? "Brand" : "Creator"}`);
    window.location.href = "/dashboard";
  };

  const DEMO_ACCOUNTS = [
    { role: "brand" as const, label: "Brand Account", email: "brand@cinegen.demo", desc: "Post briefs, discover creators", icon: Sparkles, color: "var(--navy)" },
    { role: "creator" as const, label: "Creator Account", email: "creator@cinegen.demo", desc: "Browse briefs, submit proposals", icon: Zap, color: "var(--gold-dark)" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: "var(--navy)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(232,184,75,0.2) 0%, transparent 60%)" }} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--gold), #c49a2a)" }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl text-white" style={{ fontFamily: "Syne, Inter, sans-serif" }}>CINEGEN</span>
          </Link>

          <div>
            <h2 className="text-white mb-4" style={{ fontSize: "3.5rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              Welcome<br />back.
            </h2>
            <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>
              The AI-native marketplace for creative talent.
            </p>

            {/* Demo credentials */}
            <div className="space-y-3">
              {DEMO_ACCOUNTS.map((acc) => (
                <div key={acc.role} className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{acc.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(232,184,75,0.2)", color: "var(--gold)" }}>Demo</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <code className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{acc.email}</code>
                    <CopyBtn text={acc.email} />
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Demo@123</code>
                    <CopyBtn text="Demo@123" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            CineGen · Kampus.VC HacXLerate 2026
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--gold), var(--navy))" }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg" style={{ fontFamily: "Syne, Inter, sans-serif", color: "var(--text-primary)" }}>CINEGEN</span>
          </Link>

          <h1 className="font-black mb-2" style={{ fontSize: "2rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Sign in</h1>
          <p className="mb-8 text-sm" style={{ color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: "var(--navy)" }}>Create one free</Link>
          </p>

          {/* 1-click buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {DEMO_ACCOUNTS.map((acc) => (
              <button key={acc.role} onClick={() => handleOneClick(acc.role)}
                className="p-3.5 rounded-2xl text-left transition-all hover:-translate-y-0.5"
                style={{ background: acc.role === "brand" ? "var(--navy)" : "rgba(232,184,75,0.12)", border: `1px solid ${acc.role === "brand" ? "var(--navy)" : "rgba(232,184,75,0.3)"}` }}>
                <acc.icon className="w-4 h-4 mb-2" style={{ color: acc.role === "brand" ? "var(--gold)" : "var(--gold-dark)" }} />
                <div className="font-semibold text-sm" style={{ color: acc.role === "brand" ? "white" : "var(--navy)" }}>
                  Continue as {acc.role === "brand" ? "Brand" : "Creator"}
                </div>
                <div className="text-xs mt-0.5" style={{ color: acc.role === "brand" ? "rgba(255,255,255,0.5)" : "var(--text-secondary)" }}>
                  {acc.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: "var(--border)" }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs font-medium" style={{ background: "var(--bg)", color: "var(--text-muted)" }}>or sign in with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required className="input-field" style={{ paddingRight: "44px" }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm px-4 py-3 rounded-xl" style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-dark w-full justify-center py-3.5 text-sm disabled:opacity-50">
              {loading ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Guest explore */}
          <div className="mt-4 text-center">
            <Link href="/creators" className="text-sm hover:underline" style={{ color: "var(--text-secondary)" }}>
              Explore without signing in →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
