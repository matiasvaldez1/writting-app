import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({signInUrl: '/sign-in'});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};