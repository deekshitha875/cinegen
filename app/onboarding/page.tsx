"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, Palette, ArrowRight, Film } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";

function OnboardingContent() {
  const [selected, setSelected] = useState<"brand" | "creator" | null>(null);
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useSession();
  const searchParams = useSearchParams();

  const name = searchParams.get("name") ?? "User";
  const email = searchParams.get("email") ?? "";
  const avatar = searchParams.get("avatar") ?? "";

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    loginWithGoogle(selected, name, email);

    // Write real profile to Supabase — visible in dashboard
    const { upsertProfile } = await import("@/lib/db");
    const userId = `google_${email.replace(/[^a-z0-9]/gi, "_")}`;
    await upsertProfile({ id: userId, email, name, role: selected, avatar_url: avatar });

    toast.success(`Welcome to CineGen, ${name.split(" ")[0]}!`);
    if (selected === "creator") {
      window.location.href = "/creator-setup";
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-lg"
    >
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
          <Film className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-display font-bold text-3xl mb-2">Welcome to CineGen!</h1>
        <p className="text-muted-foreground">How will you use CineGen?</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelected("brand")}
          className={`p-6 rounded-2xl border transition-all text-left ${
            selected === "brand"
              ? "bg-violet-500/20 border-violet-500/50 ring-2 ring-violet-500/30"
              : "glass border-white/10 hover:border-white/20"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <div className="font-semibold text-lg mb-1">I&apos;m a Brand</div>
              <div className="text-sm text-muted-foreground">Post briefs, discover AI creators, manage campaigns</div>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelected("creator")}
          className={`p-6 rounded-2xl border transition-all text-left ${
            selected === "creator"
              ? "bg-cyan-500/20 border-cyan-500/50 ring-2 ring-cyan-500/30"
              : "glass border-white/10 hover:border-white/20"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Palette className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="font-semibold text-lg mb-1">I&apos;m an AI Creator</div>
              <div className="text-sm text-muted-foreground">Browse briefs, submit proposals, showcase your work</div>
            </div>
          </div>
        </motion.button>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected || loading}
        className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-40 shadow-xl shadow-violet-500/30"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>Continue to Dashboard <ArrowRight className="w-5 h-5" /></>
        )}
      </button>
    </motion.div>
  );
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <Suspense fallback={<div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />}>
        <OnboardingContent />
      </Suspense>
    </div>
  );
}
