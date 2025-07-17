import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userId = request.cookies.get("userId")?.value;
  
  // If no userId in cookies, redirect to lobby to select an avatar
  if (!userId) {
    return NextResponse.redirect(new URL("/lobby", request.url));
  }
  
  // Handle the rooms list page
  if (pathname === "/lobby/rooms") {
    // Rewrite to /lobby/[userId]/rooms internally
    return NextResponse.rewrite(
      new URL(`/lobby/${userId}/rooms`, request.url)
    );
  }
  
  // Handle specific room pages
  // Format: /lobby/rooms/[roomId]
  if (pathname.match(/^\/lobby\/rooms\/[\w-]+$/)) {
    const roomId = pathname.split("/").pop();
    
    // Rewrite to /lobby/[userId]/rooms/[roomId] internally
    return NextResponse.rewrite(
      new URL(`/lobby/${userId}/rooms/${roomId}`, request.url)
    );
  }
  
  return NextResponse.next();
}

// Configure the paths that should invoke the middleware
export const config = {
  matcher: ["/lobby/rooms", "/lobby/rooms/:path*"],
};
