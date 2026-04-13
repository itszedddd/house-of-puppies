import { prisma } from "@/lib/prisma";
import StaffIntakeForm from "./staff-intake-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Clock, Users, PawPrint } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function EmployeePage() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "staff") {
        redirect("/login");
    }

    let pets: any[] = [];
    let clients: { id: string; name: string }[] = [];
    let allClientsCount = 0;
    try {
        pets = await prisma.pet.findMany({
            include: {
                owner: true,
                records: {
                    orderBy: { visitDate: "desc" },
                    take: 1
                }
            },
            orderBy: { createdAt: "desc" },
        });

        const allClients = await prisma.petOwner.findMany({
            orderBy: { firstName: 'asc' }
        });
        allClientsCount = allClients.length;
        clients = allClients.map((o: any) => ({
            id: o.id,
            name: `${o.firstName} ${o.lastName}`
        }));
    } catch (e) {
        console.error("[DB] Employee dashboard failed:", e);
    }

    // Filter pets that have been forwarded to Vet (Pending-Vet)
    const pendingVetPets = pets.map(pet => {
        const latestRecord = pet.records[0];
        let status = "Discharged";
        if (latestRecord) {
            status = latestRecord.status;
        }
        
        return {
            ...pet,
            status: status || "Unknown",
            ownerName: pet.owner ? `${pet.owner.firstName} ${pet.owner.lastName}` : "Unknown"
        };
    }).filter(p => p.status === "Pending-Vet" || p.status === "Pending");

    return (
        <div className="grid gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between border-b pb-4 gap-4">
                <div className="grid gap-1 w-full text-center md:text-left">
                    <h1 className="text-2xl font-black tracking-tighter md:text-3xl">Staff Intake Dashboard</h1>
                    <p className="text-muted-foreground text-sm">Register arrivals, manage clients & pets, and record initial clinical vitals.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <StaffIntakeForm pets={pets} clients={clients} />
                </div>
            </div>

            {/* Quick Actions & Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-primary/5 hover:bg-primary/10 transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                            Forwarded to Vet
                            <Clock className="h-5 w-5 text-primary" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-primary">{pendingVetPets.length}</div>
                        <p className="text-xs text-muted-foreground mb-4">Patients in waiting room</p>
                    </CardContent>
                </Card>

                <Card className="hover:bg-muted/50 transition-colors flex flex-col justify-between">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                            Clients Directory
                            <Users className="h-5 w-5 text-muted-foreground" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{allClientsCount}</div>
                        <p className="text-xs text-muted-foreground mb-4">Registered pet owners</p>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/employee/clients">Search Clients</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:bg-muted/50 transition-colors flex flex-col justify-between">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                            Pet Registry
                            <PawPrint className="h-5 w-5 text-muted-foreground" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{pets.length}</div>
                        <p className="text-xs text-muted-foreground mb-4">Registered in system</p>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/employee/pets">Search Pets</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Intake Queue */}
            <Card>
                <CardHeader>
                    <CardTitle>Intake Queue</CardTitle>
                    <CardDescription>Patients you have forwarded to the Veterinarian.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {pendingVetPets.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">No patients are currently waiting.</p>
                        ) : (
                            pendingVetPets.map((pet) => (
                                <div
                                    key={pet.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Stethoscope className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium leading-none">
                                                {pet.name} <span className="text-muted-foreground">({pet.breed || 'Unknown'})</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Owner: {pet.ownerName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="whitespace-nowrap">
                                            {pet.status}
                                        </Badge>
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
