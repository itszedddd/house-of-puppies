"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClient(data: FormData) {
    const name = data.get("name") as string;
    const phone = (data.get("phone") as string) || null;
    const email = (data.get("email") as string) || null;
    const address = (data.get("address") as string) || null;

    if (!name) return { error: "Name is required" };
    if (!phone) return { error: "Phone number is required for AI SMS Reminders" };

    const rawFirstName = name.split(' ')[0] || '';
    const rawLastName = name.split(' ').slice(1).join(' ') || '';

    try {
        // Prevent duplicate client by name or phone
        const existingClient = await prisma.petOwner.findFirst({
            where: {
                OR: [
                    {
                        firstName: { equals: rawFirstName },
                        lastName: { equals: rawLastName }
                    },
                    {
                        contactNumber: phone
                    }
                ]
            }
        });

        if (existingClient) {
            return { error: "A client with this name or phone number already exists. Proceed to patient search to avoid duplicates." };
        }

        const newClient = await prisma.petOwner.create({
            data: {
                firstName: rawFirstName,
                lastName: rawLastName,
                email,
                contactNumber: phone,
                address
            }
        });
        revalidatePath("/admin");
        revalidatePath("/admin/clients");
        revalidatePath("/employee");
        return { success: true, newClientId: newClient.id };
    } catch (e) {
        return { error: "Failed to create client" };
    }
}

export async function updateClient(id: string, data: FormData) {
    const name = data.get("name") as string;
    const phone = (data.get("phone") as string) || null;
    const email = (data.get("email") as string) || null;
    const address = (data.get("address") as string) || null;

    if (!name) return { error: "Name is required" };

    try {
        const updatedClient = await prisma.petOwner.update({
            where: { id },
            data: {
                firstName: name.split(' ')[0],
                lastName: name.split(' ').slice(1).join(' ') || '',
                email,
                contactNumber: phone,
                address
            }
        });
        revalidatePath("/admin");
        revalidatePath("/admin/clients");
        return { success: true };
    } catch (e) {
        return { error: "Failed to update client" };
    }
}

export async function deleteClient(id: string) {
    try {
        await prisma.petOwner.delete({
            where: { id }
        });
        revalidatePath("/admin");
        revalidatePath("/admin/clients");
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete client" };
    }
}
