import NextAuth from "next-auth";
import { authConfig } from "./auth";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isDashboardRoute = req.nextUrl.pathname.startsWith("/");

    // Exclude public website routes later
    const isPublicRoute =
        req.nextUrl.pathname === "/" ||
        req.nextUrl.pathname === "/login" ||
        req.nextUrl.pathname.startsWith("/api/auth");

    if (isDashboardRoute && !isPublicRoute && !isLoggedIn) {
        return Response.redirect(new URL("/login", req.nextUrl));
    }
});

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
