import NextAuth from "next-auth";
import { authConfig } from "./auth";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const role = (req.auth?.user as any)?.role;
    const path = req.nextUrl.pathname;

    // Explicitly define public routes for Guests/Clients
    // API auth and API public routes are also excluded from protection
    const isPublicRoute =
        path === "/" ||
        path === "/client" ||
        path === "/login" ||
        path.startsWith("/login/forgot-password") ||
        path.startsWith("/api/auth") ||
        path.startsWith("/api/public") ||
        path.startsWith("/status"); // Allow status page if it exists

    // If the user is NOT logged in and tries to access ANY non-public route
    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", req.nextUrl));
    }

    // Role-Based Access Control: Block 'client' users from accessing dashboard pages.
    if (isLoggedIn && role === "client" && !isPublicRoute) {
        return Response.redirect(new URL("/client", req.nextUrl));
    }
});

export const config = {
    // Keep the matcher as is: run middleware on all routes except static assets & api
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)"],
};
