
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ Public Routes Define Karein
const isPublicRoute = createRouteMatcher(["/", "/login", "/signup"]);

export default clerkMiddleware(async (auth, req) => {
  console.log("Auth Object:", auth); // Debugging ke liye check karein

  // ✅ User logged in hai ya nahi, yeh naya tareeqa hai
  if (!(await auth()).userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect if not logged in
  }
});

export const config = {
  matcher: ["/admin/:path*"], // admin ke sab routes protect ho jayein
};