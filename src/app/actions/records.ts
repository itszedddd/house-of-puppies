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
        let purpose = await prisma.purposeOfVisit.findFirst({ where: { name: serviceType } });
        if (!purpose) {
            purpose = await prisma.purposeOfVisit.create({ data: { name: serviceType } });
        }

        const staff = await prisma.staff.findFirst();

        await prisma.clinicalRecord.create({
            data: {
                petId,
                purposeId: purpose.id,
                createdById: staff?.id || "",
                status,
                notes,
                price,
                visitDate: dateInput ? new Date(dateInput) : new Date()
            }
        });

        revalidatePath("/admin/records");
        revalidatePath("/admin");
        revalidatePath("/client");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create record" };
    }
}

export async function submitStaffIntake(data: FormData) {
    const petId = data.get("petId") as string;
    const serviceType = data.get("serviceType") as string;
    const notes = (data.get("notes") as string) || null;

    // Vitals
    const weight = (data.get("weight") as string) || null;
    const temperature = (data.get("temperature") as string) || null;
    const heartRate = (data.get("heartRate") as string) || null;
    const respRate = (data.get("respRate") as string) || null;
    const crt = (data.get("crt") as string) || null;
    const stool = (data.get("stool") as string) || null;
    const urine = (data.get("urine") as string) || null;

    // Complaints & History
    const chiefComplaint = (data.get("chiefComplaint") as string) || null;
    const medicalHistory = (data.get("medicalHistory") as string) || null;

    // Vaccinations (Booleans from checkboxes)
    const vaxRabies = data.get("vaxRabies") === "on";
    const vax5in1 = data.get("vax5in1") === "on";
    const vaxLepto = data.get("vaxLepto") === "on";
    const vaxCorona = data.get("vaxCorona") === "on";
    const vaxKennelCough = data.get("vaxKennelCough") === "on";
    const vaxOthers = (data.get("vaxOthers") as string) || null;

    // Consent
    const consentedToSedation = data.get("consentedToSedation") === "on";

    if (!petId || !serviceType) {
        return { error: "Pet and Service Type are required" };
    }

    try {
        let purpose = await prisma.purposeOfVisit.findFirst({ where: { name: serviceType } });
        if (!purpose) {
            purpose = await prisma.purposeOfVisit.create({ data: { name: serviceType } });
        }

        const staff = await prisma.staff.findFirst();

        await prisma.clinicalRecord.create({
            data: {
                petId,
                purposeId: purpose.id,
                createdById: staff?.id || "",
                status: "Pending-Vet",
                notes,
                weight,
                temperature,
                heartRate,
                respRate,
                crt,
                stool,
                urine,
                chiefComplaint,
                medicalHistory,
                vaxRabies,
                vax5in1,
                vaxLepto,
                vaxCorona,
                vaxKennelCough,
                vaxOthers,
                consentedToSedation,
                visitDate: new Date()
            }
        });

        revalidatePath("/employee");
        revalidatePath("/veterinary");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create intake" };
    }
}

export async function completeVetRecord(id: string, data: FormData) {
    const diagnosis = data.get("diagnosis") as string;
    const treatment = data.get("treatment") as string;
    const priceString = data.get("price") as string;
    const price = priceString ? parseFloat(priceString) : 0;

    const prescriptionDataStr = data.get("prescriptions") as string;
    let prescriptions: any[] = [];
    try {
        if (prescriptionDataStr) {
            prescriptions = JSON.parse(prescriptionDataStr);
        }
    } catch(e) {}

    try {
        // Update the clinical record
        const updatedRecord = await prisma.clinicalRecord.update({
            where: { id },
            data: {
                diagnosis,
                treatment,
                price,
                status: "Completed",
            }
        });

        // Create prescriptions if any
        if (prescriptions.length > 0) {
            for (const rx of prescriptions) {
                if (!rx.medicationName) continue;
                await prisma.prescriptionRecord.create({
                    data: {
                        recordId: id,
                        createdById: updatedRecord.createdById,
                        medicationName: rx.medicationName,
                        dosage: rx.dosage || "",
                        instructions: rx.instructions || "",
                        prescriptionDate: new Date(),
                    }
                });
            }
        }

        revalidatePath("/veterinary");
        revalidatePath("/analytics");
        revalidatePath("/reports");
        return { success: true };
    } catch (e) {
        console.error("[completeVetRecord] Error:", e);
        return { error: "Failed to complete record" };
    }
}

export async function updateRecord(id: string, data: FormData) {
    const serviceType = data.get("serviceType") as string;
    const priceString = data.get("price") as string;
    const price = priceString ? parseFloat(priceString) : 0;
    const status = data.get("status") as string;
    const notes = (data.get("notes") as string) || null;
    const dateInput = data.get("date") as string;

    if (!serviceType) return { error: "Service Type is required" };

    try {
        let purpose = await prisma.purposeOfVisit.findFirst({ where: { name: serviceType } });
        if (!purpose) {
            purpose = await prisma.purposeOfVisit.create({ data: { name: serviceType } });
        }

        await prisma.clinicalRecord.update({
            where: { id },
            data: {
                purposeId: purpose.id,
                status,
                notes,
                visitDate: dateInput ? new Date(dateInput) : new Date()
            }
        });
        revalidatePath("/admin/records");
        revalidatePath("/admin");
        revalidatePath("/client");
        return { success: true };
    } catch (e) {
        return { error: "Failed to update record" };
    }
}

export async function deleteRecord(id: string) {
    try {
        await prisma.clinicalRecord.delete({ where: { id } });
        revalidatePath("/admin/records");
        revalidatePath("/admin");
        revalidatePath("/client");
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete record" };
    }
}
