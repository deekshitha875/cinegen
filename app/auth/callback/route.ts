import { NextRequest, NextResponse } from "next/server";

// The PKCE code exchange MUST happen client-side because the code verifier
// is stored in the browser (localStorage/sessionStorage), not on the server.
// This route just redirects to a client-side page that does the exchange.
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  
  // Forward all query params (code, error, etc.) to the client-side handler
  const clientUrl = new URL("/auth/exchange", requestUrl.origin);
  requestUrl.searchParams.forEach((value, key) => {
    clientUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(clientUrl);
}
