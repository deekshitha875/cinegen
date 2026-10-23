import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    // Next.js 14 — cookies() is synchronous
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Route Handler — cookies can be read but setting may fail
              // This is fine for our use case
            }
          },
        },
      }
    );

    const { data, error: exchError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchError) {
      console.error("Exchange error:", exchError.message);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(exchError.message)}`
      );
    }

    if (data?.user) {
      const name = encodeURIComponent(
        data.user.user_metadata?.full_name ?? data.user.email ?? "User"
      );
      const email = encodeURIComponent(data.user.email ?? "");
      return NextResponse.redirect(
        `${origin}/onboarding?name=${name}&email=${email}`
      );
    }
  }

  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
