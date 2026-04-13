"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPrescription(petId: string, data: FormData) {
    const medicine = data.get("medicine") as string;
    const dosage = data.get("dosage") as string;
    const instructions = (data.get("instructions") as string) || null;

    if (!medicine || !dosage) return { error: "Medicine and dosage are required" };

    try {
        const latestRecord = await prisma.clinicalRecord.findFirst({
            where: { petId },
            orderBy: { visitDate: 'desc' }
        });

        if (!latestRecord) return { error: "No clinical record exists for this pet to attach prescription." };

        const staff = await prisma.staff.findFirst();

        await prisma.prescriptionRecord.create({
            data: {
                recordId: latestRecord.id,
                createdById: staff?.id || "",
                medicationName: medicine,
                dosage,
                instructions
            }
        });
        revalidatePath(`/patient/${petId}`);
        revalidatePath("/veterinary");
        return { success: true };
    } catch (e) {
        return { error: "Failed to save prescription" };
    }
}

export async function updatePrescription(prescriptionId: string, data: FormData) {
    const medicine = data.get("medicine") as string;
    const dosage = data.get("dosage") as string;
    const instructions = (data.get("instructions") as string) || null;

    if (!medicine || !dosage) return { error: "Medicine and dosage are required" };

    try {
        await prisma.prescriptionRecord.update({
            where: { id: prescriptionId },
            data: {
                medicationName: medicine,
                dosage,
                instructions,
            }
        });
        revalidatePath("/veterinary");
        return { success: true };
    } catch (e) {
        return { error: "Failed to update prescription" };
    }
}

export async function deletePrescription(id: string, petId: string) {
    try {
        await prisma.prescriptionRecord.delete({ where: { id } });
        revalidatePath(`/patient/${petId}`);
        revalidatePath("/veterinary");
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete prescription" };
    }
}
