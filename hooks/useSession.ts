"use client";
import { useState, useEffect, useCallback } from "react";
import { Session, UserRole } from "@/types";
import { storage } from "@/lib/storage";

const DEMO_CREDENTIALS = [
  // Brand accounts
  { email: "brand@cinegen.demo", password: "Demo@123", session: { userId: "brand-001", email: "brand@cinegen.demo", role: "brand" as UserRole, name: "Arjun Mehta", brandId: "brand-001" } },
  { email: "admin@cinegen.demo", password: "Demo@123", session: { userId: "brand-001", email: "admin@cinegen.demo", role: "brand" as UserRole, name: "Arjun Mehta", brandId: "brand-001" } },
  // All 18 creators — password is Demo@123 for all
  { email: "aryan@cinegen.demo", password: "Demo@123", session: { userId: "creator-001", email: "aryan@cinegen.demo", role: "creator" as UserRole, name: "Aryan Kapoor", creatorId: "creator-001" } },
  { email: "creator@cinegen.demo", password: "Demo@123", session: { userId: "creator-001", email: "creator@cinegen.demo", role: "creator" as UserRole, name: "Aryan Kapoor", creatorId: "creator-001" } },
  { email: "priya@cinegen.demo", password: "Demo@123", session: { userId: "creator-002", email: "priya@cinegen.demo", role: "creator" as UserRole, name: "Priya Nair", creatorId: "creator-002" } },
  { email: "rahul@cinegen.demo", password: "Demo@123", session: { userId: "creator-003", email: "rahul@cinegen.demo", role: "creator" as UserRole, name: "Rahul Sharma", creatorId: "creator-003" } },
  { email: "zara@cinegen.demo", password: "Demo@123", session: { userId: "creator-004", email: "zara@cinegen.demo", role: "creator" as UserRole, name: "Zara Ahmed", creatorId: "creator-004" } },
  { email: "marcus@cinegen.demo", password: "Demo@123", session: { userId: "creator-005", email: "marcus@cinegen.demo", role: "creator" as UserRole, name: "Marcus Chen", creatorId: "creator-005" } },
  { email: "anjali@cinegen.demo", password: "Demo@123", session: { userId: "creator-006", email: "anjali@cinegen.demo", role: "creator" as UserRole, name: "Anjali Desai", creatorId: "creator-006" } },
  { email: "vikram@cinegen.demo", password: "Demo@123", session: { userId: "creator-007", email: "vikram@cinegen.demo", role: "creator" as UserRole, name: "Vikram Rajan", creatorId: "creator-007" } },
  { email: "lena@cinegen.demo", password: "Demo@123", session: { userId: "creator-008", email: "lena@cinegen.demo", role: "creator" as UserRole, name: "Lena Volkov", creatorId: "creator-008" } },
  { email: "dev@cinegen.demo", password: "Demo@123", session: { userId: "creator-009", email: "dev@cinegen.demo", role: "creator" as UserRole, name: "Dev Patel", creatorId: "creator-009" } },
  { email: "yuna@cinegen.demo", password: "Demo@123", session: { userId: "creator-010", email: "yuna@cinegen.demo", role: "creator" as UserRole, name: "Yuna Kim", creatorId: "creator-010" } },
  { email: "rohan@cinegen.demo", password: "Demo@123", session: { userId: "creator-011", email: "rohan@cinegen.demo", role: "creator" as UserRole, name: "Rohan Mathur", creatorId: "creator-011" } },
  { email: "aisha@cinegen.demo", password: "Demo@123", session: { userId: "creator-012", email: "aisha@cinegen.demo", role: "creator" as UserRole, name: "Aisha Okafor", creatorId: "creator-012" } },
  { email: "sameer@cinegen.demo", password: "Demo@123", session: { userId: "creator-013", email: "sameer@cinegen.demo", role: "creator" as UserRole, name: "Sameer Joshi", creatorId: "creator-013" } },
  { email: "carlos@cinegen.demo", password: "Demo@123", session: { userId: "creator-014", email: "carlos@cinegen.demo", role: "creator" as UserRole, name: "Carlos Rivera", creatorId: "creator-014" } },
  { email: "meera@cinegen.demo", password: "Demo@123", session: { userId: "creator-015", email: "meera@cinegen.demo", role: "creator" as UserRole, name: "Meera Iyer", creatorId: "creator-015" } },
  { email: "tanvir@cinegen.demo", password: "Demo@123", session: { userId: "creator-016", email: "tanvir@cinegen.demo", role: "creator" as UserRole, name: "Tanvir Sheikh", creatorId: "creator-016" } },
  { email: "natasha@cinegen.demo", password: "Demo@123", session: { userId: "creator-017", email: "natasha@cinegen.demo", role: "creator" as UserRole, name: "Natasha Pinto", creatorId: "creator-017" } },
  { email: "ishaan@cinegen.demo", password: "Demo@123", session: { userId: "creator-018", email: "ishaan@cinegen.demo", role: "creator" as UserRole, name: "Ishaan Verma", creatorId: "creator-018" } },
];

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// Global listeners so all components update together
const listeners = new Set<() => void>();

function notifyAll() {
  listeners.forEach((fn) => fn());
}

export function useSession() {
  const [session, setSessionState] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial read
    const stored = storage.read<Session>("cinegen_session");
    setSessionState(stored);
    setLoading(false);

    // Subscribe to global updates
    const handler = () => {
      const updated = storage.read<Session>("cinegen_session");
      setSessionState(updated);
    };
    listeners.add(handler);

    // Also listen to storage events (cross-tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cinegen_session") handler();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(handler);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const writeSession = (sess: Session) => {
    storage.write("cinegen_session", sess);
    setCookie("cinegen_role", sess.role);
    setSessionState(sess);
    notifyAll();
  };

  // Login with real Google user data
  const loginWithGoogle = useCallback((role: "brand" | "creator", name: string, email: string) => {
    const sess: Session = {
      userId: `google_${email.replace(/[^a-z0-9]/gi, "_")}`,
      email,
      role,
      name,
      ...(role === "brand" ? { brandId: `brand_google_${Date.now()}` } : { creatorId: `creator_google_${Date.now()}` }),
      loginAt: new Date().toISOString(),
    };
    writeSession(sess);
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    // Check demo credentials first
    const cred = DEMO_CREDENTIALS.find(
      (c) => c.email === email && c.password === password
    );
    if (cred) {
      const sess: Session = { ...cred.session, loginAt: new Date().toISOString() };
      writeSession(sess);
      return true;
    }
    // Check registered users (password stored at registration time isn't verified here
    // since we store sessions not passwords — check email match and auto-login)
    const registered = storage.read<Session[]>("cinegen_registered_users") ?? [];
    const found = registered.find((u) => u.email === email.toLowerCase().trim());
    if (found) {
      const sess: Session = { ...found, loginAt: new Date().toISOString() };
      writeSession(sess);
      return true;
    }
    return false;
  }, []);

  const loginAsRole = useCallback((role: "brand" | "creator") => {
    const cred = role === "brand"
      ? DEMO_CREDENTIALS.find((c) => c.email === "brand@cinegen.demo")!
      : DEMO_CREDENTIALS.find((c) => c.email === "creator@cinegen.demo")!;
    const sess: Session = { ...cred.session, loginAt: new Date().toISOString() };
    writeSession(sess);
  }, []);

  const logout = useCallback(() => {
    storage.remove("cinegen_session");
    removeCookie("cinegen_role");
    setSessionState(null);
    notifyAll();
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (role === "brand" || role === "creator") {
      const cred = DEMO_CREDENTIALS.find((c) => c.session.role === role)!;
      const sess: Session = { ...cred.session, loginAt: new Date().toISOString() };
      writeSession(sess);
    }
  }, []);

  return { session, loading, login, loginAsRole, loginWithGoogle, logout, switchRole };
}
