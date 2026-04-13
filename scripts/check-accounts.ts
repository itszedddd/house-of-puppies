import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const staff = await prisma.staff.findMany({
    include: { role: true }
  });
  staff.forEach(s => {
    console.log(`Username: ${s.username}, Role: ${s.role.name}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
