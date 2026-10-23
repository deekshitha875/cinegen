"use client";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";
import { Film } from "lucide-react";

// Handles BOTH flows:
// 1. Implicit flow  — token in URL hash: #access_token=...
// 2. PKCE flow      — code in URL query: ?code=...
function ExchangeContent() {
  const { loginAsRole } = useSession();
  const [status, setStatus] = useState("Completing Google sign in...");

  useEffect(() => {
    async function handle() {
      // --- Implicit flow: token is in the hash ---
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        // Supabase handles this automatically via onAuthStateChange
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session?.user) {
          finishLogin(data.session.user);
          return;
        }
        // Give it a moment for the hash to be processed
        await new Promise(r => setTimeout(r, 1000));
        const { data: data2 } = await supabase.auth.getSession();
        if (data2.session?.user) {
          finishLogin(data2.session.user);
          return;
        }
      }

      // --- PKCE flow: code is in query params ---
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");

      if (error) {
        setStatus("Sign in cancelled.");
        setTimeout(() => { window.location.href = "/login"; }, 1500);
        return;
      }

      if (code) {
        const { data, error: exchError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchError) {
          setStatus(`Error: ${exchError.message}`);
          setTimeout(() => { window.location.href = "/login?error=" + encodeURIComponent(exchError.message); }, 2000);
          return;
        }
        if (data?.user) {
          finishLogin(data.user);
          return;
        }
      }

      // Nothing worked
      setStatus("Sign in failed. Redirecting...");
      setTimeout(() => { window.location.href = "/login"; }, 1500);
    }

    function finishLogin(user: any) {
      const name = user.user_metadata?.full_name ?? user.email ?? "User";
      loginAsRole("brand");
      setStatus(`Welcome, ${name.split(" ")[0]}!`);
      const dest = `/onboarding?name=${encodeURIComponent(name)}&email=${encodeURIComponent(user.email ?? "")}`;
      setTimeout(() => { window.location.href = dest; }, 400);
    }

    handle();
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
