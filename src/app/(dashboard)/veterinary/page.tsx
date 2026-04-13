import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { Stethoscope, Clock, CheckCircle } from "lucide-react";
import NewConsultationForm from "./new-consultation-form";

export const dynamic = "force-dynamic";

export default async function VeterinaryPage() {
    const pets = await prisma.pet.findMany({
        include: {
            owner: true,
            records: {
                orderBy: { visitDate: "desc" },
                include: { purpose: true }
            }
        }
    });

    // Determine current logical status for each pet based on records
    const vetPets = pets.map(pet => {
        // Find the latest "Consultation" or related medical record
        // In the new schema, we check purpose.name
        const latestRecord = pet.records.find(r => 
            r.purpose.name === "check_up" || 
            r.purpose.name === "surgery" || 
            r.purpose.name === "lab_test"
        );
        
        let status = "Discharged";
        if (latestRecord) {
            status = latestRecord.status; // "Pending", "In Consultation", "Completed"
        }
        
        return {
            ...pet,
            status: status || "Pending",
            ownerName: pet.owner ? `${pet.owner.firstName} ${pet.owner.lastName}` : "Unknown"
        };
    }).filter(p => p.records.length > 0 && p.status !== "Completed" && p.status !== "Discharged");

    const allPets = pets;

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Veterinary Dashboard</h1>
                <NewConsultationForm pets={allPets} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Waiting Room</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vetPets.filter(p => p.status === "Pending").length}</div>
                        <p className="text-xs text-muted-foreground">Patients waiting</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Consultation</CardTitle>
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vetPets.filter(p => p.status === "In Consultation").length}</div>
                        <p className="text-xs text-muted-foreground">Currently with Vet</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {allPets.filter(p => p.records.some(r => r.serviceType === "Consultation" && r.status === "Completed")).length}
                        </div>
                        <p className="text-xs text-muted-foreground">Discharged</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Medical Queue</CardTitle>
                    <CardDescription>Patients waiting for check-ups and treatments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {vetPets.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">No patients in the queue.</p>
                        ) : (
                            vetPets.map((pet) => (
                                <div
                                    key={pet.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Stethoscope className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium leading-none">
                                                {pet.name} <span className="text-muted-foreground">({pet.breed})</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Owner: {pet.ownerName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={pet.status === "In Consultation" ? "default" : "outline"}>
                                            {pet.status}
                                        </Badge>
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/patient/${pet.id}`}>View Profile</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
