import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);
  const briefId = searchParams.get('brief_id');
  const creatorId = searchParams.get('creator_id');

  let query = supabase.from('proposals').select('*, briefs(campaign_title, brand_name)');
  if (briefId) query = query.eq('brief_id', briefId);
  if (creatorId) query = query.eq('creator_id', creatorId);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();
  const { data, error } = await supabase
    .from('proposals')
    .insert([{ ...body, status: 'Pending' }])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const supabase = createServiceClient();
  const { id, status } = await req.json();
  const { error } = await supabase
    .from('proposals')
    .update({ status })
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
