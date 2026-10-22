"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Menu, X, LogOut, LayoutDashboard, FileText, Search, Zap, Plus, ChevronDown, Trophy, Shield, Calculator, MessageSquare, Bell } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";

export function Navbar() {
  const { session, logout, switchRole } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    router.push("/");
    setMobileOpen(false);
  };

  const handleSwitchRole = (role: "brand" | "creator") => {
    switchRole(role);
    toast.success(`Switched to ${role === "brand" ? "Brand" : "Creator"} mode`);
  };

  const navLinks = [
    { href: "/creators", label: "Discover", icon: Search },
    { href: "/briefs", label: "Briefs", icon: FileText },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/inbox", label: "Inbox", icon: MessageSquare },
  ];

  const toolLinks = [
    { href: "/estimator", label: "Budget Estimator", icon: Calculator, desc: "Instant AI cost estimate" },
    { href: "/copyright-scan", label: "Copyright Scan", icon: Shield, desc: "AI originality verification", badge: "New" },
    { href: "/risk-scanner", label: "Risk Scanner", icon: Shield, desc: "IP & licensing check" },
    { href: "/compare", label: "Compare Creators", icon: Search, desc: "Side-by-side analysis" },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy, desc: "Top-ranked creators" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5"
      style={{ background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/25">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Cine<span className="gradient-text">Gen</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}

            {/* Tools dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                onBlur={() => setTimeout(() => setToolsOpen(false), 150)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  toolsOpen ? "bg-violet-500/20 text-violet-300" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}>
                <Zap className="w-4 h-4" />
                Tools
                <ChevronDown className={`w-3 h-3 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 mt-2 w-56 rounded-xl shadow-2xl overflow-hidden z-50 border border-white/10"
                    style={{ background: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)" }}
                  >
                    {toolLinks.map((tool) => (
                      <Link key={tool.href} href={tool.href}
                        onClick={() => setToolsOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors group relative">
                        <tool.icon className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-medium group-hover:text-violet-300 transition-colors flex items-center gap-2">
                            {tool.label}
                            {tool.badge && (
                              <span className="text-xs px-1.5 py-0.5 bg-violet-500 text-white rounded-full font-semibold">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{tool.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side — only render after mount */}
          <div className="hidden md:flex items-center gap-3">
            {!mounted ? (
              // Placeholder while mounting
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
            ) : session ? (
              <>
                {/* Demo Role Switcher */}
                <div className="flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 rounded-lg px-2 py-1">
                  <Zap className="w-3 h-3 text-violet-400" />
                  <span className="text-xs text-violet-400 font-medium mr-1">Demo</span>
                  <button
                    onClick={() => handleSwitchRole("brand")}
                    className={`text-xs px-2 py-0.5 rounded transition-all font-medium ${
                      session.role === "brand"
                        ? "bg-violet-500 text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}>
                    Brand
                  </button>
                  <button
                    onClick={() => handleSwitchRole("creator")}
                    className={`text-xs px-2 py-0.5 rounded transition-all font-medium ${
                      session.role === "creator"
                        ? "bg-cyan-500 text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}>
                    Creator
                  </button>
                </div>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all relative"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {/* Notification badge */}
                    <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                  </button>
                </div>

                {/* User info */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg flex-shrink-0">
                    {session.name.charAt(0)}
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold text-foreground">{session.name}</div>
                    <div className={`text-xs font-medium ${session.role === "brand" ? "text-violet-400" : "text-cyan-400"}`}>
                      {session.role === "brand" ? "Brand" : "Creator"}
                    </div>
                  </div>
                </div>

                {session.role === "brand" && (
                  <Link href="/briefs/new"
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-lg text-sm font-semibold hover:from-violet-500 hover:to-violet-400 transition-all shadow-lg shadow-violet-500/25">
                    <Plus className="w-3.5 h-3.5" /> Post Brief
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                  Sign In
                </Link>
                <Link href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-lg text-sm font-semibold hover:from-violet-500 hover:to-violet-400 transition-all shadow-lg shadow-violet-500/25">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
            onClick={() => setMobileOpen(!mobileOpen)}>
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
            className="md:hidden border-t border-white/5"
            style={{ background: "rgba(10,10,15,0.97)" }}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}

              {mounted && session ? (
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {session.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{session.name}</div>
                      <div className={`text-xs ${session.role === "brand" ? "text-violet-400" : "text-cyan-400"}`}>
                        {session.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3">
                    <span className="text-xs text-muted-foreground">Switch role:</span>
                    <button onClick={() => { handleSwitchRole("brand"); setMobileOpen(false); }}
                      className={`text-xs px-3 py-1 rounded-lg font-medium ${session.role === "brand" ? "bg-violet-500 text-white" : "bg-white/5 text-muted-foreground"}`}>
                      Brand
                    </button>
                    <button onClick={() => { handleSwitchRole("creator"); setMobileOpen(false); }}
                      className={`text-xs px-3 py-1 rounded-lg font-medium ${session.role === "creator" ? "bg-cyan-500 text-white" : "bg-white/5 text-muted-foreground"}`}>
                      Creator
                    </button>
                  </div>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-white/5">
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl text-sm font-semibold">
                    Sign In / Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
