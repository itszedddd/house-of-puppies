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

        const dbRole = await prisma.role.findUnique({ where: { name: role === "admin" ? "vet_admin" : role } });
        if (!dbRole) return { error: "Invalid role specified" };

        const newUser = await prisma.staff.create({
            data: {
                fullName: name,
                username: email,
                passwordHash,
                roleId: dbRole.id
            }
        });
        revalidatePath("/admin/employees");
        return { success: true };
    } catch (e: any) {
        if (e.code === 'P2002') {
            return { error: "An employee with this email already exists" };
        }
        return { error: "Failed to create employee: " + (e.message || "Unknown error") };
    }
}

export async function updateEmployee(id: string, data: FormData) {
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const role = data.get("role") as string;

    if (!name || !email || !role) return { error: "Name, email, and role are required" };

    try {
        const dbRole = await prisma.role.findUnique({ where: { name: role === "admin" ? "vet_admin" : role } });
        if (!dbRole) return { error: "Invalid role specified" };

        const updatedUser = await prisma.staff.update({
            where: { id },
            data: {
                fullName: name,
                username: email,
                roleId: dbRole.id
            }
        });
        revalidatePath("/admin/employees");
        return { success: true };
    } catch (e: any) {
        if (e.code === 'P2002') {
            return { error: "An employee with this email already exists" };
        }
        return { error: "Failed to update employee: " + (e.message || "Unknown error") };
    }
}

export async function deleteEmployee(id: string) {
    try {
        await prisma.staff.delete({
            where: { id }
        });
        revalidatePath("/admin/employees");
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete employee" };
    }
}
