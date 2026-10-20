"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, ArrowLeft, CheckCircle, Loader2, Image, Film, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

type WorkflowStep = { tool: string; prompt?: string; note?: string };

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  mediaType: "video" | "image" | "animation";
  thumbnailUrl: string;
  contentType: string;
  styleTags: string[];
  toolsUsed: string[];
  workflow: WorkflowStep[];
  year: number;
};

const AI_TOOLS = ["Midjourney", "Runway", "Kling", "Sora", "ComfyUI", "Stable Diffusion", "Flux", "Pika", "ElevenLabs", "HeyGen", "Topaz"];
const CONTENT_TYPES = ["Brand Film", "Short-form Video", "Animation", "Motion Graphics", "Image Campaign", "Social Media Pack"];

export default function PortfolioPage() {
  const { session } = useSession();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState<"video" | "image" | "animation">("video");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [contentType, setContentType] = useState("Brand Film");
  const [toolsUsed, setToolsUsed] = useState<string[]>([]);
  const [styleTag, setStyleTag] = useState("");
  const [styleTags, setStyleTags] = useState<string[]>([]);
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([{ tool: "", prompt: "", note: "" }]);

  const toggleTool = (t: string) =>
    setToolsUsed((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const addWorkflowStep = () => setWorkflow((prev) => [...prev, { tool: "", prompt: "", note: "" }]);
  const updateStep = (i: number, field: keyof WorkflowStep, val: string) =>
    setWorkflow((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  const removeStep = (i: number) => setWorkflow((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Please add a title"); return; }
    if (toolsUsed.length === 0) { toast.error("Select at least one AI tool"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));

    const item: PortfolioItem = {
      id: `portfolio-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      mediaType,
      thumbnailUrl: thumbnailUrl || `https://picsum.photos/seed/${Date.now()}/800/450`,
      contentType,
      styleTags,
      toolsUsed,
      workflow: workflow.filter((s) => s.tool.trim()),
      year: new Date().getFullYear(),
    };

    // Save to localStorage
    const existing = storage.read<PortfolioItem[]>(`portfolio_${session?.userId}`) ?? [];
    storage.write(`portfolio_${session?.userId}`, [...existing, item]);

    setSaving(false);
    setSaved(true);
    toast.success("Portfolio item saved!");
    setTimeout(() => {
      setSaved(false);
      setTitle(""); setDescription(""); setThumbnailUrl("");
      setToolsUsed([]); setStyleTags([]); setWorkflow([{ tool: "", prompt: "", note: "" }]);
    }, 2000);
  };

  if (!session || session.role !== "creator") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">This page is for creators only.</p>
          <Link href="/login" className="text-violet-400 hover:text-violet-300">Login as a creator →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-2xl">Add Portfolio Work</h1>
          <p className="text-muted-foreground text-sm">Show brands your AI production skills</p>
        </div>
      </div>

      {saved ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center glass rounded-2xl border border-white/10 p-12">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl mb-2">Portfolio item saved!</h2>
          <p className="text-muted-foreground">Your work has been added to your profile.</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 text-xs flex items-center justify-center font-bold">1</span>
              Work Details
            </h2>

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Luminary Skincare — Glow Campaign"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                rows={3} placeholder="Describe what you created and how..."
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none" />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-2">Media Type</label>
              <div className="flex gap-2">
                {(["video", "image", "animation"] as const).map((t) => (
                  <button key={t} onClick={() => setMediaType(t)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm capitalize transition-all ${mediaType === t ? "bg-violet-500/20 border-violet-500/40 text-violet-300" : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground"}`}>
                    {t === "video" ? <Film className="w-4 h-4" /> : <Image className="w-4 h-4" />}
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-2">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {CONTENT_TYPES.map((ct) => (
                  <button key={ct} onClick={() => setContentType(ct)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${contentType === ct ? "bg-violet-500/20 border-violet-500/40 text-violet-300" : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground"}`}>
                    {ct}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Thumbnail URL (optional)</label>
              <input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://... (leave blank for auto-generated)"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>
          </div>

          {/* Tools */}
          <div className="glass rounded-2xl border border-white/10 p-6 space-y-3">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 text-xs flex items-center justify-center font-bold">2</span>
              AI Tools Used *
            </h2>
            <div className="flex flex-wrap gap-2">
              {AI_TOOLS.map((t) => (
                <button key={t} onClick={() => toggleTool(t)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${toolsUsed.includes(t) ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Style Tags */}
          <div className="glass rounded-2xl border border-white/10 p-6 space-y-3">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 text-xs flex items-center justify-center font-bold">3</span>
              Style Tags
            </h2>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {styleTags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 bg-violet-500/10 text-violet-300 rounded-full">
                  {tag}
                  <button onClick={() => setStyleTags(styleTags.filter((t) => t !== tag))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={styleTag} onChange={(e) => setStyleTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && styleTag.trim()) { setStyleTags([...styleTags, styleTag.trim()]); setStyleTag(""); } }}
                placeholder="e.g. cinematic, dark, luxury (Enter to add)"
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>
          </div>

          {/* Workflow */}
          <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 text-xs flex items-center justify-center font-bold">4</span>
              Production Workflow
            </h2>
            <p className="text-xs text-muted-foreground">Show how you created this work step by step — this builds trust with brands.</p>

            {workflow.map((step, i) => (
              <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Step {i + 1}</span>
                  {workflow.length > 1 && (
                    <button onClick={() => removeStep(i)} className="text-muted-foreground hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input value={step.tool} onChange={(e) => updateStep(i, "tool", e.target.value)}
                  placeholder="Tool used (e.g. Midjourney)"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
                <input value={step.prompt || ""} onChange={(e) => updateStep(i, "prompt", e.target.value)}
                  placeholder="Prompt used (optional)"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
                <input value={step.note || ""} onChange={(e) => updateStep(i, "note", e.target.value)}
                  placeholder="Notes about this step (optional)"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
              </div>
            ))}

            <button onClick={addWorkflowStep}
              className="w-full py-2 flex items-center justify-center gap-2 border border-dashed border-white/20 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-white/40 transition-all">
              <Plus className="w-4 h-4" /> Add Step
            </button>
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-2xl font-semibold text-base hover:opacity-90 transition-all disabled:opacity-50 shadow-lg">
            {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Sparkles className="w-5 h-5" /> Save Portfolio Item</>}
          </button>
        </div>
      )}
    </div>
  );
}
