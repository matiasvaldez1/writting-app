import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/books(.*)"]);

export default clerkMiddleware(
  (auth, req) => {
    if (isProtectedRoute(req)) auth().protect();
    const { pathname } = req.nextUrl;
    if (auth().userId && pathname === "/") {
      return Response.redirect(new URL("/dashboard", req.url));
    }
  },
  { signInUrl: "/sign-in" }
);

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
