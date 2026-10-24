"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Film, Plus, X } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";

const AI_TOOLS = ["Runway", "Midjourney", "Sora", "Kling", "Veo", "Pika", "ComfyUI", "Stable Diffusion", "ElevenLabs", "Flux"];
const SPECIALIZATIONS = ["Short-form Video", "Long-form Video", "Animation", "Motion Graphics", "Image Campaign", "Brand Film"];

export default function CreatorSetupPage() {
  const { session } = useSession();
  const [step, setStep] = useState(1);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [rate, setRate] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [specs, setSpecs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleTool = (t: string) => setTools(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const toggleSpec = (s: string) => setSpecs(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleFinish = async () => {
    setLoading(true);
    // Save to localStorage for now
    const profileData = { headline, bio, rate, tools, specs, createdAt: new Date().toISOString() };
    localStorage.setItem(`creator_profile_${session?.userId}`, JSON.stringify(profileData));
    toast.success("Profile created! Welcome to CineGen.");
    await new Promise(r => setTimeout(r, 500));
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
            <Film className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl mb-2">Set Up Your Creator Profile</h1>
          <p className="text-muted-foreground">Step {step} of 2 — Tell brands about your AI skills</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? "bg-violet-500" : "bg-white/10"}`} />
          ))}
        </div>

        <div className="glass rounded-2xl border border-white/10 p-6">
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="font-semibold text-lg mb-4">Basic Info</h2>

              <div>
                <label className="block text-sm font-medium mb-1.5">Professional Headline</label>
                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. AI Filmmaker & Cinematic Visual Storyteller"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell brands what makes your AI content unique..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Hourly Rate (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    value={rate}
                    onChange={(e) => setRate(e.target.value.replace(/\D/g, ""))}
                    placeholder="95"
                    className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!headline || !bio || !rate}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-40"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="font-semibold text-lg">Your AI Skills</h2>

              <div>
                <label className="block text-sm font-medium mb-3">AI Tools You Use</label>
                <div className="flex flex-wrap gap-2">
                  {AI_TOOLS.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTool(t)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                        tools.includes(t)
                          ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                          : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                      }`}
                    >
                      {tools.includes(t) ? "✓ " : ""}{t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Specializations</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALIZATIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSpec(s)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                        specs.includes(s)
                          ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                          : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                      }`}
                    >
                      {specs.includes(s) ? "✓ " : ""}{s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 glass border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={tools.length === 0 || specs.length === 0 || loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-40"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Launch My Profile <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
