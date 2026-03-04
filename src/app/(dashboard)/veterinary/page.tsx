import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPets } from "@/lib/data";
import { Stethoscope, Clock, CheckCircle } from "lucide-react";

export default function VeterinaryPage() {
    // Filter pets that need Veterinary services or are In Consultation
    const vetPets = mockPets.filter(pet =>
        (pet.service === "Veterinary" || pet.service === "Both") &&
        pet.status !== "Completed"
    );

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Veterinary Dashboard</h1>
                <Button>New Consultation</Button>
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
                            {mockPets.filter(p => p.service === "Veterinary" && p.status === "Completed").length}
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
