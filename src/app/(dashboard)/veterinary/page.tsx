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
    let medicationsInventory: any[] = [];
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

        medicationsInventory = await prisma.inventory.findMany({
            where: { itemType: { name: "medication" } },
            orderBy: { itemName: "asc" }
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
                    <div className="space-y-4 overflow-x-hidden">
                        {vetPets.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">No patients are currently waiting.</p>
                        ) : (
                            vetPets.map((pet) => (
                                <div
                                    key={pet.id}
                                    className="flex flex-col gap-2 border-b pb-4 last:border-0 last:pb-0"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-4">
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
                                        <div className="flex items-center gap-2 mt-2 md:mt-0 self-end md:self-auto flex-wrap justify-end">
                                            <Badge variant="outline">
                                                {pet.status}
                                            </Badge>
                                            {pet.record && (
                                                <VetUnifiedForm 
                                                    recordId={pet.record.id} 
                                                    petName={pet.name} 
                                                    intakeData={pet.record}
                                                    medications={medicationsInventory}
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
                <CardContent className="p-0 sm:p-6">
                    <div className="w-full overflow-x-auto rounded-md border">
                        <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Date</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead className="hidden md:table-cell">Owner</TableHead>
                                <TableHead className="hidden lg:table-cell">Purpose</TableHead>
                                <TableHead className="max-w-[150px]">Diagnosis</TableHead>
                                <TableHead>Bill</TableHead>
                                <TableHead className="hidden sm:table-cell">Prescriptions</TableHead>
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
                                        <TableCell className="font-medium text-xs md:text-sm">{record.pet?.name} <span className="text-muted-foreground text-[10px] md:text-xs">({record.pet?.breed || "N/A"})</span></TableCell>
                                        <TableCell className="text-xs hidden md:table-cell">{record.pet?.owner ? `${record.pet.owner.firstName} ${record.pet.owner.lastName}` : "—"}</TableCell>
                                        <TableCell className="hidden lg:table-cell"><Badge variant="secondary" className="text-[10px]">{record.purpose?.name || "—"}</Badge></TableCell>
                                        <TableCell className="max-w-[120px] md:max-w-[150px] truncate text-xs" title={record.diagnosis}>{record.diagnosis || "—"}</TableCell>
                                        <TableCell className="font-bold text-xs">₱{record.price?.toFixed(2) || "0.00"}</TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {record.prescriptions && record.prescriptions.length > 0 ? (
                                                <div className="space-y-1">
                                                    {record.prescriptions.map((rx: any) => (
                                                        <div key={rx.id} className="flex flex-wrap items-center gap-1">
                                                            <Pill className="h-3 w-3 text-primary shrink-0" />
                                                            <span className="text-[10px] md:text-xs font-medium truncate max-w-[80px] md:max-w-[100px]">{rx.medicationName}</span>
                                                            <span className="text-[9px] text-muted-foreground whitespace-nowrap">({rx.dosage})</span>
                                                            <EditPrescriptionForm
                                                                prescriptionId={rx.id}
                                                                petName={record.pet?.name || "Patient"}
                                                                existingData={{
                                                                    medicationName: rx.medicationName,
                                                                    dosage: rx.dosage,
                                                                    instructions: rx.instructions,
                                                                }}
                                                                medications={medicationsInventory}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">None</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-wrap items-center justify-end gap-1">
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
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
