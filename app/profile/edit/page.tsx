"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Loader2, Sparkles, Instagram, Youtube, Twitter, Globe, User } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

type ProfileData = {
  headline: string;
  bio: string;
  location: string;
  rate: number;
  contactEmail: string;
  instagram: string;
  youtube: string;
  twitter: string;
  website: string;
  skills: string;
  categories: string;
};

const DEFAULT: ProfileData = {
  headline: "", bio: "", location: "", rate: 0,
  contactEmail: "", instagram: "", youtube: "", twitter: "", website: "",
  skills: "", categories: "",
};

const CHECKLIST = [
  { key: "headline", label: "Professional headline" },
  { key: "bio", label: "About / bio" },
  { key: "location", label: "Location" },
  { key: "rate", label: "Hourly rate" },
  { key: "skills", label: "Skills" },
  { key: "categories", label: "Categories" },
  { key: "instagram", label: "Social link" },
];

export default function ProfileEditPage() {
  const { session } = useSession();
  const [profile, setProfile] = useState<ProfileData>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [intro, setIntro] = useState("");

  useEffect(() => {
    if (session) {
      const saved = storage.read<ProfileData>(`creator_profile_${session.userId}`);
      if (saved) setProfile(saved);
    }
  }, [session]);

  const completeness = CHECKLIST.filter(({ key }) => {
    const v = profile[key as keyof ProfileData];
    return v && v !== "" && v !== 0;
  }).length;
  const pct = Math.round((completeness / CHECKLIST.length) * 100);

  const set = (key: keyof ProfileData, val: string | number) =>
    setProfile((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    storage.write(`creator_profile_${session?.userId}`, profile);
    setSaving(false);
    toast.success("Profile saved!");
  };

  const generateIntro = async () => {
    if (!profile.headline) { toast.error("Add a headline first"); return; }
    setGenerating(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Write a 2-sentence professional portfolio introduction for an AI creator:
Headline: ${profile.headline}
Bio: ${profile.bio}
Skills: ${profile.skills}
Keep it under 60 words, professional and creative.`,
          }],
        }),
      });
      const data = await res.json();
      setIntro(data.reply);
      toast.success("AI intro generated!");
    } catch {
      toast.error("Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  if (!session || session.role !== "creator") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground mr-3">Creators only.</p>
        <Link href="/login" className="text-violet-400">Login →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-2xl">Edit Profile</h1>
          <p className="text-muted-foreground text-sm">Shape your story — give brands a clear picture of your work</p>
        </div>
      </div>

      {/* Completeness */}
      <div className="glass rounded-2xl border border-white/10 p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">Profile Completeness</span>
          <span className={`text-sm font-bold ${pct >= 80 ? "text-green-400" : pct >= 50 ? "text-amber-400" : "text-muted-foreground"}`}>{pct}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2 mb-4">
          <motion.div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
            animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CHECKLIST.map(({ key, label }) => {
            const done = Boolean(profile[key as keyof ProfileData]);
            return (
              <div key={key} className="flex items-center gap-1.5 text-xs">
                <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${done ? "text-green-400" : "text-muted-foreground"}`} />
                <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-5">
        {/* Basic */}
        <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><User className="w-4 h-4 text-violet-400" /> Your Creative Identity</h2>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Headline *</label>
            <input value={profile.headline} onChange={(e) => set("headline", e.target.value)}
              placeholder="e.g. AI Filmmaker & Cinematic Visual Storyteller"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Bio *</label>
            <textarea value={profile.bio} onChange={(e) => set("bio", e.target.value)} rows={4}
              placeholder="Tell brands about yourself, your style, and what makes your AI work unique..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Location</label>
              <input value={profile.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Mumbai, India"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Hourly Rate (USD)</label>
              <input type="number" value={profile.rate || ""} onChange={(e) => set("rate", Number(e.target.value))} placeholder="85"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Skills (comma-separated)</label>
              <input value={profile.skills} onChange={(e) => set("skills", e.target.value)} placeholder="Cinematography, Prompt Engineering"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Categories</label>
              <input value={profile.categories} onChange={(e) => set("categories", e.target.value)} placeholder="Brand Film, Animation"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Public Contact Email (optional)</label>
            <input type="email" value={profile.contactEmail} onChange={(e) => set("contactEmail", e.target.value)}
              placeholder="Shown if you want brands to email you directly"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>
        </div>

        {/* Social channels */}
        <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
          <h2 className="font-semibold">Your Channels</h2>
          <p className="text-xs text-muted-foreground">Add your URLs so brands can visit your work. Only logos appear on your public profile.</p>
          {[
            { key: "instagram", Icon: Instagram, placeholder: "https://instagram.com/yourname", label: "Instagram" },
            { key: "youtube", Icon: Youtube, placeholder: "https://youtube.com/@yourname", label: "YouTube" },
            { key: "twitter", Icon: Twitter, placeholder: "https://x.com/yourname", label: "X (Twitter)" },
            { key: "website", Icon: Globe, placeholder: "https://yourportfolio.com", label: "Portfolio Website" },
          ].map(({ key, Icon, placeholder, label }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <input value={profile[key as keyof ProfileData] as string} onChange={(e) => set(key as keyof ProfileData, e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>
          ))}
        </div>

        {/* AI Portfolio Intro */}
        <div className="glass rounded-2xl border border-violet-500/20 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" /> AI Portfolio Introduction
            </h2>
            <button onClick={generateIntro} disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-500/30 text-violet-300 rounded-xl text-sm hover:bg-violet-500/30 transition-all disabled:opacity-50">
              {generating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</> : <><Sparkles className="w-3.5 h-3.5" /> Generate with AI</>}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Save your profile first, then generate an AI-written introduction based on your details.</p>
          {intro && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl">
              <p className="text-sm leading-relaxed">{intro}</p>
              <button onClick={() => { navigator.clipboard.writeText(intro); toast.success("Copied!"); }}
                className="mt-2 text-xs text-violet-400 hover:underline">Copy to clipboard</button>
            </motion.div>
          )}
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-2xl font-semibold text-base hover:opacity-90 transition-all disabled:opacity-50 shadow-lg">
          {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
