"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPets, Pet } from "@/lib/data";
import { Stethoscope, Syringe, Pill, FileText, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PatientProfilePage() {
    const params = useParams();
    const [pet, setPet] = useState<Pet | null>(null);

    useEffect(() => {
        if (params.id) {
            const foundPet = mockPets.find((p) => p.id === params.id);
            setPet(foundPet || null);
        }
    }, [params]);

    if (!pet) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <p>Patient not found.</p>
                <Button variant="link" asChild>
                    <Link href="/veterinary">Back to Dashboard</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/veterinary">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-lg font-semibold md:text-2xl">Patient Profile: {pet.name}</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">ID:</span>
                            <span className="text-muted-foreground">{pet.id}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Breed:</span>
                            <span className="text-muted-foreground">{pet.breed}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Owner:</span>
                            <span className="text-muted-foreground">{pet.ownerName}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Contact:</span>
                            <span className="text-muted-foreground">{pet.contactNumber}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="font-medium">Status:</span>
                            <Badge>{pet.status}</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button className="w-full gap-2">
                            <Stethoscope className="h-4 w-4" /> Start Consultation
                        </Button>
                        <Button variant="outline" className="w-full gap-2">
                            <Syringe className="h-4 w-4" /> Record Vaccination
                        </Button>
                        <Button variant="outline" className="w-full gap-2" asChild>
                            <Link href={`/veterinary/prescribe/${pet.id}`}>
                                <Pill className="h-4 w-4" /> Issue Prescription
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle>Medical History</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {pet.medicalHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No medical history recorded.</p>
                    ) : (
                        <div className="space-y-4">
                            {pet.medicalHistory.map((record, i) => (
                                <div key={i} className="rounded-lg border p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold">{record.diagnosis}</h4>
                                        <Badge variant="outline">{record.date}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">Treatment: {record.treatment}</p>
                                    <p className="text-xs text-muted-foreground">Vet: {record.veterinarian}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Syringe className="h-5 w-5 text-primary" />
                            <CardTitle>Vaccinations</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {pet.vaccinations.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No vaccinations recorded.</p>
                        ) : (
                            <div className="space-y-4">
                                {pet.vaccinations.map((vac, i) => (
                                    <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                                        <div>
                                            <p className="font-medium">{vac.name}</p>
                                            <p className="text-xs text-muted-foreground">Given: {vac.dateGiven}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">Due:</p>
                                            <Badge variant="secondary">{vac.nextDueDate}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Pill className="h-5 w-5 text-primary" />
                            <CardTitle>Prescriptions</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {pet.prescriptions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No active prescriptions.</p>
                        ) : (
                            <div className="space-y-4">
                                {pet.prescriptions.map((script, i) => (
                                    <div key={i} className="rounded-lg border p-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-semibold">{script.medicine}</p>
                                            <Badge variant={script.status === "Active" ? "default" : "secondary"}>
                                                {script.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-foreground">{script.dosage}</p>
                                        <p className="text-xs text-muted-foreground italic">"{script.instructions}"</p>
                                        <p className="text-xs text-muted-foreground mt-1">Issued: {script.dateIssued}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
