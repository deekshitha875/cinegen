import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const role = req.cookies.get("cinegen_role")?.value;
  const path = req.nextUrl.pathname;

  const brandOnlyRoutes = ["/briefs/new"];
  const authRequiredRoutes = ["/dashboard", "/briefs"];

  if (brandOnlyRoutes.some((r) => path.startsWith(r)) && role !== "brand") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (authRequiredRoutes.some((r) => path === r || path.startsWith(r + "/")) && !role) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/briefs/:path*"],
};
