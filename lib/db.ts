/**
 * Real Supabase database writes.
 * Every action in the app calls these functions.
 * Judges can watch rows appear live in Supabase dashboard.
 */

import { supabase } from "./supabase";

// ── Profiles ──────────────────────────────────────────────────────────────────
export async function upsertProfile(data: {
  id: string;
  email: string;
  name: string;
  role: "brand" | "creator";
  avatar_url?: string;
}) {
  const { error } = await supabase.from("profiles").upsert({
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role,
    avatar_url: data.avatar_url ?? null,
    created_at: new Date().toISOString(),
  });
  if (error) console.error("Profile upsert error:", error.message);
}

// ── Briefs ────────────────────────────────────────────────────────────────────
export async function insertBrief(data: {
  id: string;
  brand_id: string;
  brand_name: string;
  title: string;
  description: string;
  budget: number;
  status: string;
}) {
  const { error } = await supabase.from("briefs").upsert({
    ...data,
    created_at: new Date().toISOString(),
  });
  if (error) console.error("Brief insert error:", error.message);
}

// ── Proposals ─────────────────────────────────────────────────────────────────
export async function insertProposal(data: {
  id: string;
  brief_id: string;
  creator_id: string;
  creator_name: string;
  price: number;
  message: string;
  status: string;
}) {
  const { error } = await supabase.from("proposals").upsert({
    ...data,
    created_at: new Date().toISOString(),
  });
  if (error) console.error("Proposal insert error:", error.message);
}

export async function updateProposalStatusDB(proposalId: string, status: string) {
  const { error } = await supabase
    .from("proposals")
    .update({ status })
    .eq("id", proposalId);
  if (error) console.error("Proposal update error:", error.message);
}

// ── Payments ──────────────────────────────────────────────────────────────────
export async function insertPayment(data: {
  id: string;
  brief_id: string;
  brand_id: string;
  creator_name: string;
  amount: number;
  stripe_payment_intent_id: string;
  status: string;
}) {
  const { error } = await supabase.from("payments").upsert({
    ...data,
    created_at: new Date().toISOString(),
  });
  if (error) console.error("Payment insert error:", error.message);
}
