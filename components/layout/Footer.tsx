import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--cream-dark)] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="font-bold text-xl tracking-tight mb-3" style={{ fontFamily: "Space Grotesk, sans-serif", color: "var(--text-primary)" }}>
              CINE<span style={{ color: "var(--lime)" }}>GEN</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)", maxWidth: "280px" }}>
              The AI-native marketplace where brands discover, brief, and hire the world's best AI content creators.
            </p>
            <div className="p-4 rounded-xl border border-[var(--cream-dark)] bg-[var(--cream)]">
              <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-primary)" }}>🎯 Judge Access</div>
              <div className="space-y-1 mb-3">
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Brand: <code className="bg-white px-1 rounded text-xs">brand@cinegen.demo</code></div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Creator: <code className="bg-white px-1 rounded text-xs">creator@cinegen.demo</code></div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Password: <code className="bg-white px-1 rounded text-xs">Demo@123</code></div>
              </div>
              <Link href="/login" className="btn-dark text-xs px-4 py-2 inline-block">
                → 1-Click Demo Login
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Platform</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Discover Creators", href: "/creators" },
                { label: "Post a Brief", href: "/briefs/new" },
                { label: "Browse Briefs", href: "/briefs" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Compare Creators", href: "/compare" },
                { label: "Leaderboard", href: "/leaderboard" },
                { label: "Categories", href: "/categories" },
                { label: "Try the Demo", href: "/demo" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:underline transition-colors" style={{ color: "var(--text-secondary)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Tools</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Budget Estimator", href: "/estimator" },
                { label: "Risk Scanner", href: "/risk-scanner" },
                { label: "Brief Intelligence", href: "/briefs/new" },
                { label: "Style DNA", href: "/creators" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:underline transition-colors" style={{ color: "var(--text-secondary)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--cream-dark)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            © 2026 CineGen. Built for Kampus.VC Hackathon — AI Content Creator Marketplace.
          </p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Next.js 14 · Gemini AI · Supabase · Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
