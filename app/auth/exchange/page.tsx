"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";
import { Film } from "lucide-react";

function ExchangeContent() {
  const searchParams = useSearchParams();
  const { loginAsRole } = useSession();
  const [status, setStatus] = useState("Completing sign in...");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDesc = searchParams.get("error_description");

    if (error) {
      setStatus(`Sign in failed: ${errorDesc ?? error}`);
      setTimeout(() => {
        window.location.href = `/login?error=${encodeURIComponent(errorDesc ?? error)}`;
      }, 2000);
      return;
    }

    if (!code) {
      window.location.href = "/login?error=no_code";
      return;
    }

    // Exchange code client-side — PKCE verifier is in browser storage here
    supabase.auth.exchangeCodeForSession(code).then(({ data, error: exchError }) => {
      if (exchError) {
        setStatus(`Error: ${exchError.message}`);
        setTimeout(() => {
          window.location.href = `/login?error=${encodeURIComponent(exchError.message)}`;
        }, 2000);
        return;
      }

      if (data?.user) {
        // Set local demo session with real Google user info
        const name = data.user.user_metadata?.full_name ?? data.user.email ?? "User";
        loginAsRole("brand"); // default role — user picks on onboarding
        setStatus(`Welcome, ${name.split(" ")[0]}! Redirecting...`);
        const dest = `/onboarding?name=${encodeURIComponent(name)}&email=${encodeURIComponent(data.user.email ?? "")}`;
        setTimeout(() => { window.location.href = dest; }, 500);
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
          <Film className="w-7 h-7 text-white" />
        </div>
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">{status}</p>
      </div>
    </div>
  );
}

export default function ExchangePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExchangeContent />
    </Suspense>
  );
}
