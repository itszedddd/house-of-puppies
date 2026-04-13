import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Stethoscope, Clock, CheckCircle, FileText, Pill, Printer } from "lucide-react";
import VetUnifiedForm from "./vet-unified-form";
import EditRecordForm from "./edit-record-form";
import EditPrescriptionForm from "./edit-prescription-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VeterinaryPage() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "vet_admin") {
        redirect("/employee");
    }

    let pets: any[] = [];
    let recentRecords: any[] = [];
    try {
        pets = await prisma.pet.findMany({
            include: {
                owner: true,
                records: {
                    orderBy: { visitDate: "desc" },
                    include: { purpose: true, prescriptions: true }
                }
            }
        });

        // Get recent records (last 20) across all pets
        recentRecords = await prisma.clinicalRecord.findMany({
            where: { status: "Completed" },
            orderBy: { visitDate: "desc" },
            take: 20,
            include: {
                pet: { include: { owner: true } },
                purpose: true,
                prescriptions: true,
            }
        });
    } catch (e) {
        console.error("[DB] VeterinaryPage failed:", e);
    }

    const vetPets = pets.map(pet => {
        const latestRecord = pet.records[0];
        
        let status = "Discharged";
        if (latestRecord) {
            status = latestRecord.status;
        }
        
        return {
            ...pet,
            record: latestRecord,
            status: status || "Unknown",
            ownerName: pet.owner ? `${pet.owner.firstName} ${pet.owner.lastName}` : "Unknown",
        };
    }).filter(p => p.status === "Pending-Vet" || p.status === "Pending");

    const completedCount = recentRecords.length;

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Veterinary Dashboard</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Waiting / Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vetPets.length}</div>
                        <p className="text-xs text-muted-foreground">Patients in queue</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Records</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedCount}</div>
                        <p className="text-xs text-muted-foreground">Recent discharged patients</p>
                    </CardContent>
                </Card>
            </div>

            {/* Medical Queue */}
            <Card>
                <CardHeader>
                    <CardTitle>Medical Queue</CardTitle>
                    <CardDescription>Patients forwarded by Staff waiting for examination.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {vetPets.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">No patients are currently waiting.</p>
                        ) : (
                            vetPets.map((pet) => (
                                <div
                                    key={pet.id}
                                    className="flex flex-col gap-2 border-b pb-4 last:border-0 last:pb-0"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
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
                                            <Badge variant="outline">
                                                {pet.status}
                                            </Badge>
                                            {pet.record && (
                                                <VetUnifiedForm 
                                                    recordId={pet.record.id} 
                                                    petName={pet.name} 
                                                    intakeData={pet.record}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {(pet.record?.chiefComplaint || pet.record?.notes) && (
                                        <div className="ml-14 text-sm bg-muted/50 p-2 rounded text-muted-foreground">
                                            <span className="font-medium text-foreground">Reason for Visit:</span> {pet.record?.chiefComplaint || pet.record?.notes}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Records Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Recent Records</CardTitle>
                    <CardDescription>Completed clinical records. You can edit records and manage prescriptions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Diagnosis</TableHead>
                                <TableHead>Bill (₱)</TableHead>
                                <TableHead>Prescriptions</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">No completed records yet.</TableCell>
                                </TableRow>
                            ) : (
                                recentRecords.map((record: any) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="text-xs font-mono whitespace-nowrap">{new Date(record.visitDate).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">{record.pet?.name} <span className="text-muted-foreground text-xs">({record.pet?.breed || "N/A"})</span></TableCell>
                                        <TableCell className="text-xs">{record.pet?.owner ? `${record.pet.owner.firstName} ${record.pet.owner.lastName}` : "—"}</TableCell>
                                        <TableCell><Badge variant="secondary" className="text-[10px]">{record.purpose?.name || "—"}</Badge></TableCell>
                                        <TableCell className="max-w-[200px] truncate text-xs">{record.diagnosis || "—"}</TableCell>
                                        <TableCell className="font-bold">₱{record.price?.toFixed(2) || "0.00"}</TableCell>
                                        <TableCell>
                                            {record.prescriptions && record.prescriptions.length > 0 ? (
                                                <div className="space-y-1">
                                                    {record.prescriptions.map((rx: any) => (
                                                        <div key={rx.id} className="flex items-center gap-1">
                                                            <Pill className="h-3 w-3 text-primary" />
                                                            <span className="text-xs font-medium truncate max-w-[120px]">{rx.medicationName}</span>
                                                            <span className="text-[10px] text-muted-foreground">({rx.dosage})</span>
                                                            <EditPrescriptionForm
                                                                prescriptionId={rx.id}
                                                                petName={record.pet?.name || "Patient"}
                                                                existingData={{
                                                                    medicationName: rx.medicationName,
                                                                    dosage: rx.dosage,
                                                                    instructions: rx.instructions,
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">None</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <EditRecordForm
                                                    recordId={record.id}
                                                    petName={record.pet?.name || "Patient"}
                                                    existingData={{
                                                        diagnosis: record.diagnosis,
                                                        treatment: record.treatment,
                                                        price: record.price,
                                                    }}
                                                />
                                                <Button size="sm" variant="outline" className="gap-1 text-xs" asChild>
                                                    <Link href={`/veterinary/prescribe/${record.pet?.id}`}>
                                                        <Pill className="h-3 w-3" /> Rx
                                                    </Link>
                                                </Button>
                                                {record.prescriptions && record.prescriptions.length > 0 && (
                                                    <Button size="sm" variant="secondary" className="gap-1 text-xs" asChild>
                                                        <Link href={`/veterinary/print-rx/${record.id}`} target="_blank">
                                                            <Printer className="h-3 w-3" /> Print
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
