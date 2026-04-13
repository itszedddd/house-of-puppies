import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
    try {
        const [clientCount, petCount, recordCount] = await Promise.all([
            prisma.petOwner.count(),
            prisma.pet.count(),
            prisma.clinicalRecord.count()
        ]);
        return { clientCount, petCount, recordCount };
    } catch (e) {
        console.error("[DB] getDashboardStats failed:", e);
        return { clientCount: 0, petCount: 0, recordCount: 0 };
    }
}

export async function getRecentClients(searchStr?: string, sortStr?: string) {
    const sort = sortStr === 'asc' ? 'asc' : 'desc';
    try {
        return prisma.petOwner.findMany({
            take: searchStr ? 50 : 5,
            where: searchStr ? {
                OR: [
                    { firstName: { contains: searchStr } },
                    { lastName: { contains: searchStr } },
                    { email: { contains: searchStr } },
                ]
            } : undefined,
            orderBy: { createdAt: sort },
            include: { pets: true }
        });
    } catch (e) {
        console.error("[DB] getRecentClients failed:", e);
        return [];
    }
}
