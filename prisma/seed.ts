import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
    const existingUser = await prisma.user.findFirst({
        where: { email: "admin@example.com" },
    });

    if (existingUser) {
        console.log("Admin user already exists");
        return;
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    const user = await prisma.user.create({
        data: {
            name: "Admin User",
            email: "admin@example.com",
            passwordHash,
            role: "admin",
        },
    });

    console.log("Admin user created:", user.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
