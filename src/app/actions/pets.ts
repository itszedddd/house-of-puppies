"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPet(data: FormData) {
    const name = data.get("name") as string;
    const ownerId = data.get("clientId") as string;
    const breed = (data.get("breed") as string) || null;
    const species = (data.get("species") as string) || null;
    const dateOfBirth = data.get("age") as string || null;

    if (!name || !ownerId) {
        return { error: "Name and Owner are required" };
    }

    try {
        // Duplicate check: same pet name under the same owner
        const existingPet = await prisma.pet.findFirst({
            where: {
                name: { equals: name },
                ownerId: ownerId,
            }
        });

        if (existingPet) {
            return { error: `A pet named "${name}" already exists for this owner. Please use a different name or select the existing pet.` };
        }

        const newPet = await prisma.pet.create({
            data: {
                name,
                ownerId,
                breed,
                species,
                dateOfBirth
            }
        });

        revalidatePath("/admin/pets");
        revalidatePath("/admin");
        revalidatePath("/employee");
        revalidatePath("/employee/pets");
        return { success: true, newPetId: newPet.id };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create pet record" };
    }
}

export async function searchPetStatus(id: string) {
    try {
        const pet = await prisma.pet.findUnique({
            where: { id: id },
            include: {
                owner: true,
                records: {
                    orderBy: { visitDate: 'desc' },
                    take: 1
                }
            }
        });

        if (!pet) {
            const petByShortId = await prisma.pet.findFirst({
                where: {
                    id: {
                        endsWith: id
                    }
                },
                include: {
                    owner: true,
                    records: {
                        orderBy: { visitDate: 'desc' },
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

export async function updatePet(id: string, data: FormData) {
    const name = data.get("name") as string;
    const breed = (data.get("breed") as string) || null;
    const species = (data.get("species") as string) || null;
    const dateOfBirth = data.get("age") as string || null;
    const status = data.get("status") as string;

    if (!name) return { error: "Name is required" };

    try {
        await prisma.pet.update({
            where: { id },
            data: { name, breed, species, dateOfBirth }
        });

        if (status) {
            const latestRecord = await prisma.clinicalRecord.findFirst({
                where: { petId: id },
                orderBy: { visitDate: "desc" }
            });

            if (latestRecord) {
                await prisma.clinicalRecord.update({
                    where: { id: latestRecord.id },
                    data: { status }
                });
            }
        }

        revalidatePath("/admin/pets");
        revalidatePath("/admin");
        revalidatePath("/employee/pets");
        return { success: true };
    } catch (e) {
        return { error: "Failed to update pet" };
    }
}

export async function deletePet(id: string) {
    try {
        await prisma.pet.delete({ where: { id } });
        revalidatePath("/admin/pets");
        revalidatePath("/admin");
        revalidatePath("/employee/pets");
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete pet" };
    }
}
