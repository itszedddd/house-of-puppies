"use server";

import { prisma } from "@/lib/prisma";
import { Pet } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function searchPetStatus(id: string): Promise<Pet | null> {
    try {
        const pet = await prisma.pet.findUnique({
            where: { id: id },
            include: {
                client: true,
                records: {
                    orderBy: { date: 'desc' },
                    take: 1
                }
            }
        });

        // Search by short-id as fallback
        if (!pet) {
            const petByShortId = await prisma.pet.findFirst({
                where: {
                    id: {
                        endsWith: id
                    }
                },
                include: {
                    client: true,
                    records: {
                        orderBy: { date: 'desc' },
                        take: 1
                    }
                }
            });
            return petByShortId as any;
        }

        return pet as any;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function createPet(data: FormData) {
    const name = data.get("name") as string;
    const clientId = data.get("clientId") as string;
    const breed = (data.get("breed") as string) || null;
    const species = (data.get("species") as string) || null;
    const ageString = data.get("age") as string;
    const age = ageString ? parseInt(ageString, 10) : null;
    const notes = (data.get("notes") as string) || null;

    if (!name || !clientId) {
        return { error: "Name and Client Owner are required" };
    }

    try {
        await prisma.pet.create({
            data: {
                name,
                clientId,
                breed,
                species,
                age,
                notes
            }
        });

        revalidatePath("/admin/pets");
        revalidatePath("/admin");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create pet record" };
    }
}
