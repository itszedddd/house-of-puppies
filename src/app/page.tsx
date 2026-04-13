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

    if (role === "staff_records") {
        redirect("/employee");
    } else if (role === "staff_sms") {
        redirect("/employee/reminders");
    } else if (role === "staff_inventory") {
        redirect("/inventory");
    } else if (role === "owner") {
        redirect("/analytics");
    } else if (role === "vet_admin") {
        redirect("/veterinary");
    } else {
        redirect("/login");
    }
}
