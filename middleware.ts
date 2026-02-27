import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next();

  // Log request details
  const duration = Date.now() - start;
  console.log(
    `[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname} - ${duration}ms`
  );

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and _next
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
