"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, X, Star, Sparkles, Send } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { useBriefs } from "@/hooks/useBriefs";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { seedCreators } from "@/lib/seed/creators";
import { computeMatchScore } from "@/lib/matchScore";

type Proposal = {
  id: string;
  briefId: string;
  creatorId: string;
  creatorName: string;
  message: string;
  rate: number;
  timeline: string;
  createdAt: string;
  status: "pending" | "accepted" | "rejected";
};

export default function BriefDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { session } = useSession();
  const { briefs } = useBriefs();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [matches, setMatches] = useState<any[]>([]);

  const brief = briefs.find((b) => b.id === params.id);

  useEffect(() => {
    if (brief && session) {
      // Load proposals
      const saved = storage.read<Proposal[]>(`proposals_${brief.id}`) ?? [];
      setProposals(saved);

      // Compute matches
      if (session.role === "brand") {
        const scored = seedCreators.map((c) => {
          const result = computeMatchScore(c, brief);
          return {
            ...c,
            score: result.score,
            factors: result.factors,
          };
        }).filter((c) => c.score >= 50).sort((a, b) => b.score - a.score).slice(0, 5);
        setMatches(scored);
      }
    }
  }, [brief, session]);

  const acceptProposal = (proposalId: string) => {
    const proposal = proposals.find((p) => p.id === proposalId);
    if (!proposal || !brief) return;

    // Create project
    const project = {
      id: `project-${Date.now()}`,
      briefTitle: brief.campaignTitle,
      brandId: brief.brandId,
      creatorId: proposal.creatorId,
      creatorName: proposal.creatorName,
      brandName: session?.name || "Brand",
      status: "active" as const,
      startedAt: new Date().toISOString(),
    };

    storage.write(`project_${project.id}`, project);

    // Update proposal status
    const updated = proposals.map((p) => p.id === proposalId ? { ...p, status: "accepted" as const } : p);
    setProposals(updated);
    storage.write(`proposals_${brief.id}`, updated);

    toast.success("Proposal accepted! Project created.");
    router.push(`/projects/${project.id}`);
  };

  const rejectProposal = (proposalId: string) => {
    const updated = proposals.map((p) => p.id === proposalId ? { ...p, status: "rejected" as const } : p);
    setProposals(updated);
    storage.write(`proposals_${brief.id}`, updated);
    toast.success("Proposal rejected");
  };

  if (!brief) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Brief not found</p>
      </div>
    );
  }

  const isBrand = session?.role === "brand" && brief.brandId === session.brandId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/briefs" className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-2xl">{brief.campaignTitle}</h1>
          <p className="text-muted-foreground text-sm">{brief.brandName}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Brief details */}
        <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
          <div>
            <h3 className="text-xs text-muted-foreground mb-1">Objective</h3>
            <p className="text-sm">{brief.objective}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <h3 className="text-xs text-muted-foreground mb-1">Type</h3>
              <p className="text-sm font-medium">{brief.contentType}</p>
            </div>
            <div>
              <h3 className="text-xs text-muted-foreground mb-1">Budget</h3>
              <p className="text-sm font-medium">${brief.budgetMin.toLocaleString()} - ${brief.budgetMax.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-xs text-muted-foreground mb-1">Deadline</h3>
              <p className="text-sm font-medium">{new Date(brief.deadline).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-xs text-muted-foreground mb-1">License</h3>
              <p className="text-sm font-medium">{brief.commercialUse.licenseTier}</p>
            </div>
          </div>
        </div>

        {/* Matched creators (brand view) */}
        {isBrand && matches.length > 0 && (
          <div className="glass rounded-2xl border border-white/10 p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" /> Top Matches
            </h2>
            <div className="space-y-3">
              {matches.map((creator) => (
                <Link key={creator.id} href={`/creators/${creator.id}`}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {creator.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{creator.name}</div>
                    <div className="text-xs text-muted-foreground">{creator.specialization} • ${creator.rate}/hr</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-green-400">{creator.score}% match</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Proposals */}
        {isBrand && (
          <div className="glass rounded-2xl border border-white/10 p-6">
            <h2 className="font-semibold mb-4">Proposals ({proposals.length})</h2>
            {proposals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No proposals yet. Share your brief with creators!</p>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <motion.div key={proposal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{proposal.creatorName}</h3>
                        <p className="text-xs text-muted-foreground">{new Date(proposal.createdAt).toLocaleDateString()}</p>
                      </div>
                      {proposal.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => acceptProposal(proposal.id)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-500 transition-all">
                            Accept
                          </button>
                          <button onClick={() => rejectProposal(proposal.id)}
                            className="px-3 py-1.5 bg-red-600/80 text-white rounded-lg text-xs hover:bg-red-500 transition-all">
                            Reject
                          </button>
                        </div>
                      )}
                      {proposal.status === "accepted" && (
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs border border-green-500/20">Accepted</span>
                      )}
                      {proposal.status === "rejected" && (
                        <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs border border-red-500/20">Rejected</span>
                      )}
                    </div>
                    <p className="text-sm mb-3">{proposal.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Rate: ${proposal.rate}/hr</span>
                      <span>Timeline: {proposal.timeline}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Apply (creator view) */}
        {session?.role === "creator" && (
          <ApplyForm briefId={brief.id} session={session} proposals={proposals} setProposals={setProposals} />
        )}
      </div>
    </div>
  );
}

function ApplyForm({ briefId, session, proposals, setProposals }: any) {
  const [message, setMessage] = useState("");
  const [rate, setRate] = useState(85);
  const [timeline, setTimeline] = useState("7-10 days");
  const [applying, setApplying] = useState(false);

  const hasApplied = proposals.some((p: Proposal) => p.creatorId === session.creatorId);

  const handleApply = async () => {
    if (!message.trim()) { toast.error("Add a message"); return; }
    setApplying(true);
    await new Promise((r) => setTimeout(r, 500));

    const proposal: Proposal = {
      id: `proposal-${Date.now()}`,
      briefId,
      creatorId: session.creatorId,
      creatorName: session.name,
      message: message.trim(),
      rate,
      timeline,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    const updated = [...proposals, proposal];
    setProposals(updated);
    storage.write(`proposals_${briefId}`, updated);

    setApplying(false);
    toast.success("Proposal submitted!");
    setMessage("");
  };

  if (hasApplied) {
    return (
      <div className="glass rounded-2xl border border-white/10 p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <h3 className="font-semibold mb-1">Proposal Submitted</h3>
        <p className="text-sm text-muted-foreground">The brand will review your proposal and get back to you.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
      <h2 className="font-semibold">Apply to This Brief</h2>
      <div>
        <label className="block text-xs text-muted-foreground mb-1.5">Your Message</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
          placeholder="Explain why you're a great fit for this brief..."
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">Your Rate (USD/hr)</label>
          <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">Timeline</label>
          <input value={timeline} onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. 7-10 days"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
        </div>
      </div>
      <button onClick={handleApply} disabled={applying}
        className="w-full py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-violet-400 transition-all disabled:opacity-50">
        {applying ? "Submitting..." : "Submit Proposal"}
      </button>
    </div>
  );
}
