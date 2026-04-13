import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.findMany();
  
  const accounts = [
    { username: "staff", roleName: "staff", fullName: "Clinic Staff" },
    { username: "admin", roleName: "vet_admin", fullName: "Veterinary Admin" },
    { username: "owner", roleName: "owner", fullName: "Clinic Owner" }
  ];

  for (const acc of accounts) {
    const role = roles.find(r => r.name === acc.roleName);
    if (role) {
      const passwordHash = await bcrypt.hash("password123", 10);
      await prisma.staff.upsert({
        where: { username: acc.username },
        update: {
          passwordHash,
          roleId: role.id,
        },
        create: {
          username: acc.username,
          fullName: acc.fullName,
          passwordHash,
          roleId: role.id,
        },
      });
      console.log(`Updated/Created Account: ${acc.username} (Role: ${acc.roleName})`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
