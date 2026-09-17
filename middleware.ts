import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_CONFIG } from "@/lib/auth/auth.config";

function isTokenUsable(token: string): boolean {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return false;
    const json = atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as { exp?: number; role?: string };
    if (payload.exp && payload.exp * 1000 <= Date.now()) return false;
    if (payload.role && !["admin", "super_admin"].includes(payload.role)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_CONFIG.TOKEN_COOKIE_KEY)?.value;
  const hasValidToken = Boolean(token && isTokenUsable(token));
  const { pathname } = request.nextUrl;

  const isLogin = pathname === "/login";
  const isAdmin = pathname.startsWith("/admin");
  const isRoot = pathname === "/";

  if ((isAdmin || isRoot) && !hasValidToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    if (isAdmin) {
      url.searchParams.set("redirect", pathname);
    }
    const response = NextResponse.redirect(url);
    if (token && !hasValidToken) {
      response.cookies.delete(AUTH_CONFIG.TOKEN_COOKIE_KEY);
    }
    return response;
  }

  if ((isLogin || isRoot) && hasValidToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*"],
};
