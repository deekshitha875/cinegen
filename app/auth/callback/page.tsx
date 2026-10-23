"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";
import { Film } from "lucide-react";

export default function CallbackPage() {
  const [status, setStatus] = useState("Completing sign in...");

  useEffect(() => {
    // Supabase stores the PKCE verifier in localStorage.
    // Running client-side means we have access to it — exchange will work.
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const name = session.user.user_metadata?.full_name ?? session.user.email ?? "User";
        setStatus(`Welcome, ${name.split(" ")[0]}!`);
        setTimeout(() => {
          window.location.href = `/onboarding?name=${encodeURIComponent(name)}&email=${encodeURIComponent(session.user.email ?? "")}`;
        }, 500);
      }
    });

    // Also try exchanging immediately in case onAuthStateChange already fired
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const name = data.session.user.user_metadata?.full_name ?? data.session.user.email ?? "User";
        setStatus(`Welcome, ${name.split(" ")[0]}!`);
        setTimeout(() => {
          window.location.href = `/onboarding?name=${encodeURIComponent(name)}&email=${encodeURIComponent(data.session!.user.email ?? "")}`;
        }, 500);
      }
    });

    // Timeout fallback
    const timer = setTimeout(() => {
      setStatus("Something went wrong. Redirecting...");
      window.location.href = "/login?error=timeout";
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
          <Film className="w-7 h-7 text-white" />
        </div>
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">{status}</p>
      </div>
    </div>
  );
}
