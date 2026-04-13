import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🧹 Wiping existing data...");

  // Delete in order of dependencies
  await prisma.smsReminder.deleteMany();
  await prisma.prescriptionRecord.deleteMany();
  await prisma.clinicalRecord.deleteMany();
  await prisma.form.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.petOwner.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.staff.deleteMany();

  console.log("✅ Old data cleared.");
  console.log("Seeding lookup tables...");

  // Roles — NEW granular roles
  const roles = ["owner", "vet_admin", "staff_records", "staff_sms", "staff_inventory"];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  // Clean up old generic "staff" role if it exists
  try {
    await prisma.role.delete({ where: { name: "staff" } });
  } catch (e) { /* doesn't exist, ignore */ }

  // Purpose of Visit
  const purposes = ["grooming", "check_up", "surgery", "lab_test", "vaccination"];
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

  console.log("✅ Lookup tables seeded.");

  // ===================== STAFF ACCOUNTS =====================
  const passwordHash = await bcrypt.hash("password123", 10);

  const vetAdminRole = await prisma.role.findUnique({ where: { name: "vet_admin" } });
  const staffRecordsRole = await prisma.role.findUnique({ where: { name: "staff_records" } });
  const staffSmsRole = await prisma.role.findUnique({ where: { name: "staff_sms" } });
  const staffInventoryRole = await prisma.role.findUnique({ where: { name: "staff_inventory" } });
  const ownerRole = await prisma.role.findUnique({ where: { name: "owner" } });

  let vetStaff: any = null;
  let staffRecordsUser: any = null;

  if (vetAdminRole) {
    vetStaff = await prisma.staff.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        fullName: "Dr. Santos (Veterinarian/Admin)",
        username: "admin",
        passwordHash,
        roleId: vetAdminRole.id,
      },
    });
    console.log("✅ Vet Admin 'admin' ready.");
  }

  if (staffRecordsRole) {
    staffRecordsUser = await prisma.staff.upsert({
      where: { username: "staff_records" },
      update: {},
      create: {
        fullName: "Maria Cruz (Records Staff)",
        username: "staff_records",
        passwordHash,
        roleId: staffRecordsRole.id,
      },
    });
    console.log("✅ Staff Records 'staff_records' ready.");
  }

  if (staffSmsRole) {
    await prisma.staff.upsert({
      where: { username: "staff_sms" },
      update: {},
      create: {
        fullName: "Ana Reyes (SMS Scheduler)",
        username: "staff_sms",
        passwordHash,
        roleId: staffSmsRole.id,
      },
    });
    console.log("✅ Staff SMS 'staff_sms' ready.");
  }

  if (staffInventoryRole) {
    await prisma.staff.upsert({
      where: { username: "staff_inventory" },
      update: {},
      create: {
        fullName: "Carlos Mendoza (Inventory Staff)",
        username: "staff_inventory",
        passwordHash,
        roleId: staffInventoryRole.id,
      },
    });
    console.log("✅ Staff Inventory 'staff_inventory' ready.");
  }

  if (ownerRole) {
    await prisma.staff.upsert({
      where: { username: "owner" },
      update: {},
      create: {
        fullName: "House of Puppies Owner",
        username: "owner",
        passwordHash,
        roleId: ownerRole.id,
      },
    });
    console.log("✅ Owner 'owner' ready.");
  }

  // ===================== MOCK CLIENTS =====================
  console.log("Seeding mock clients...");

  const client1 = await prisma.petOwner.create({
    data: {
      firstName: "Juan",
      lastName: "Dela Cruz",
      contactNumber: "09171234567",
      email: "juan@email.com",
      address: "Brgy. San Isidro, Lucena City",
    },
  });

  const client2 = await prisma.petOwner.create({
    data: {
      firstName: "Maria",
      lastName: "Santos",
      contactNumber: "09281234567",
      email: "maria.santos@email.com",
      address: "Brgy. Gulang-Gulang, Lucena City",
    },
  });

  const client3 = await prisma.petOwner.create({
    data: {
      firstName: "Pedro",
      lastName: "Garcia",
      contactNumber: "09391234567",
      email: "pedro.garcia@email.com",
      address: "Brgy. Ibabang Dupay, Lucena City",
    },
  });

  const client4 = await prisma.petOwner.create({
    data: {
      firstName: "Ana",
      lastName: "Reyes",
      contactNumber: "09451234567",
      email: "ana.reyes@email.com",
      address: "Brgy. Cotta, Lucena City",
    },
  });

  const client5 = await prisma.petOwner.create({
    data: {
      firstName: "Carlos",
      lastName: "Mendoza",
      contactNumber: "09561234567",
      email: "carlos.mendoza@email.com",
      address: "Brgy. Dalahican, Lucena City",
    },
  });

  console.log("✅ 5 mock clients created.");

  // ===================== MOCK PETS =====================
  console.log("Seeding mock pets...");

  const pet1 = await prisma.pet.create({ data: { name: "Bantay", species: "Dog", breed: "Aspin", ownerId: client1.id } });
  const pet2 = await prisma.pet.create({ data: { name: "Mingming", species: "Cat", breed: "Puspin", ownerId: client1.id } });
  const pet3 = await prisma.pet.create({ data: { name: "Choco", species: "Dog", breed: "Shih Tzu", ownerId: client2.id } });
  const pet4 = await prisma.pet.create({ data: { name: "Whitey", species: "Dog", breed: "Pomeranian", ownerId: client2.id } });
  const pet5 = await prisma.pet.create({ data: { name: "Brownie", species: "Dog", breed: "Dachshund", ownerId: client3.id } });
  const pet6 = await prisma.pet.create({ data: { name: "Kitkat", species: "Cat", breed: "Persian", ownerId: client3.id } });
  const pet7 = await prisma.pet.create({ data: { name: "Lucky", species: "Dog", breed: "Labrador", ownerId: client4.id } });
  const pet8 = await prisma.pet.create({ data: { name: "Mochi", species: "Cat", breed: "Siamese", ownerId: client4.id } });
  const pet9 = await prisma.pet.create({ data: { name: "Max", species: "Dog", breed: "Golden Retriever", ownerId: client5.id } });
  const pet10 = await prisma.pet.create({ data: { name: "Paws", species: "Cat", breed: "Maine Coon", ownerId: client5.id } });

  console.log("✅ 10 mock pets created.");

  // ===================== MOCK CLINICAL RECORDS =====================
  console.log("Seeding mock clinical records...");

  const checkUp = await prisma.purposeOfVisit.findUnique({ where: { name: "check_up" } });
  const grooming = await prisma.purposeOfVisit.findUnique({ where: { name: "grooming" } });
  const vaccination = await prisma.purposeOfVisit.findUnique({ where: { name: "vaccination" } });
  const labTest = await prisma.purposeOfVisit.findUnique({ where: { name: "lab_test" } });
  const surgery = await prisma.purposeOfVisit.findUnique({ where: { name: "surgery" } });

  const creatorId = staffRecordsUser?.id || vetStaff?.id || "";

  // 4 pets with Pending-Vet status (ready for vet to examine)
  await prisma.clinicalRecord.create({
    data: {
      petId: pet1.id, purposeId: checkUp!.id, createdById: creatorId,
      status: "Pending-Vet", visitDate: new Date(),
      weight: "12.5", temperature: "38.5", heartRate: "80", respRate: "20",
      chiefComplaint: "Not eating for 2 days, lethargic",
      medicalHistory: "Previous deworming last month",
      vaxRabies: true, vax5in1: true,
    },
  });

  await prisma.clinicalRecord.create({
    data: {
      petId: pet3.id, purposeId: grooming!.id, createdById: creatorId,
      status: "Pending-Vet", visitDate: new Date(),
      weight: "5.2", temperature: "38.8",
      chiefComplaint: "Full grooming service requested, matted fur",
      consentedToSedation: true,
    },
  });

  await prisma.clinicalRecord.create({
    data: {
      petId: pet7.id, purposeId: vaccination!.id, createdById: creatorId,
      status: "Pending-Vet", visitDate: new Date(),
      weight: "28.0", temperature: "38.2", heartRate: "90",
      chiefComplaint: "Due for annual vaccination booster",
      vaxRabies: true, vax5in1: false,
    },
  });

  await prisma.clinicalRecord.create({
    data: {
      petId: pet6.id, purposeId: labTest!.id, createdById: creatorId,
      status: "Pending-Vet", visitDate: new Date(),
      weight: "4.1", temperature: "39.1", heartRate: "120", respRate: "30",
      chiefComplaint: "Vomiting and diarrhea for 3 days",
      medicalHistory: "History of sensitive stomach",
      vaxRabies: true, vaxLepto: true,
    },
  });

  // ===================== HISTORICAL RECORDS (12+ months for yearly analytics) =====================
  const allPets = [pet1, pet2, pet3, pet4, pet5, pet6, pet7, pet8, pet9, pet10];
  const allPurposes = [checkUp!, grooming!, vaccination!, labTest!, surgery!];
  const treatments = [
    "Routine checkup completed.", "Full grooming service.", "Administered core vaccines.",
    "Bloodwork panel analyzed.", "Minor surgical procedure.", "Deworming treatment.",
    "Ear infection treated.", "Dental cleaning.", "Skin allergy treatment.", "Follow-up - stable."
  ];

  // Generate ~60 completed records spread over 14 months
  for (let monthsAgo = 0; monthsAgo < 14; monthsAgo++) {
    const recordsThisMonth = 3 + Math.floor(Math.random() * 4); // 3–6 records per month
    for (let j = 0; j < recordsThisMonth; j++) {
      const pet = allPets[Math.floor(Math.random() * allPets.length)];
      const purpose = allPurposes[Math.floor(Math.random() * allPurposes.length)];
      const treatment = treatments[Math.floor(Math.random() * treatments.length)];
      const price = 300 + Math.floor(Math.random() * 2500);
      const dayOffset = Math.floor(Math.random() * 28);
      const visitDate = new Date();
      visitDate.setMonth(visitDate.getMonth() - monthsAgo);
      visitDate.setDate(Math.max(1, dayOffset));

      await prisma.clinicalRecord.create({
        data: {
          petId: pet.id,
          purposeId: purpose.id,
          createdById: creatorId,
          status: "Completed",
          visitDate,
          weight: (3 + Math.random() * 30).toFixed(1),
          temperature: (37.5 + Math.random() * 2).toFixed(1),
          diagnosis: `${purpose.name} — ${treatment}`,
          treatment,
          price,
        },
      });
    }
  }

  console.log("✅ Mock clinical records created (4 Pending-Vet + ~60 historical).");

  // ===================== MOCK INVENTORY =====================
  console.log("Seeding mock inventory...");

  const medType = await prisma.itemType.findUnique({ where: { name: "medication" } });
  const groomType = await prisma.itemType.findUnique({ where: { name: "grooming" } });
  const labSupply = await prisma.itemType.findUnique({ where: { name: "lab_supply" } });

  await prisma.inventory.createMany({
    data: [
      { itemName: "Amoxicillin 500mg", itemTypeId: medType!.id, stock: 120, unit: "capsules", status: "Ok", expiryDate: new Date("2027-06-15") },
      { itemName: "Metronidazole 250mg", itemTypeId: medType!.id, stock: 80, unit: "tablets", status: "Ok", expiryDate: new Date("2027-03-20") },
      { itemName: "Dexamethasone Injection", itemTypeId: medType!.id, stock: 15, unit: "vials", status: "Ok", expiryDate: new Date("2026-12-01") },
      { itemName: "Anti-Rabies Vaccine", itemTypeId: medType!.id, stock: 25, unit: "doses", status: "Ok", expiryDate: new Date("2027-01-30") },
      { itemName: "5-in-1 Vaccine (DHPP)", itemTypeId: medType!.id, stock: 18, unit: "doses", status: "Ok", expiryDate: new Date("2027-02-15") },
      { itemName: "Ivermectin (Dewormer)", itemTypeId: medType!.id, stock: 50, unit: "ml", status: "Ok", expiryDate: new Date("2027-08-01") },
      { itemName: "Cephalexin 500mg", itemTypeId: medType!.id, stock: 5, unit: "capsules", status: "Low", expiryDate: new Date("2026-11-15") },
      { itemName: "Prednisone 20mg", itemTypeId: medType!.id, stock: 3, unit: "tablets", status: "Low", expiryDate: new Date("2027-04-10") },
      { itemName: "Medicated Shampoo", itemTypeId: groomType!.id, stock: 10, unit: "bottles", status: "Ok" },
      { itemName: "Flea & Tick Shampoo", itemTypeId: groomType!.id, stock: 8, unit: "bottles", status: "Ok" },
      { itemName: "Nail Clipper Set", itemTypeId: groomType!.id, stock: 4, unit: "sets", status: "Ok" },
      { itemName: "Ear Cleaning Solution", itemTypeId: groomType!.id, stock: 2, unit: "bottles", status: "Low" },
      { itemName: "Blood Test Kit (CBC)", itemTypeId: labSupply!.id, stock: 20, unit: "kits", status: "Ok" },
      { itemName: "Urinalysis Strips", itemTypeId: labSupply!.id, stock: 50, unit: "strips", status: "Ok" },
      { itemName: "Fecalysis Kit", itemTypeId: labSupply!.id, stock: 1, unit: "kits", status: "Low" },
    ],
  });

  console.log("✅ 15 mock inventory items created.");
  console.log("🎉 Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
