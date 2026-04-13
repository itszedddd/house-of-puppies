import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.staff.findUnique({ where: { username: 'admin' } });
    if (!user) {
        console.log("No admin user found.");
        return;
    }
    const isValid = await bcrypt.compare("password123", user.passwordHash);
    console.log("Hash in DB:", user.passwordHash);
    console.log("Is 'password123' valid?", isValid);
}

main().finally(() => prisma.$disconnect());
