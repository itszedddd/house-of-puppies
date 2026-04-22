import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding mock SMS reminders...");
    
    // Get ReminderType and SmsStatus
    const followUpType = await prisma.reminderType.upsert({
        where: { name: "follow_up" },
        update: {},
        create: { name: "follow_up" }
    });
    
    const vaxType = await prisma.reminderType.upsert({
        where: { name: "vaccination_due" },
        update: {},
        create: { name: "vaccination_due" }
    });

    const pendingStatus = await prisma.smsStatus.upsert({
        where: { name: "pending" },
        update: {},
        create: { name: "pending" }
    });
    
    const sentStatus = await prisma.smsStatus.upsert({
        where: { name: "sent" },
        update: {},
        create: { name: "sent" }
    });

    const records = await prisma.clinicalRecord.findMany({ take: 3 });
    if (records.length === 0) {
       console.log("No clinical records found to attach reminders to. Please create a record first.");
       return;
    }

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);

    await prisma.smsReminder.create({
        data: {
            recordId: records[0].id,
            reminderTypeId: followUpType.id,
            smsStatusId: pendingStatus.id,
            reminderDate: futureDate,
            message: "Hi there! This is a reminder for your pet's follow up visit at House of Puppies next week."
        }
    });

    if (records.length > 1) {
        await prisma.smsReminder.create({
            data: {
                recordId: records[1].id,
                reminderTypeId: vaxType.id,
                smsStatusId: sentStatus.id,
                reminderDate: pastDate,
                message: "Hello! Your pet is due for vaccination at House of Puppies."
            }
        });
    }

    console.log("SMS Reminders seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
