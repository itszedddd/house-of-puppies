import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    for (const u of users) {
        // Simple check if it's already a bcrypt hash
        if (!u.passwordHash.startsWith('$2a$')) {
            console.log('Hashing unhashed password for:', u.email);
            const h = await bcrypt.hash(u.passwordHash, 10);
            await prisma.user.update({
                where: { id: u.id },
                data: { passwordHash: h }
            });
        }
    }
    console.log('Done scanning users.');
}

main();
