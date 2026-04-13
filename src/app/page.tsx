import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Root Router Page
 * Handles landing logic:
 * - Guests: Redirect to /login
 * - Authenticated: Redirect to role-appropriate dashboard
 */
export default async function RootPage() {
    const session = await auth();

    // If no user is logged in, redirect to the Login page immediately
    if (!session?.user) {
        redirect("/login");
    }

    // Role-based routing for authenticated users
    const role = (session.user as any).role as string;

    if (role === "staff") {
        redirect("/employee");
    } else if (role === "owner") {
        redirect("/analytics");
    } else {
        // Vets/Admins go to Veterinary dashboard
        redirect("/veterinary");
    }
}
