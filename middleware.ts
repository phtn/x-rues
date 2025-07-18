import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userId = request.cookies.get("userId")?.value;

  // If no userId in cookies, redirect to lobby to select an avatar
  if (!userId) {
    return NextResponse.redirect(new URL("/lobby", request.url));
  }

  // Handle the rooms list page
  if (pathname === "/lobby/rooms") {
    // Redirect to /lobby/[userId]/rooms with 307 temporary redirect to preserve the request method
    return NextResponse.redirect(new URL(`/lobby/${userId}/rooms`, request.url), 307);
  }

  // Handle specific room pages
  // Format: /lobby/rooms/[roomId]
  if (pathname.match(/^\/lobby\/rooms\/[\w-]+$/)) {
    const roomId = pathname.split("/").pop();

    // Redirect to /lobby/[userId]/rooms/[roomId] with 307 temporary redirect
    return NextResponse.redirect(
      new URL(`/lobby/${userId}/rooms/${roomId}`, request.url),
      307
    );
  }

  return NextResponse.next();
}

// Configure the paths that should invoke the middleware
export const config = {
  matcher: ["/lobby/rooms", "/lobby/rooms/:path*"],
};
