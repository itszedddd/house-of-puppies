"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClient(data: FormData) {
    const name = data.get("name") as string;
    const phone = data.get("phone") as string;
    const email = data.get("email") as string;
    const address = data.get("address") as string;

    if (!name) return { error: "Name is required" };

    try {
        await prisma.client.create({
            data: {
                name,
                phone,
                email,
                address
            }
        });
        revalidatePath("/admin");
        revalidatePath("/admin/client");
        return { success: true };
    } catch (e) {
        return { error: "Failed to create client" };
    }
}
