import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // Build redirect — new users go to onboarding, returning to dashboard
      const isNew = data.user.created_at === data.user.updated_at;
      const destination = isNew ? "/onboarding" : "/dashboard";

      // Pass the user info as query params so the client can set the local session
      const url = new URL(destination, requestUrl.origin);
      url.searchParams.set("name", data.user.user_metadata?.full_name ?? data.user.email ?? "User");
      url.searchParams.set("email", data.user.email ?? "");
      url.searchParams.set("uid", data.user.id);

      return NextResponse.redirect(url);
    }
  }

  // Failed — back to login
  return NextResponse.redirect(new URL("/login?error=oauth_failed", requestUrl.origin));
}
