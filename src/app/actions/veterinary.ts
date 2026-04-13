"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createConsultation(data: FormData) {
    const petId = data.get("petId") as string;
    const notes = data.get("notes") as string;

    if (!petId) return { error: "Pet is required" };

    try {
        let purpose = await prisma.purposeOfVisit.findFirst({ where: { name: "consultation" } });
        if (!purpose) {
            purpose = await prisma.purposeOfVisit.create({ data: { name: "consultation" } });
        }
        
        const staff = await prisma.staff.findFirst();

        await prisma.clinicalRecord.create({
            data: {
                petId,
                purposeId: purpose.id,
                createdById: staff?.id || "",
                visitDate: new Date(),
                status: "In Consultation",
                notes
            }
        });
        revalidatePath("/veterinary");
        return { success: true };
    } catch (e) {
        return { error: "Failed to create consultation" };
    }
}

export async function createVaccination(petId: string, data: FormData) {
    const name = data.get("name") as string;
    const dateGivenStr = data.get("dateGiven") as string;
    const nextDueDateStr = data.get("nextDueDate") as string;
    const notes = data.get("notes") as string;

    if (!name || !dateGivenStr) return { error: "Vaccine name and date are required" };

    const dateGiven = new Date(dateGivenStr);

    try {
        let purpose = await prisma.purposeOfVisit.findFirst({ where: { name: "vaccination" } });
        if (!purpose) {
            purpose = await prisma.purposeOfVisit.create({ data: { name: "vaccination" } });
        }

        const staff = await prisma.staff.findFirst();

        await prisma.clinicalRecord.create({
            data: {
                petId,
                purposeId: purpose.id,
                createdById: staff?.id || "",
                visitDate: dateGiven,
                status: "Completed",
                notes: `Vaccine: ${name}. Notes: ${notes}`
            }
        });
        revalidatePath(`/patient/${petId}`);
        revalidatePath("/reminders");
        return { success: true };
    } catch (e) {
        return { error: "Failed to record vaccination" };
    }
}
