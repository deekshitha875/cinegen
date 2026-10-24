import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// GET: fetch conversations for a user
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ conversations: [] });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("director_conversations")
      .select("id, title, created_at, updated_at, is_active")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Fetch conversations error:", error);
      return NextResponse.json({ conversations: [] });
    }

    return NextResponse.json({ conversations: data || [] });
  } catch (err) {
    console.error("GET conversations error:", err);
    return NextResponse.json({ conversations: [] });
  }
}

// POST: create a new conversation
export async function POST(req: NextRequest) {
  try {
    const { userId, title } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("director_conversations")
      .insert({
        user_id: userId,
        title: title || "New Campaign Brief",
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Create conversation error:", error);
      // Return a temporary id if DB isn't set up yet
      return NextResponse.json({
        conversation: { id: `temp-${Date.now()}`, title: title || "New Campaign Brief" },
      });
    }

    return NextResponse.json({ conversation: data });
  } catch (err) {
    console.error("POST conversation error:", err);
    return NextResponse.json({
      conversation: { id: `temp-${Date.now()}`, title: "New Campaign Brief" },
    });
  }
}

// DELETE: soft-delete a conversation
export async function DELETE(req: NextRequest) {
  try {
    const { conversationId, userId } = await req.json();
    if (!conversationId || !userId) {
      return NextResponse.json({ error: "conversationId and userId required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase
      .from("director_conversations")
      .update({ is_active: false })
      .eq("id", conversationId)
      .eq("user_id", userId);

    if (error) {
      console.error("Delete conversation error:", error);
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE conversation error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
