"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Filter, Clock, DollarSign, FileText, ChevronDown, ChevronUp, Send, CheckCircle, X, Star } from "lucide-react";
import { useBriefs } from "@/hooks/useBriefs";
import { useProposals } from "@/hooks/useProposals";
import { useCreators } from "@/hooks/useCreators";
import { useSession } from "@/hooks/useSession";
import { Brief, Proposal } from "@/types";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  Draft: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  Open: "bg-green-500/10 text-green-300 border border-green-500/20",
  "In Review": "bg-blue-500/10 text-blue-300 border border-blue-500/20",
  Hired: "bg-violet-500/10 text-violet-300 border border-violet-500/20",
  Delivered: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20",
};

const PROPOSAL_STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-300",
  Shortlisted: "bg-blue-500/10 text-blue-300",
  Accepted: "bg-green-500/10 text-green-300",
  Rejected: "bg-red-500/10 text-red-400",
};

function BrandView() {
  const { briefs } = useBriefs();
  const { session } = useSession();
  const { proposals, updateProposalStatus } = useProposals();
  const creators = useCreators();
  const [expandedBrief, setExpandedBrief] = useState<string | null>(null);

  const myBriefs = briefs.filter((b) => b.brandId === session?.brandId || b.brandId === session?.userId || b.brandId === "brand-001");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl">My Briefs</h2>
          <p className="text-muted-foreground text-sm">{myBriefs.length} briefs</p>
        </div>
        <Link href="/briefs/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl text-sm font-semibold hover:from-violet-500 hover:to-violet-400 transition-all">
          <Plus className="w-4 h-4" /> New Brief
        </Link>
      </div>

      <div className="space-y-4">
        {myBriefs.map((brief, i) => {
          const briefProposals = proposals.filter((p) => p.briefId === brief.id);
          const isExpanded = expandedBrief === brief.id;

          return (
            <motion.div key={brief.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="glass rounded-2xl border border-white/5 hover:border-violet-500/20 transition-all">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[brief.status]}`}>{brief.status}</span>
                        {brief.generatedByAI && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">✨ AI</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{brief.campaignTitle}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{brief.objective}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold">{formatCurrency(brief.budgetMin)} – {formatCurrency(brief.budgetMax)}</div>
                      <div className="text-xs text-muted-foreground">Deadline: {formatDate(brief.deadline)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{brief.contentType}</span>
                    <span>{brief.aspectRatios.join(", ")}</span>
                    {brief.toolsPreferred.length > 0 && (
                      <span>{brief.toolsPreferred.slice(0, 2).join(", ")}{brief.toolsPreferred.length > 2 ? ` +${brief.toolsPreferred.length - 2}` : ""}</span>
                    )}
                    {briefProposals.length > 0 && (
                      <button
                        onClick={() => setExpandedBrief(isExpanded ? null : brief.id)}
                        className="ml-auto flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors font-medium"
                      >
                        {briefProposals.length} proposal{briefProposals.length > 1 ? "s" : ""}
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Proposals */}
                {isExpanded && briefProposals.length > 0 && (
                  <div className="border-t border-white/5 p-5 space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Proposals</h4>
                    {briefProposals.map((proposal) => {
                      const creator = creators.find((c) => c.id === proposal.creatorId);
                      if (!creator) return null;
                      return (
                        <div key={proposal.id} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
                          <img src={creator.avatarUrl} alt={creator.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{creator.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full ${PROPOSAL_STATUS_STYLES[proposal.status]}`}>{proposal.status}</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{proposal.message}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="font-semibold text-foreground">{formatCurrency(proposal.price)}</span>
                              <span>{proposal.timelineDays} days</span>
                            </div>
                          </div>
                          {proposal.status === "Pending" && (
                            <div className="flex gap-2 flex-shrink-0">
                              <button onClick={() => { updateProposalStatus(proposal.id, "Shortlisted"); toast.success("Shortlisted!"); }}
                                className="text-xs px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/20 transition-all">
                                Shortlist
                              </button>
                              <button onClick={() => { updateProposalStatus(proposal.id, "Accepted"); toast.success("Accepted! Engagement started."); }}
                                className="text-xs px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-300 rounded-lg hover:bg-green-500/20 transition-all">
                                Accept
                              </button>
                              <button onClick={() => { updateProposalStatus(proposal.id, "Rejected"); toast.error("Proposal rejected."); }}
                                className="text-xs px-2 py-1 text-muted-foreground hover:text-red-400 transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                          {(proposal.status === "Shortlisted") && (
                            <button onClick={() => { updateProposalStatus(proposal.id, "Accepted"); toast.success("Accepted! Engagement started."); }}
                              className="text-xs px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-300 rounded-lg hover:bg-green-500/20 transition-all flex-shrink-0">
                              Accept
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        {myBriefs.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No briefs yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Post your first brief to start finding AI creators</p>
            <Link href="/briefs/new" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-violet-400 transition-all">
              <Plus className="w-4 h-4" /> Create Brief
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function CreatorView() {
  const { briefs } = useBriefs();
  const { session } = useSession();
  const { proposals, saveProposal, getProposalsByCreator } = useProposals();
  const [proposingFor, setProposingFor] = useState<string | null>(null);
  const [proposalForm, setProposalForm] = useState({ message: "", price: "", timelineDays: "" });

  const openBriefs = briefs.filter((b) => b.status === "Open");
  const myProposals = getProposalsByCreator(session?.creatorId ?? "creator-001");
  const appliedBriefIds = new Set(myProposals.map((p) => p.briefId));

  const handleSubmitProposal = (briefId: string) => {
    if (!proposalForm.message.trim() || !proposalForm.price || !proposalForm.timelineDays) {
      toast.error("Please fill all fields");
      return;
    }
    const proposal: Proposal = {
      id: `proposal-${Date.now()}`,
      briefId,
      creatorId: session?.creatorId ?? "creator-001",
      message: proposalForm.message,
      price: Number(proposalForm.price),
      timelineDays: Number(proposalForm.timelineDays),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    saveProposal(proposal);
    toast.success("Proposal submitted!");
    setProposingFor(null);
    setProposalForm({ message: "", price: "", timelineDays: "" });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl mb-1">Open Briefs</h2>
        <p className="text-muted-foreground text-sm">{openBriefs.length} briefs looking for creators</p>
      </div>

      <div className="space-y-4">
        {openBriefs.map((brief, i) => {
          const applied = appliedBriefIds.has(brief.id);
          const isProposing = proposingFor === brief.id;

          return (
            <motion.div key={brief.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="glass rounded-2xl border border-white/5 hover:border-violet-500/20 transition-all">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[brief.status]}`}>{brief.status}</span>
                        {brief.generatedByAI && <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">✨ AI</span>}
                        {applied && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Applied</span>}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{brief.campaignTitle}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{brief.brandName}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{brief.objective}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-green-400">{formatCurrency(brief.budgetMin)} – {formatCurrency(brief.budgetMax)}</div>
                      <div className="text-xs text-muted-foreground">{brief.contentType}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {brief.toolsPreferred.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 bg-violet-500/10 text-violet-300 rounded">{t}</span>
                    ))}
                    <span className="text-xs text-muted-foreground ml-auto">Deadline: {formatDate(brief.deadline)}</span>
                  </div>

                  {!applied && (
                    <div className="mt-4">
                      {!isProposing ? (
                        <button onClick={() => setProposingFor(brief.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl text-sm font-semibold hover:from-violet-500 hover:to-violet-400 transition-all">
                          <Send className="w-3.5 h-3.5" /> Submit Proposal
                        </button>
                      ) : (
                        <div className="bg-white/3 border border-white/5 rounded-xl p-4 space-y-3">
                          <h4 className="text-sm font-semibold">Your Proposal</h4>
                          <textarea value={proposalForm.message} onChange={(e) => setProposalForm((p) => ({ ...p, message: e.target.value }))}
                            placeholder="Describe your approach, why you're a great fit, relevant work..."
                            className="w-full h-24 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-violet-500/50 resize-none placeholder:text-muted-foreground transition-all" />
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-muted-foreground mb-1">Your Price (USD)</label>
                              <input type="number" value={proposalForm.price} onChange={(e) => setProposalForm((p) => ({ ...p, price: e.target.value }))}
                                placeholder="e.g. 3500"
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
                            </div>
                            <div>
                              <label className="block text-xs text-muted-foreground mb-1">Timeline (days)</label>
                              <input type="number" value={proposalForm.timelineDays} onChange={(e) => setProposalForm((p) => ({ ...p, timelineDays: e.target.value }))}
                                placeholder="e.g. 14"
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleSubmitProposal(brief.id)}
                              className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl text-sm font-semibold hover:from-violet-500 hover:to-violet-400 transition-all">
                              Submit Proposal
                            </button>
                            <button onClick={() => setProposingFor(null)}
                              className="px-4 py-2.5 glass border border-white/10 rounded-xl text-sm hover:bg-white/5 transition-all">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function BriefsPage() {
  const { session } = useSession();

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl mb-3">Sign in to view briefs</h2>
        <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">Go to login →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {session.role === "brand" ? <BrandView /> : <CreatorView />}
    </div>
  );
}
