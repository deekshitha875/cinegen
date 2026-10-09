"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Menu, X, ChevronDown, LogOut, User, LayoutDashboard, FileText, Search, Zap } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";

export function Navbar() {
  const { session, logout, switchRole } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleSwitching, setRoleSwitching] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    router.push("/");
    setMobileOpen(false);
  };

  const handleSwitchRole = async (role: "brand" | "creator") => {
    setRoleSwitching(true);
    switchRole(role);
    toast.success(`Switched to ${role === "brand" ? "Brand" : "Creator"} mode`);
    setRoleSwitching(false);
    router.refresh();
  };

  const navLinks = session
    ? [
        { href: "/creators", label: "Discover", icon: Search },
        { href: "/briefs", label: "Briefs", icon: FileText },
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ]
    : [
        { href: "/creators", label: "Discover Creators", icon: Search },
        { href: "/login", label: "Post a Brief", icon: FileText },
      ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Cine<span className="gradient-text">Gen</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                {/* Demo Role Switcher */}
                <div className="flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 rounded-lg px-2 py-1">
                  <Zap className="w-3 h-3 text-violet-400" />
                  <span className="text-xs text-violet-400 font-medium mr-1">Demo</span>
                  <button
                    onClick={() => handleSwitchRole("brand")}
                    className={`text-xs px-2 py-0.5 rounded transition-all ${
                      session.role === "brand"
                        ? "bg-violet-500 text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Brand
                  </button>
                  <button
                    onClick={() => handleSwitchRole("creator")}
                    className={`text-xs px-2 py-0.5 rounded transition-all ${
                      session.role === "creator"
                        ? "bg-cyan-500 text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Creator
                  </button>
                </div>

                {/* User info */}
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                    {session.name.charAt(0)}
                  </div>
                  <span className="text-foreground font-medium">{session.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    session.role === "brand" ? "bg-violet-500/20 text-violet-400" : "bg-cyan-500/20 text-cyan-400"
                  }`}>
                    {session.role}
                  </span>
                </div>

                {session.role === "brand" && (
                  <Link
                    href="/briefs/new"
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-lg text-sm font-semibold hover:from-violet-500 hover:to-violet-400 transition-all shadow-lg shadow-violet-500/25"
                  >
                    Post Brief
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-lg text-sm font-semibold hover:from-violet-500 hover:to-violet-400 transition-all shadow-lg shadow-violet-500/25"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
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
            className="md:hidden border-t border-white/5 bg-black/50 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              {session ? (
                <>
                  <div className="pt-2 border-t border-white/5 mt-2">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <span className="text-sm text-muted-foreground">Switch role:</span>
                      <button onClick={() => { handleSwitchRole("brand"); setMobileOpen(false); }}
                        className={`text-xs px-2 py-1 rounded ${session.role === "brand" ? "bg-violet-500 text-white" : "bg-white/5 text-muted-foreground"}`}>
                        Brand
                      </button>
                      <button onClick={() => { handleSwitchRole("creator"); setMobileOpen(false); }}
                        className={`text-xs px-2 py-1 rounded ${session.role === "creator" ? "bg-cyan-500 text-white" : "bg-white/5 text-muted-foreground"}`}>
                        Creator
                      </button>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-white/5 mt-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-lg text-sm font-semibold">
                    Get Started
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
