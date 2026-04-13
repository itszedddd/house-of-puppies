import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const pet = await prisma.pet.findUnique({
            where: { id: params.id },
            include: {
                owner: true,
                records: {
                    orderBy: { visitDate: "desc" },
                    include: { purpose: true, prescriptions: true }
                }
            }
        });
        if (!pet) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(pet);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch pet" }, { status: 500 });
    }
}
