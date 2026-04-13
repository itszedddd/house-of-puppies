"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, Droplets, Scissors, RefreshCw, Undo2 } from "lucide-react";

import { Pet } from "@prisma/client";

type PetWithFlow = Pet & { status: string; owner?: any; records?: any[] };

export default function EmployeePage() {
    const [pets, setPets] = useState<PetWithFlow[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPets = async () => {
        const res = await fetch("/api/pets");
        const data = await res.json();
        // Mapped to include status from the latest record
        const mapped: (Pet & { status: PetStatus })[] = data.map((pet: any) => {
            const latestRecord = pet.records?.[0];
            let status: PetStatus = "Pending";
            if (latestRecord && latestRecord.status) {
                status = latestRecord.status as PetStatus;
            }
            return { ...pet, status };
        });
        setPets(mapped as any);
        setLoading(false);
    };

    useEffect(() => { fetchPets(); }, []);

    const updateStatus = async (id: string, newStatus: PetStatus) => {
        // Optimistic update
        setPets(pets.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));

        try {
            await fetch(`/api/records/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ petId: id, status: newStatus })
            });
        } catch (e) {
            console.error("Failed to update status", e);
        }
    };

    if (loading) return <div className="p-8 text-muted-foreground">Loading tasks...</div>;

    const getNextStatus = (current: string): PetStatus => {
        switch (current) {
            case "Pending": return "Shower";
            case "Shower": return "Trimming Nails";
            case "Trimming Nails": return "Washing";
            case "Washing": return "Grooming";
            case "Grooming": return "Ready";
            case "Ready": return "Completed";
            default: return "Pending";
        }
    };

    const getPreviousStatus = (current: PetStatus): PetStatus | null => {
        switch (current) {
            case "Shower": return "Pending";
            case "Trimming Nails": return "Shower";
            case "Washing": return "Trimming Nails";
            case "Grooming": return "Washing";
            case "Ready": return "Grooming";
            case "Completed": return "Ready";
            default: return null;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Employee Dashboard</h1>
            <p className="text-muted-foreground">Manage active grooming tasks.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pets
                    // @ts-ignore
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
                                        <span className="font-medium">
                                            {/* @ts-ignore */}
                                            {pet.records?.[0]?.purpose?.name || "Grooming"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b">
                                        <span className="text-muted-foreground">Owner:</span>
                                        <span>
                                            {/* @ts-ignore */}
                                            {pet.owner ? `${pet.owner.firstName} ${pet.owner.lastName}` : "Unknown"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b">
                                        <span className="text-muted-foreground">Status:</span>
                                        {/* @ts-ignore */}
                                        <span className="font-bold text-primary">{pet.status}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 flex gap-2">
                                    {/* @ts-ignore */}
                                    {pet.status !== 'Pending' && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            title="Undo Status"
                                            onClick={() => {
                                                // @ts-ignore
                                                const prev = getPreviousStatus(pet.status);
                                                if (prev) updateStatus(pet.id, prev);
                                            }}
                                        >
                                            <Undo2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {/* @ts-ignore */}
                                    {pet.status !== 'Ready' && (
                                        <Button
                                            className="flex-1"
                                            onClick={() => {
                                                // @ts-ignore
                                                const next = getNextStatus(pet.status);
                                                if (next) updateStatus(pet.id, next);
                                            }}
                                        >
                                            {/* @ts-ignore */}
                                            {pet.status === 'Pending' && <><Droplets className="mr-2 h-4 w-4" /> Start Shower</>}
                                            {/* @ts-ignore */}
                                            {pet.status === 'Shower' && <><Scissors className="mr-2 h-4 w-4" /> Trim Nails</>}
                                            {/* @ts-ignore */}
                                            {pet.status === 'Trimming Nails' && <><Droplets className="mr-2 h-4 w-4" /> Start Wash</>}
                                            {/* @ts-ignore */}
                                            {pet.status === 'Washing' && <><Scissors className="mr-2 h-4 w-4" /> Start Groom</>}
                                            {/* @ts-ignore */}
                                            {pet.status === 'Grooming' && <><Check className="mr-2 h-4 w-4" /> Mark Ready</>}
                                        </Button>
                                    )}
                                    {/* @ts-ignore */}
                                    {pet.status === 'Ready' && (
                                        <Button
                                            variant="secondary"
                                            className="flex-1"
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
