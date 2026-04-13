import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const items = await prisma.inventory.findMany({
            where: {
                itemType: { name: "medication" }
            },
            include: { itemType: true },
            orderBy: { itemName: "asc" },
        });
        return NextResponse.json(items);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
    }
}
