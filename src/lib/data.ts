export type PetStatus = "Pending" | "Washing" | "Grooming" | "Ready" | "Completed";

export interface Pet {
    id: string;
    name: string;
    breed: string;
    ownerName: string;
    service: string;
    status: PetStatus;
    checkInTime: string;
}

export const mockPets: Pet[] = [
    {
        id: "TIC-1001",
        name: "Rex",
        breed: "Golden Retriever",
        ownerName: "John Doe",
        service: "Full Grooming",
        status: "Grooming",
        checkInTime: "09:00 AM",
    },
    {
        id: "TIC-1002",
        name: "Bella",
        breed: "Poodle",
        ownerName: "Jane Smith",
        service: "Bath & Brush",
        status: "Ready",
        checkInTime: "10:15 AM",
    },
    {
        id: "TIC-1003",
        name: "Max",
        breed: "German Shepherd",
        ownerName: "Mike Johnson",
        service: "Nail Trim",
        status: "Pending",
        checkInTime: "11:30 AM",
    },
    {
        id: "TIC-1004",
        name: "Luna",
        breed: "French Bulldog",
        ownerName: "Sarah Connor",
        service: "Full Grooming",
        status: "Washing",
        checkInTime: "11:45 AM",
    },
    {
        id: "TIC-1005",
        name: "Charlie",
        breed: "Beagle",
        ownerName: "Tom Hanks",
        service: "Bath & Brush",
        status: "Completed",
        checkInTime: "08:30 AM",
    },
];
