import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const u = await prisma.staff.findUnique({ where: { username: 'admin' } });
    console.log('Admin user found in DB:', u);
}

main().finally(() => prisma.$disconnect());
