import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const pets = await prisma.pet.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                owner: true,
                records: {
                    orderBy: { visitDate: "desc" },
                    take: 1,
                    include: { purpose: true }
                }
            }
        });
        return NextResponse.json(pets);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 });
    }
}
