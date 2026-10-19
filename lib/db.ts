import { supabase } from './supabase';

// ─── Briefs ──────────────────────────────────────────────────────────────────

export async function getBriefs() {
  const { data, error } = await supabase
    .from('briefs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getBriefsByBrand(brandId: string) {
  const { data, error } = await supabase
    .from('briefs')
    .select('*')
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createBrief(brief: {
  brand_id: string;
  brand_name: string;
  campaign_title: string;
  objective?: string;
  content_type?: string;
  style?: string;
  aspect_ratios?: string[];
  duration_seconds?: number;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  tools_preferred?: string[];
  license_tier?: string;
  generated_by_ai?: boolean;
  raw_idea?: string;
}) {
  const { data, error } = await supabase
    .from('briefs')
    .insert([{ ...brief, status: 'Open' }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBriefStatus(id: string, status: string) {
  const { error } = await supabase
    .from('briefs')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

// ─── Proposals ───────────────────────────────────────────────────────────────

export async function getProposalsByBrief(briefId: string) {
  const { data, error } = await supabase
    .from('proposals')
    .select('*, profiles(name, email)')
    .eq('brief_id', briefId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProposalsByCreator(creatorId: string) {
  const { data, error } = await supabase
    .from('proposals')
    .select('*, briefs(campaign_title, brand_name, budget_max)')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createProposal(proposal: {
  brief_id: string;
  creator_id: string;
  message: string;
  price: number;
  timeline_days: number;
}) {
  const { data, error } = await supabase
    .from('proposals')
    .insert([{ ...proposal, status: 'Pending' }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProposalStatus(id: string, status: string) {
  const { error } = await supabase
    .from('proposals')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

// ─── Creators ────────────────────────────────────────────────────────────────

export async function getCreatorProfile(userId: string) {
  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) return null;
  return data;
}

export async function upsertCreatorProfile(profile: {
  user_id: string;
  headline?: string;
  bio?: string;
  location?: string;
  hourly_rate?: number;
  availability?: string;
  tools?: string[];
  specializations?: string[];
  skills?: string[];
}) {
  const { data, error } = await supabase
    .from('creators')
    .upsert([profile], { onConflict: 'user_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}
