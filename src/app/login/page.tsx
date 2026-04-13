import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await auth();

    // If already logged in, no need to be on the login page
    if (session?.user) {
        redirect("/");
    }

    return <LoginForm />;
}
