"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRecord(data: FormData) {
    const petId = data.get("petId") as string;
    const serviceType = data.get("serviceType") as string;
    const priceString = data.get("price") as string;
    const price = priceString ? parseFloat(priceString) : 0;
    const status = data.get("status") as string;
    const notes = (data.get("notes") as string) || null;
    const dateInput = data.get("date") as string;

    if (!petId || !serviceType) {
        return { error: "Pet and Service Type are required" };
    }

    try {
        await prisma.record.create({
            data: {
                petId,
                serviceType,
                price,
                status,
                notes,
                date: dateInput ? new Date(dateInput) : new Date()
            }
        });

        revalidatePath("/admin/records");
        revalidatePath("/admin");
        revalidatePath("/client");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create grooming record" };
    }
}
