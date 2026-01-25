import { NextRequest, NextResponse } from "next/server";

function hasAuthToken(req: NextRequest) {
  // Nuxt đang dùng cookie "auth_token"
  return Boolean(req.cookies.get("auth_token")?.value);
}

export async function middleware(req: NextRequest) {
  const start = Date.now();
  const { pathname } = req.nextUrl;
  const authed = hasAuthToken(req);

  let response: NextResponse;

  // Protect /admin/** (Nuxt middleware: always guard /admin)
  if (pathname.startsWith("/admin")) {
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
      response = NextResponse.redirect(url);
    } else {
      response = NextResponse.next();
    }
  }
  // If already authenticated, prevent visiting /auth/login or /auth/register
  else if (authed && (pathname === "/auth/login" || pathname === "/auth/register")) {
    const url = req.nextUrl.clone();
    url.pathname = "/user";
    response = NextResponse.redirect(url);
  } else {
    response = NextResponse.next();
  }

  const duration = Date.now() - start;
  if (duration > 50) {
    // Took too long
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};







