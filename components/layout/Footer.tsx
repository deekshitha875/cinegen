import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ background: "var(--navy)", borderTop: "1px solid var(--border-dark)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--gold), var(--navy-2))" }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-lg text-white" style={{ fontFamily: "Syne, Inter, sans-serif" }}>
                CINE<span style={{ color: "var(--gold)" }}>GEN</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "280px" }}>
              The AI-native marketplace where brands discover, brief, and hire the world's best AI content creators.
            </p>
            <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>🎯 Judge Access</div>
              <div className="space-y-1 text-xs mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                <div>Brand: <code className="text-white">brand@cinegen.demo</code> / <code className="text-white">Demo@123</code></div>
                <div>Creator: <code className="text-white">creator@cinegen.demo</code> / <code className="text-white">Demo@123</code></div>
              </div>
              <Link href="/login" className="btn-gold text-xs px-4 py-2 inline-flex items-center gap-1">
                → 1-Click Demo Login
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Platform</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Discover Creators", href: "/creators" },
                { label: "Post a Brief", href: "/briefs/new" },
                { label: "Browse Briefs", href: "/briefs" },
                { label: "Categories", href: "/categories" },
                { label: "Try the Demo", href: "/demo" },
                { label: "Leaderboard", href: "/leaderboard" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors"
                    style={{ color: "rgba(255,255,255,0.45)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Tools</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Budget Estimator", href: "/estimator" },
                { label: "Risk Scanner", href: "/risk-scanner" },
                { label: "Compare Creators", href: "/compare" },
                { label: "Brief Intelligence", href: "/briefs/new" },
                { label: "Style DNA", href: "/creators" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors"
                    style={{ color: "rgba(255,255,255,0.45)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2026 CineGen · Built for Kampus.VC HacXLerate 2026
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Next.js 14 · Gemini AI · Supabase · Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
