-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN "expiryDate" DATETIME;
ALTER TABLE "Inventory" ADD COLUMN "status" TEXT DEFAULT 'Ok';
ALTER TABLE "Inventory" ADD COLUMN "unit" TEXT DEFAULT 'pcs';
