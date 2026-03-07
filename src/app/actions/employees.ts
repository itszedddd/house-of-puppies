"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createEmployee(data: FormData) {
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const role = data.get("role") as string;

    if (!name || !email || !password || !role) return { error: "All fields are required" };

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role
            }
        });
        revalidatePath("/admin/employees");
        return { success: true };
    } catch (e) {
        return { error: "Failed to create employee" };
    }
}

export async function updateEmployee(id: string, data: FormData) {
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const role = data.get("role") as string;

    if (!name || !email || !role) return { error: "Name, email, and role are required" };

    try {
        await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                role
            }
        });
        revalidatePath("/admin/employees");
        return { success: true };
    } catch (e) {
        return { error: "Failed to update employee" };
    }
}

export async function deleteEmployee(id: string) {
    try {
        await prisma.user.delete({
            where: { id }
        });
        revalidatePath("/admin/employees");
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete employee" };
    }
}
