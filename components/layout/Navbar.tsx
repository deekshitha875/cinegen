"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useAuth } from "@/lib/auth-context";
import { signOut } from "@/lib/auth";
import { toast } from "sonner";

export function Navbar() {
  const { session, logout, switchRole } = useSession();
  const { user: supabaseUser } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeUser = supabaseUser
    ? { name: supabaseUser.name, role: supabaseUser.role }
    : session
    ? { name: session.name, role: session.role }
    : null;

  const handleLogout = async () => {
    try { await signOut(); } catch {}
    logout();
    toast.success("Logged out");
    window.location.href = "/";
  };

  const handleSwitchRole = (role: "brand" | "creator") => {
    switchRole(role);
    toast.success(`Switched to ${role}`);
  };

  const navLinks = [
    { href: "/categories", label: "Categories" },
    { href: "/creators", label: "Discover" },
    { href: "/briefs", label: "Briefs" },
    { href: "/demo", label: "Try Demo" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(247,244,239,0.95)" : "var(--bg)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--gold), var(--navy))" }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight" style={{ color: "var(--text-primary)", fontFamily: "Syne, Inter, sans-serif" }}>
              CINE<span style={{ color: "var(--gold-dark)" }}>GEN</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: pathname === link.href ? "var(--text-primary)" : "var(--text-secondary)",
                  fontWeight: pathname === link.href ? 700 : 500,
                  background: pathname === link.href ? "rgba(232,184,75,0.1)" : "transparent",
                }}>
                {link.label}
              </Link>
            ))}

            {/* Tools dropdown */}
            <div className="relative">
              <button onClick={() => setToolsOpen(!toolsOpen)}
                onBlur={() => setTimeout(() => setToolsOpen(false), 150)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ color: "var(--text-secondary)" }}>
                Tools <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {toolsOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-56 rounded-2xl shadow-xl overflow-hidden z-50"
                    style={{ background: "white", border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
                    {[
                      { href: "/estimator", label: "💰 Budget Estimator", desc: "Instant AI cost estimate" },
                      { href: "/risk-scanner", label: "🛡️ Risk Scanner", desc: "IP & licensing check" },
                      { href: "/compare", label: "⚖️ Compare Creators", desc: "Side-by-side analysis" },
                      { href: "/leaderboard", label: "🏆 Leaderboard", desc: "Top-ranked creators" },
                    ].map((tool) => (
                      <Link key={tool.href} href={tool.href} onClick={() => setToolsOpen(false)}
                        className="flex flex-col px-4 py-3 transition-colors hover:bg-[var(--bg)]">
                        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{tool.label}</span>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{tool.desc}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            {!mounted ? (
              <div className="w-8 h-8 rounded-full skeleton" />
            ) : activeUser ? (
              <>
                {session && !supabaseUser && (
                  <div className="flex items-center gap-1 rounded-full px-2 py-1 border text-xs"
                    style={{ background: "rgba(232,184,75,0.1)", borderColor: "rgba(232,184,75,0.3)", color: "var(--gold-dark)" }}>
                    Demo:
                    <button onClick={() => handleSwitchRole("brand")}
                      className={`px-2 py-0.5 rounded-full font-semibold transition-all ${session.role === "brand" ? "text-white" : "opacity-60"}`}
                      style={{ background: session.role === "brand" ? "var(--navy)" : "transparent" }}>Brand</button>
                    <button onClick={() => handleSwitchRole("creator")}
                      className={`px-2 py-0.5 rounded-full font-semibold transition-all ${session.role === "creator" ? "text-white" : "opacity-60"}`}
                      style={{ background: session.role === "creator" ? "var(--gold-dark)" : "transparent" }}>Creator</button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: "linear-gradient(135deg, var(--gold), var(--navy))" }}>
                    {activeUser.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{activeUser.name.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout}
                  className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-red-50 hover:text-red-500"
                  style={{ color: "var(--text-secondary)" }}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                  style={{ color: "var(--text-secondary)" }}>
                  Sign in
                </Link>
                <Link href="/register" className="btn-gold text-sm px-5 py-2.5">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <button className="md:hidden p-2 rounded-lg" onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: mobileOpen ? "var(--bg)" : "transparent" }}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ background: "white", borderTop: "1px solid var(--border)" }}>
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium rounded-xl transition-colors"
                  style={{ color: "var(--text-secondary)" }}>
                  {link.label}
                </Link>
              ))}
              <hr style={{ borderColor: "var(--border)", margin: "8px 0" }} />
              {mounted && (activeUser ? (
                <button onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 text-sm text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                  Log out
                </button>
              ) : (
                <Link href="/register" onClick={() => setMobileOpen(false)}
                  className="btn-gold w-full text-center py-3 text-sm justify-center">
                  Get started free
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
