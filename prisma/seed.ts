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

  console.log("✅ Old data cleared.");
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
  const staffRole = await prisma.role.findUnique({ where: { name: "staff" } });
  const ownerRole = await prisma.role.findUnique({ where: { name: "owner" } });

  let vetStaff: any = null;
  let staffUser: any = null;

  if (vetAdminRole) {
    vetStaff = await prisma.staff.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        fullName: "Dr. Santos (Vet Admin)",
        username: "admin",
        passwordHash,
        roleId: vetAdminRole.id,
      },
    });
    console.log("✅ Vet Admin 'admin' ready.");
  }

  if (staffRole) {
    staffUser = await prisma.staff.upsert({
      where: { username: "staff" },
      update: {},
      create: {
        fullName: "Maria Cruz (Staff)",
        username: "staff",
        passwordHash,
        roleId: staffRole.id,
      },
    });
    console.log("✅ Staff 'staff' ready.");
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

  // ===================== MOCK CLINICAL RECORDS (Pending-Vet) =====================
  console.log("Seeding mock clinical records...");

  const checkUp = await prisma.purposeOfVisit.findUnique({ where: { name: "check_up" } });
  const grooming = await prisma.purposeOfVisit.findUnique({ where: { name: "grooming" } });
  const vaccination = await prisma.purposeOfVisit.findUnique({ where: { name: "vaccination" } });
  const labTest = await prisma.purposeOfVisit.findUnique({ where: { name: "lab_test" } });

  const creatorId = staffUser?.id || vetStaff?.id || "";

  // 4 pets with Pending-Vet status (ready for vet to examine)
  await prisma.clinicalRecord.create({
    data: {
      petId: pet1.id,
      purposeId: checkUp!.id,
      createdById: creatorId,
      status: "Pending-Vet",
      visitDate: new Date(),
      weight: "12.5",
      temperature: "38.5",
      heartRate: "80",
      respRate: "20",
      chiefComplaint: "Not eating for 2 days, lethargic",
      medicalHistory: "Previous deworming last month",
      vaxRabies: true,
      vax5in1: true,
    },
  });

  await prisma.clinicalRecord.create({
    data: {
      petId: pet3.id,
      purposeId: grooming!.id,
      createdById: creatorId,
      status: "Pending-Vet",
      visitDate: new Date(),
      weight: "5.2",
      temperature: "38.8",
      chiefComplaint: "Full grooming service requested, matted fur",
      consentedToSedation: true,
    },
  });

  await prisma.clinicalRecord.create({
    data: {
      petId: pet7.id,
      purposeId: vaccination!.id,
      createdById: creatorId,
      status: "Pending-Vet",
      visitDate: new Date(),
      weight: "28.0",
      temperature: "38.2",
      heartRate: "90",
      chiefComplaint: "Due for annual vaccination booster",
      vaxRabies: true,
      vax5in1: false,
    },
  });

  await prisma.clinicalRecord.create({
    data: {
      petId: pet6.id,
      purposeId: labTest!.id,
      createdById: creatorId,
      status: "Pending-Vet",
      visitDate: new Date(),
      weight: "4.1",
      temperature: "39.1",
      heartRate: "120",
      respRate: "30",
      chiefComplaint: "Vomiting and diarrhea for 3 days",
      medicalHistory: "History of sensitive stomach",
      vaxRabies: true,
      vaxLepto: true,
    },
  });

  // Adding 15 Historical completed records for Analytics graph tracing back a month or so
  const historicalDataTemplate = [
    { pet: pet5, purpose: checkUp!.id, daysAgo: 1, price: 500, treatment: "Routine checkup." },
    { pet: pet9, purpose: vaccination!.id, daysAgo: 2, price: 1200, treatment: "Administered 5-in-1 and Rabies." },
    { pet: pet2, purpose: grooming!.id, daysAgo: 4, price: 800, treatment: "Show cut and de-shedding." },
    { pet: pet4, purpose: checkUp!.id, daysAgo: 5, price: 650, treatment: "Treated mild ear infection." },
    { pet: pet8, purpose: labTest!.id, daysAgo: 7, price: 2500, treatment: "Bloodwork panel completed." },
    { pet: pet1, purpose: vaccination!.id, daysAgo: 8, price: 750, treatment: "Deworming and anti-rabies." },
    { pet: pet6, purpose: grooming!.id, daysAgo: 10, price: 900, treatment: "Full groom + nail trim." },
    { pet: pet10, purpose: checkUp!.id, daysAgo: 12, price: 400, treatment: "Follow up. Patient doing well." },
    { pet: pet3, purpose: vaccination!.id, daysAgo: 14, price: 800, treatment: "Annual booster." },
    { pet: pet7, purpose: checkUp!.id, daysAgo: 15, price: 600, treatment: "Consult for skin rash." },
    { pet: pet5, purpose: grooming!.id, daysAgo: 18, price: 750, treatment: "Bath and blow dry." },
    { pet: pet9, purpose: labTest!.id, daysAgo: 20, price: 1800, treatment: "Fecal and urine analysis." },
    { pet: pet2, purpose: checkUp!.id, daysAgo: 22, price: 500, treatment: "General wellness check." },
    { pet: pet8, purpose: vaccination!.id, daysAgo: 25, price: 900, treatment: "Core vaccines updated." },
    { pet: pet4, purpose: grooming!.id, daysAgo: 28, price: 850, treatment: "Lion cut applied." },
  ];

  for (const hist of historicalDataTemplate) {
    await prisma.clinicalRecord.create({
      data: {
        petId: hist.pet.id,
        purposeId: hist.purpose,
        createdById: creatorId,
        status: "Completed",
        visitDate: new Date(Date.now() - hist.daysAgo * 24 * 60 * 60 * 1000),
        weight: "10.0",
        temperature: "38.5",
        diagnosis: "Historical Record",
        treatment: hist.treatment,
        price: hist.price,
      },
    });
  }

  console.log("✅ Mock clinical records created (4 Pending-Vet, 15 Completed).");

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
