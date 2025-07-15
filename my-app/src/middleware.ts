import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicPath = createRouteMatcher([
  "/sign-up",
  "/sign-in",
  "/",
  "/mainpage"
]);

const isPublicApi = createRouteMatcher([
  "/api/videos"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentURL = new URL(req.url);

  const isOnHome = currentURL.pathname === "/";
  const isOnMainPage = currentURL.pathname === "/mainpage";
  const isApiPage = currentURL.pathname.startsWith("/api");

  // ✅ Only redirect to /mainpage if on "/" and user is logged in
  if (userId && isPublicPath(req) && isOnHome) {
    return NextResponse.redirect(new URL("/mainpage", req.url));
  }

  // ✅ Redirect unauthenticated users away from protected pages
  if (!userId) {
    if (!isPublicApi(req) && !isPublicPath(req)) {
      return NextResponse.redirect(new URL("/sign-up", req.url));
    }

    if (isApiPage && !isPublicApi(req)) {
      return NextResponse.redirect(new URL("/sign-up", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/mainpage", "/api/:path*" ]
};
