import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
    const [clientCount, petCount, recordCount] = await Promise.all([
        prisma.petOwner.count(),
        prisma.pet.count(),
        prisma.clinicalRecord.count()
    ]);

    return {
        clientCount,
        petCount,
        recordCount
    }
}

export async function getRecentClients() {
    return prisma.petOwner.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { pets: true }
    });
}
