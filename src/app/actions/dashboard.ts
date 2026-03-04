import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
    const [clientCount, petCount, recordCount] = await Promise.all([
        prisma.client.count(),
        prisma.pet.count(),
        prisma.record.count()
    ]);

    return {
        clientCount,
        petCount,
        recordCount
    }
}

export async function getRecentClients() {
    return prisma.client.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { pets: true }
    });
}
