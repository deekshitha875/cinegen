"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ArrowLeft, CheckCircle, Loader2, Sparkles, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

type Gig = {
  id: string;
  title: string;
  description: string;
  tools: string;
  includes: string;
  format: string;
  price: number;
  deliveryDays: number;
  createdAt: string;
};

const DEFAULT_GIG = { title: "", description: "", tools: "", includes: "", format: "16:9 Video", price: 0, deliveryDays: 7 };
const FORMATS = ["16:9 Video", "9:16 Short", "1:1 Square", "4:5 Portrait", "Image Set", "Animation Pack"];

export default function GigsPage() {
  const { session } = useSession();
  const [gigs, setGigs] = useState<Gig[]>(() =>
    storage.read<Gig[]>(`gigs_${session?.userId}`) ?? []
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(DEFAULT_GIG);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof DEFAULT_GIG, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const saveGig = async () => {
    if (!form.title.trim()) { toast.error("Add a title"); return; }
    if (!form.description.trim()) { toast.error("Add a description"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    const newGig: Gig = { ...form, id: `gig-${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [...gigs, newGig];
    storage.write(`gigs_${session?.userId}`, updated);
    setGigs(updated);
    setForm(DEFAULT_GIG);
    setShowForm(false);
    setSaving(false);
    toast.success("Gig published!");
  };

  const deleteGig = (id: string) => {
    const updated = gigs.filter((g) => g.id !== id);
    storage.write(`gigs_${session?.userId}`, updated);
    setGigs(updated);
    toast.success("Gig removed");
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-2xl">My Gigs</h1>
            <p className="text-muted-foreground text-sm">Publish service offerings that brands can browse and hire</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl text-sm font-semibold hover:from-violet-500 hover:to-violet-400 transition-all shadow-lg shadow-violet-500/25">
          <Plus className="w-4 h-4" /> New Gig
        </button>
      </div>

      {/* Gig form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-xl">Create a Gig</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Gig Title *</label>
                <input value={form.title} onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. I'll create a cinematic AI brand film"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Description *</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3}
                  placeholder="Describe what you'll deliver, your style, and ideal client..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none" />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">AI Tools Used</label>
                <input value={form.tools} onChange={(e) => set("tools", e.target.value)}
                  placeholder="e.g. Runway, Midjourney, Topaz"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">What's Included</label>
                <textarea value={form.includes} onChange={(e) => set("includes", e.target.value)} rows={2}
                  placeholder="e.g. Final edit, raw files, full workflow export, 2 revisions"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none" />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-2">Output Format</label>
                <div className="flex flex-wrap gap-2">
                  {FORMATS.map((f) => (
                    <button key={f} onClick={() => set("format", f)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${form.format === f ? "bg-violet-500/20 border-violet-500/40 text-violet-300" : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Starting Price (USD)</label>
                  <input type="number" value={form.price || ""} onChange={(e) => set("price", Number(e.target.value))}
                    placeholder="500"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Delivery (days)</label>
                  <input type="number" value={form.deliveryDays || ""} onChange={(e) => set("deliveryDays", Number(e.target.value))}
                    placeholder="7"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
                </div>
              </div>

              <button onClick={saveGig} disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-violet-400 transition-all disabled:opacity-50">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : "Publish Gig"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gig list */}
      {gigs.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-dashed border-white/10">
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-semibold text-xl mb-2">No gigs yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Create service offerings that brands can discover and hire directly.</p>
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-violet-400 transition-all">
            <Plus className="w-4 h-4" /> Create Your First Gig
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {gigs.map((gig, i) => (
            <motion.div key={gig.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl border border-white/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{gig.title}</h3>
                    <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">Live</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{gig.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {gig.tools.split(",").filter(Boolean).map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 bg-violet-500/10 text-violet-300 rounded-lg border border-violet-500/20">{t.trim()}</span>
                    ))}
                    <span className="text-xs px-2 py-0.5 bg-cyan-500/10 text-cyan-300 rounded-lg border border-cyan-500/20">{gig.format}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-lg">${gig.price}</div>
                  <div className="text-xs text-muted-foreground">{gig.deliveryDays}d delivery</div>
                  <div className="flex gap-1 mt-2">
                    <button onClick={() => deleteGig(gig.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-muted-foreground transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
