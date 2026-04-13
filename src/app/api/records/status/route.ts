import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PATCH(req: Request) {
    try {
        const { petId, status } = await req.json();

        // Get the latest clinical record for this pet
        let latestRecord = await prisma.clinicalRecord.findFirst({
            where: { petId },
            orderBy: { visitDate: "desc" }
        });

        let newRecord;

        if (!latestRecord) {
            // Find default staff (admin) and purpose (grooming)
            const adminStaff = await prisma.staff.findUnique({ where: { username: "admin" } });
            const groomingPurpose = await prisma.purposeOfVisit.findUnique({ where: { name: "grooming" } });

            if (!adminStaff || !groomingPurpose) {
                return NextResponse.json({ error: "System not initialized (Staff/Purpose missing)" }, { status: 500 });
            }

            // Automatically spin up a Clinical Record if none exists
            newRecord = await prisma.clinicalRecord.create({
                data: {
                    petId,
                    purposeId: groomingPurpose.id, 
                    status,
                    visitDate: new Date(),
                    createdById: adminStaff.id,
                }
            });
        } else {
            // Update the existing record status
            newRecord = await prisma.clinicalRecord.update({
                where: { id: latestRecord.id },
                data: { status }
            });
        }

        // Invalidate caching
        revalidatePath("/admin/pets");
        revalidatePath("/admin");
        revalidatePath("/employee");

        return NextResponse.json(newRecord);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
