"use client";
import { useState, useEffect, useCallback } from "react";
import { Proposal, ProposalStatus } from "@/types";
import { storage } from "@/lib/storage";
import { seedProposals } from "@/lib/seed/proposals";

const KEY = "cinegen_proposals";

export function useProposals() {
  const [userProposals, setUserProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    const stored = storage.read<Proposal[]>(KEY) ?? [];
    setUserProposals(stored);
  }, []);

  const allProposals = [...seedProposals, ...userProposals];

  const saveProposal = useCallback((proposal: Proposal) => {
    setUserProposals((prev) => {
      const exists = prev.findIndex((p) => p.id === proposal.id);
      const updated =
        exists >= 0
          ? prev.map((p) => (p.id === proposal.id ? proposal : p))
          : [...prev, proposal];
      storage.write(KEY, updated);
      return updated;
    });
  }, []);

  const updateProposalStatus = useCallback((proposalId: string, status: ProposalStatus) => {
    const all = storage.read<Proposal[]>(KEY) ?? [];
    const seed = seedProposals.find((p) => p.id === proposalId);
    if (seed) {
      // Can't edit seed directly — store override in user proposals
      const override = { ...seed, status };
      const updated = [...all.filter((p) => p.id !== proposalId), override];
      storage.write(KEY, updated);
      setUserProposals(updated);
    } else {
      const updated = all.map((p) => (p.id === proposalId ? { ...p, status } : p));
      storage.write(KEY, updated);
      setUserProposals(updated);
    }
  }, []);

  const getProposalsForBrief = useCallback(
    (briefId: string) => allProposals.filter((p) => p.briefId === briefId),
    [allProposals]
  );

  const getProposalsByCreator = useCallback(
    (creatorId: string) => allProposals.filter((p) => p.creatorId === creatorId),
    [allProposals]
  );

  return { proposals: allProposals, saveProposal, updateProposalStatus, getProposalsForBrief, getProposalsByCreator };
}
