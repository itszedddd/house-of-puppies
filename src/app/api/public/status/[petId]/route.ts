import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ petId: string }> }
) {
    try {
        const { petId } = await params;

        if (!petId) {
            return NextResponse.json({ error: "Pet ID is required" }, { status: 400 });
        }

        const pet = await prisma.pet.findFirst({
            where: {
                OR: [
                    { id: petId },
                    { id: { startsWith: petId } } // In case they provide partial ID
                ]
            },
            include: {
                owner: {
                    select: {
                        firstName: true, lastName: true
                    }
                },
                records: {
                    orderBy: { visitDate: "desc" },
                    include: { purpose: true },
                    take: 1
                }
            }
        });

        if (!pet) {
            return NextResponse.json({ error: "No pet found with that ID" }, { status: 404 });
        }

        const latestRecord = pet.records[0];

        return NextResponse.json({
            id: pet.id,
            name: pet.name,
            breed: pet.breed,
            clientName: pet.owner.firstName + " " + pet.owner.lastName, // Usually enough to mask full identity while reassuring the user it's their pet
            currentStatus: latestRecord ? latestRecord.status : "No Active Service",
            latestService: latestRecord ? (latestRecord as any).purpose?.name : null,
            lastUpdate: latestRecord ? latestRecord.updatedAt : pet.updatedAt
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch pet status" }, { status: 500 });
    }
}
