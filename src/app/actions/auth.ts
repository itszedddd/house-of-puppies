"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function resetPassword(formData: FormData) {
    const email = formData.get("email")?.toString();
    const newPassword = formData.get("newPassword")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!email || !newPassword || !confirmPassword) {
        return { error: "All fields are required" };
    }

    if (newPassword !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    if (newPassword.length < 6) {
        return { error: "Password must be at least 6 characters long" };
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Typically in prod we don't say if email exists, but for internal app it's fine.
            return { error: "No user found with this email" };
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);

        await prisma.staff.update({
            where: { email },
            data: { passwordHash }
        });

        return { success: true };
    } catch (error) {
        console.error("Error resetting password", error);
        return { error: "Internal server error" };
    }
}
