import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding lookup tables...");

  // Roles
  const roles = ["staff", "vet_admin", "owner"];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Purpose of Visit
  const purposes = ["grooming", "check_up", "surgery", "lab_test"];
  for (const name of purposes) {
    await prisma.purposeOfVisit.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Reminder Types
  const reminderTypes = ["follow_up", "vaccination_due", "lab_test_sched", "grooming"];
  for (const name of reminderTypes) {
    await prisma.reminderType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // SMS Status
  const smsStatuses = ["sent", "pending", "failed"];
  for (const name of smsStatuses) {
    await prisma.smsStatus.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Form Types
  const formTypes = ["waiver_lab_test", "sedation_grooming", "surgery_consent"];
  for (const name of formTypes) {
    await prisma.formType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Item Types
  const itemTypes = ["medication", "grooming", "lab_supply"];
  for (const name of itemTypes) {
    await prisma.itemType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Lookup tables seeded.");

  // Default Admin Staff
  const vetAdminRole = await prisma.role.findUnique({ where: { name: "vet_admin" } });
  if (vetAdminRole) {
    const passwordHash = await bcrypt.hash("password123", 10);
    const existingStaff = await prisma.staff.findUnique({ where: { username: "admin" } });
    
    if (!existingStaff) {
      await prisma.staff.create({
        data: {
          fullName: "System Administrator",
          username: "admin",
          passwordHash,
          roleId: vetAdminRole.id,
        },
      });
      console.log("Default vet_admin 'admin' created.");
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
