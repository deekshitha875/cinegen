"use client";
import { useState, useEffect, useCallback } from "react";
import { Session, UserRole } from "@/types";
import { storage } from "@/lib/storage";

const DEMO_CREDENTIALS = [
  {
    email: "brand@cinegen.demo",
    password: "Demo@123",
    session: {
      userId: "brand-001",
      email: "brand@cinegen.demo",
      role: "brand" as UserRole,
      name: "Arjun Mehta",
      brandId: "brand-001",
    },
  },
  {
    email: "creator@cinegen.demo",
    password: "Demo@123",
    session: {
      userId: "creator-001",
      email: "creator@cinegen.demo",
      role: "creator" as UserRole,
      name: "Aryan Kapoor",
      creatorId: "creator-001",
    },
  },
];

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function useSession() {
  const [session, setSessionState] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = storage.read<Session>("cinegen_session");
    setSessionState(stored);
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const cred = DEMO_CREDENTIALS.find(
      (c) => c.email === email && c.password === password
    );
    if (!cred) return false;
    const sess: Session = { ...cred.session, loginAt: new Date().toISOString() };
    storage.write("cinegen_session", sess);
    setCookie("cinegen_role", sess.role);
    setSessionState(sess);
    return true;
  }, []);

  const loginAsRole = useCallback((role: "brand" | "creator") => {
    const cred = DEMO_CREDENTIALS.find((c) => c.session.role === role)!;
    const sess: Session = { ...cred.session, loginAt: new Date().toISOString() };
    storage.write("cinegen_session", sess);
    setCookie("cinegen_role", sess.role);
    setSessionState(sess);
  }, []);

  const logout = useCallback(() => {
    storage.remove("cinegen_session");
    removeCookie("cinegen_role");
    setSessionState(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (!session) return;
    // If switching to a demo role, fully re-init
    if (role === "brand" || role === "creator") {
      const cred = DEMO_CREDENTIALS.find((c) => c.session.role === role)!;
      const sess: Session = { ...cred.session, loginAt: new Date().toISOString() };
      storage.write("cinegen_session", sess);
      setCookie("cinegen_role", sess.role);
      setSessionState(sess);
    } else {
      const updated: Session = { ...session, role };
      storage.write("cinegen_session", updated);
      setCookie("cinegen_role", role);
      setSessionState(updated);
    }
  }, [session]);

  return { session, loading, login, loginAsRole, logout, switchRole };
}
