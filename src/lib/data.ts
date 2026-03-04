export type PetStatus = "Pending" | "Washing" | "Grooming" | "Ready" | "Completed" | "In Consultation" | "Admitted";

export interface MedicalRecord {
    id: string;
    date: string;
    diagnosis: string;
    treatment: string;
    veterinarian: string;
}

export interface Vaccination {
    id: string;
    name: string;
    dateGiven: string;
    nextDueDate: string;
}

export interface Prescription {
    id: string;
    medicine: string;
    dosage: string;
    instructions: string;
    dateIssued: string;
    status: "Active" | "Completed";
}

export interface Pet {
    id: string;
    name: string;
    breed: string;
    ownerName: string;
    contactNumber: string;
    service: "Grooming" | "Veterinary" | "Both";
    status: PetStatus;
    checkInTime: string;
    medicalHistory: MedicalRecord[];
    vaccinations: Vaccination[];
    prescriptions: Prescription[];
}

export interface InventoryItem {
    id: string;
    name: string;
    category: "Medicine" | "Supply" | "Food" | "Accessory";
    stock: number;
    unit: string;
    expiryDate?: string;
    status: "Good" | "Low" | "Expired";
}

export const mockInventory: InventoryItem[] = [
    { id: "INV-001", name: "Rabies Vaccine", category: "Medicine", stock: 50, unit: "vials", expiryDate: "2026-12-01", status: "Good" },
    { id: "INV-002", name: "Amoxicillin", category: "Medicine", stock: 100, unit: "tablets", expiryDate: "2027-05-20", status: "Good" },
    { id: "INV-003", name: "Flea Shampoo", category: "Supply", stock: 12, unit: "bottles", status: "Low" },
    { id: "INV-004", name: "Syringes (3ml)", category: "Supply", stock: 200, unit: "pcs", status: "Good" },
    { id: "INV-005", name: "Dog Food (Premium)", category: "Food", stock: 5, unit: "bags", status: "Low" },
];

export const mockPets: Pet[] = [
    {
        id: "TIC-1001",
        name: "Luiz",
        breed: "Golden Retriever",
        ownerName: "John Loyd",
        contactNumber: "09123456789",
        service: "Grooming",
        status: "Grooming",
        checkInTime: "09:00 AM",
        medicalHistory: [],
        vaccinations: [
            { id: "VAC-001", name: "5-in-1", dateGiven: "2025-01-10", nextDueDate: "2026-01-10" }
        ],
        prescriptions: []
    },
    {
        id: "TIC-1002",
        name: "Balong",
        breed: "Poodle",
        ownerName: "John Luiz",
        contactNumber: "09987654321",
        service: "Veterinary",
        status: "In Consultation",
        checkInTime: "10:15 AM",
        medicalHistory: [
            { id: "MED-001", date: "2025-10-15", diagnosis: "Skin Allergy", treatment: "Antihistamine injection", veterinarian: "Dr. Smith" }
        ],
        vaccinations: [],
        prescriptions: [
            { id: "PRE-001", medicine: "Apoquel", dosage: "5mg daily", instructions: "Give with food", dateIssued: "2025-10-15", status: "Active" }
        ]
    },
    {
        id: "TIC-1003",
        name: "Gucci",
        breed: "Tuxedo Cat",
        ownerName: "Kent Kenji",
        contactNumber: "09111111111",
        service: "Both",
        status: "Pending",
        checkInTime: "11:30 AM",
        medicalHistory: [],
        vaccinations: [],
        prescriptions: []
    },
    {
        id: "TIC-1004",
        name: "Mamba",
        breed: "French Bulldog",
        ownerName: "Kobe Bryant",
        contactNumber: "09242424242",
        service: "Grooming",
        status: "Washing",
        checkInTime: "11:45 AM",
        medicalHistory: [],
        vaccinations: [
            { id: "VAC-002", name: "Rabies", dateGiven: "2025-05-20", nextDueDate: "2026-05-20" }
        ],
        prescriptions: []
    },
    {
        id: "TIC-1005",
        name: "Hachi",
        breed: "Shiba Inu", // Fixed from Dinosaur for realism
        ownerName: "Zed",
        contactNumber: "09000000000",
        service: "Veterinary",
        status: "Completed",
        checkInTime: "08:30 AM",
        medicalHistory: [
            { id: "MED-002", date: "2026-02-17", diagnosis: "Routine Checkup", treatment: "Vitamins prescribed", veterinarian: "Dr. Doe" }
        ],
        vaccinations: [],
        prescriptions: [
            { id: "PRE-002", medicine: "Multivitamins", dosage: "1 tab daily", instructions: "Morning", dateIssued: "2026-02-17", status: "Active" }
        ]
    },
];
