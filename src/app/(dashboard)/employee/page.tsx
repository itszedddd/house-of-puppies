"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockPets, Pet, PetStatus } from "@/lib/data";
import { Check, Clock, Droplets, Scissors } from "lucide-react";

export default function EmployeePage() {
    const [pets, setPets] = useState<Pet[]>(mockPets);

    const updateStatus = (id: string, newStatus: PetStatus) => {
        setPets(pets.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    };

    const getNextStatus = (current: PetStatus): PetStatus | null => {
        switch (current) {
            case "Pending":
                return "Washing";
            case "Washing":
                return "Grooming";
            case "Grooming":
                return "Ready";
            case "Ready":
                return "Completed";
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Employee Dashboard</h1>
            <p className="text-muted-foreground">Manage active grooming tasks.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pets
                    .filter((p) => p.status !== "Completed")
                    .map((pet) => (
                        <Card key={pet.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{pet.name}</CardTitle>
                                        <CardDescription>{pet.breed}</CardDescription>
                                    </div>
                                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{pet.id}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col gap-4">
                                <div className="text-sm">
                                    <div className="flex justify-between py-1 border-b">
                                        <span className="text-muted-foreground">Service:</span>
                                        <span className="font-medium">{pet.service}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b">
                                        <span className="text-muted-foreground">Owner:</span>
                                        <span>{pet.ownerName}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b">
                                        <span className="text-muted-foreground">Status:</span>
                                        <span className="font-bold text-primary">{pet.status}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 flex gap-2">
                                    {pet.status !== 'Ready' && (
                                        <Button
                                            className="w-full"
                                            onClick={() => {
                                                const next = getNextStatus(pet.status);
                                                if (next) updateStatus(pet.id, next);
                                            }}
                                        >
                                            {pet.status === 'Pending' && <><Droplets className="mr-2 h-4 w-4" /> Start Wash</>}
                                            {pet.status === 'Washing' && <><Scissors className="mr-2 h-4 w-4" /> Start Groom</>}
                                            {pet.status === 'Grooming' && <><Check className="mr-2 h-4 w-4" /> Mark Ready</>}
                                        </Button>
                                    )}
                                    {pet.status === 'Ready' && (
                                        <Button
                                            variant="secondary"
                                            className="w-full"
                                            onClick={() => updateStatus(pet.id, "Completed")}
                                        >
                                            <Check className="mr-2 h-4 w-4" /> Complete Pickup
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
            </div>

            {pets.filter(p => p.status !== 'Completed').length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No active pets in the queue. Good job!
                </div>
            )}
        </div>
    );
}
