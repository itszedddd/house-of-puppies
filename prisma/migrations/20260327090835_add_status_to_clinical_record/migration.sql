-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClinicalRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "visitDate" DATETIME NOT NULL,
    "purposeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "notes" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClinicalRecord_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClinicalRecord_purposeId_fkey" FOREIGN KEY ("purposeId") REFERENCES "PurposeOfVisit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClinicalRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Staff" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClinicalRecord" ("createdAt", "createdById", "diagnosis", "id", "notes", "petId", "purposeId", "treatment", "updatedAt", "visitDate") SELECT "createdAt", "createdById", "diagnosis", "id", "notes", "petId", "purposeId", "treatment", "updatedAt", "visitDate" FROM "ClinicalRecord";
DROP TABLE "ClinicalRecord";
ALTER TABLE "new_ClinicalRecord" RENAME TO "ClinicalRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
