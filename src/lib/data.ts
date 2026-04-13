export { };

declare global {
    export type PetStatus = "Pending" | "Washing" | "Grooming" | "Ready" | "Completed" | "In Consultation" | "Admitted" | "Shower" | "Trimming Nails";

    export interface PetOwner {
        id: string;
        firstName: string;
        lastName: string;
        contactNumber: string | null;
        email: string | null;
        address: string | null;
    }

    export interface ClinicalRecord {
        id: string;
        petId: string;
        visitDate: Date;
        purposeId: string;
        purpose?: { name: string };
        notes: string | null;
        diagnosis: string | null;
        treatment: string | null;
        createdById: string;
        createdBy?: { fullName: string };
        prescriptions?: PrescriptionRecord[];
    }

    export interface PrescriptionRecord {
        id: string;
        recordId: string;
        prescriptionDate: Date;
        medicationName: string;
        dosage: string;
        duration: string | null;
        instructions: string | null;
        exportedPdfLink: string | null;
    }

    export interface Pet {
        id: string;
        ownerId: string;
        owner: PetOwner;
        name: string;
        species: string | null;
        breed: string | null;
        gender: string | null;
        dateOfBirth: string | null;
        records: ClinicalRecord[];
    }

    export interface InventoryItem {
        id: string;
        itemName: string;
        itemTypeId: string;
        itemType: { name: string };
        stock: number;
    }
}

// Simple mock data for initial UI state if needed
export const mockInventory: InventoryItem[] = [
    { id: "INV-1", itemName: "Rabies Vaccine", itemTypeId: "TYPE-1", itemType: { name: "medication" }, stock: 50 },
    { id: "INV-2", itemName: "Amoxicillin", itemTypeId: "TYPE-1", itemType: { name: "medication" }, stock: 100 },
    { id: "INV-3", itemName: "Flea Shampoo", itemTypeId: "TYPE-2", itemType: { name: "grooming" }, stock: 12 },
];
