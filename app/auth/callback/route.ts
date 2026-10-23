import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const errorParam = requestUrl.searchParams.get("error");
  const errorDesc = requestUrl.searchParams.get("error_description");

  // Google sent back an error (e.g. user denied)
  if (errorParam) {
    const url = new URL("/login", requestUrl.origin);
    url.searchParams.set("error", errorParam);
    url.searchParams.set("msg", errorDesc ?? "");
    return NextResponse.redirect(url);
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          // Must use PKCE flow — autoDetectSessionType handles this
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Pass the real error to login page so we can see it
      const url = new URL("/login", requestUrl.origin);
      url.searchParams.set("error", "exchange_failed");
      url.searchParams.set("msg", error.message);
      return NextResponse.redirect(url);
    }

    if (data?.user) {
      const destination = "/onboarding";
      const url = new URL(destination, requestUrl.origin);
      url.searchParams.set("name", data.user.user_metadata?.full_name ?? data.user.email ?? "User");
      url.searchParams.set("email", data.user.email ?? "");
      return NextResponse.redirect(url);
    }
  }

  // No code at all
  return NextResponse.redirect(new URL("/login?error=no_code", requestUrl.origin));
}
