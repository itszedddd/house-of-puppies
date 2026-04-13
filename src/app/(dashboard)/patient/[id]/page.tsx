import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { Stethoscope, Syringe, Pill, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import RecordVaccinationForm from "./record-vaccination-form";
import StartConsultationBtn from "./start-consultation-btn";

export const dynamic = "force-dynamic";

export default async function PatientProfilePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const pet = await prisma.pet.findUnique({
        where: { id: params.id },
        include: {
            owner: true,
            records: { 
                orderBy: { visitDate: "desc" },
                include: { purpose: true, prescriptions: { orderBy: { createdAt: "desc" } } }
            }
        }
    });

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

    const latestRecord = pet.records?.[0];
    const status = latestRecord?.status || "Pending";
    const allPrescriptions = pet.records?.flatMap(r => r.prescriptions) || [];

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
                            <span className="text-muted-foreground">{pet.breed || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Owner:</span>
                            <span className="text-muted-foreground">{pet.owner.firstName} {pet.owner.lastName}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Contact:</span>
                            <span className="text-muted-foreground">{pet.owner.contactNumber || pet.owner.email || "N/A"}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="font-medium">Status:</span>
                            <Badge>{status}</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <StartConsultationBtn petId={pet.id} />
                        <RecordVaccinationForm petId={pet.id} />
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
                    {pet.records.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No medical history recorded.</p>
                    ) : (
                        <div className="space-y-4">
                            {pet.records.map((record, i) => (
                                <div key={i} className="rounded-lg border p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold">{record.purpose?.name || "Check-up"}</h4>
                                        <Badge variant="outline">{new Date(record.visitDate).toLocaleDateString()}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">Notes: {record.notes || "None"}</p>
                                    <p className="text-xs text-muted-foreground">Status: {record.status}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Pill className="h-5 w-5 text-primary" />
                            <CardTitle>Prescriptions</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {allPrescriptions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No prescriptions recorded.</p>
                        ) : (
                            <div className="space-y-4">
                                {allPrescriptions.map((rx, i) => (
                                    <div key={i} className="flex flex-col border-b pb-2 last:border-0">
                                        <div className="flex justify-between items-start">
                                            <p className="font-medium text-sm">{rx.medicationName}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Dosage: {rx.dosage}</p>
                                        {rx.instructions && (
                                            <p className="text-xs text-muted-foreground mt-1 break-words">Instructions: {rx.instructions}</p>
                                        )}
                                        <p className="text-[10px] text-muted-foreground mt-2">
                                            Issued: {new Date(rx.prescriptionDate).toLocaleDateString()}
                                        </p>
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
