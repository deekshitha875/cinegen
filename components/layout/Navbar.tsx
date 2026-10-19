"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, Bell } from "lucide-react";
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

  useEffect(() => { setMounted(true); }, []);

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
    { href: "/creators", label: "Discover creators" },
    { href: "/demo", label: "Try the demo" },
    { href: "/briefs", label: "Opportunities" },
  ];

  const creatorLinks = [
    { href: "/dashboard", label: "My portfolio" },
    { href: "/dashboard", label: "My gigs" },
    { href: "/inbox", label: "Inbox" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[var(--cream-dark)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <span className="font-bold text-xl tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              CINE<span style={{ color: 'var(--lime)' }}>GEN</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === link.href
                    ? "text-[var(--text-primary)] font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}>
                {link.label}
              </Link>
            ))}

            {/* Tools dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                onBlur={() => setTimeout(() => setToolsOpen(false), 150)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Tools
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 mt-1 w-52 bg-white border border-[var(--cream-dark)] rounded-xl shadow-lg overflow-hidden z-50">
                    {[
                      { href: "/estimator", label: "💰 Budget Estimator", desc: "Instant cost estimate" },
                      { href: "/risk-scanner", label: "🛡️ Risk Scanner", desc: "IP & licensing check" },
                      { href: "/compare", label: "⚖️ Compare Creators", desc: "Side-by-side analysis" },
                      { href: "/leaderboard", label: "🏆 Leaderboard", desc: "Top-ranked creators" },
                    ].map((tool) => (
                      <Link key={tool.href} href={tool.href}
                        onClick={() => setToolsOpen(false)}
                        className="flex flex-col px-4 py-3 hover:bg-[var(--cream)] transition-colors">
                        <span className="text-sm font-medium text-[var(--text-primary)]">{tool.label}</span>
                        <span className="text-xs text-[var(--text-secondary)]">{tool.desc}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {!mounted ? (
              <div className="w-8 h-8 rounded-full bg-[var(--cream-dark)] animate-pulse" />
            ) : activeUser ? (
              <>
                {/* Demo switcher — only for localStorage demo */}
                {session && !supabaseUser && (
                  <div className="flex items-center gap-1 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-full px-2 py-1">
                    <span className="text-xs text-[var(--text-secondary)] font-medium mr-1">Demo</span>
                    <button onClick={() => handleSwitchRole("brand")}
                      className={`text-xs px-2 py-0.5 rounded-full transition-all font-medium ${session.role === "brand" ? "bg-[var(--dark-green)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
                      Brand
                    </button>
                    <button onClick={() => handleSwitchRole("creator")}
                      className={`text-xs px-2 py-0.5 rounded-full transition-all font-medium ${session.role === "creator" ? "bg-[var(--lime)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
                      Creator
                    </button>
                  </div>
                )}

                {/* Notification bell */}
                <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--lime)] rounded-full" />
                </button>

                {/* Motion/static toggle */}
                <button className="text-xs text-[var(--text-secondary)] border border-[var(--cream-dark)] px-3 py-1.5 rounded-full hover:bg-[var(--cream)] transition-colors">
                  Motion
                </button>

                {/* User */}
                <span className="text-sm text-[var(--text-secondary)]">Hi, {activeUser.name.split(' ')[0]}</span>

                <button onClick={handleLogout}
                  className="text-sm font-medium text-[var(--text-primary)] hover:text-red-500 transition-colors">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login"
                  className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Log in
                </Link>
                <Link href="/register"
                  className="btn-lime text-sm px-5 py-2">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[var(--cream-dark)]">
            <div className="px-4 py-3 space-y-1">
              {[...navLinks, { href: "/estimator", label: "Budget Estimator" }, { href: "/leaderboard", label: "Leaderboard" }].map((link) => (
                <Link key={link.href} href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--cream)] rounded-lg transition-colors">
                  {link.label}
                </Link>
              ))}
              {mounted && (
                activeUser ? (
                  <button onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    Log out
                  </button>
                ) : (
                  <Link href="/register" onClick={() => setMobileOpen(false)}
                    className="block w-full text-center btn-lime px-4 py-2.5 text-sm mt-2">
                    Get started
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
