import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/books(.*)"]);
const isLandingRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(
  (auth, req) => {
    if (isProtectedRoute(req)) auth().protect();

    if (isLandingRoute(req) && auth().userId) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  { signInUrl: "/sign-in" }
);

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
