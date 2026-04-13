"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function scheduleReminder(formData: FormData) {
    const recordId = formData.get("recordId") as string;
    const reminderTypeId = formData.get("reminderTypeId") as string;
    const reminderDateStr = formData.get("reminderDate") as string;
    const message = formData.get("message") as string;

    if (!recordId || !reminderTypeId || !reminderDateStr || !message) {
        return { error: "All fields are required" };
    }

    try {
        const pendingStatus = await prisma.smsStatus.upsert({
            where: { name: 'pending' },
            update: {},
            create: { name: 'pending' }
        });

        await prisma.smsReminder.create({
            data: {
                recordId,
                reminderTypeId,
                reminderDate: new Date(reminderDateStr),
                smsStatusId: pendingStatus.id,
                message
            }
        });

        revalidatePath("/employee/reminders");
        return { success: true };
    } catch (error) {
        console.error("Failed to schedule reminder:", error);
        return { error: "Failed to schedule reminder" };
    }
}
