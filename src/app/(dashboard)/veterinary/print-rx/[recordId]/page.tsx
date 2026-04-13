import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, Pill, FileDown } from "lucide-react";
import Link from "next/link";
import PrintClientButton from "./print-client-button";

export const dynamic = "force-dynamic";

export default async function PrintPrescriptionPage({ params }: { params: { recordId: string } }) {
    const { recordId } = params;

    const record = await prisma.clinicalRecord.findUnique({
        where: { id: recordId },
        include: {
            pet: {
                include: { owner: true }
            },
            prescriptions: true,
            purpose: true,
        }
    });

    if (!record || !record.pet) {
        notFound();
    }

    const { pet, prescriptions } = record;
    const existingPrescriptions = prescriptions || [];

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between mb-6 print:hidden">
                <Button variant="outline" asChild>
                    <Link href="/veterinary">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <PrintClientButton />
                </div>
            </div>

            <Card className="print:shadow-none print:border-none print:m-0 print:p-0" id="prescription-card">
                <CardHeader className="print:pb-2">
                    <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-4">
                        <h1 className="text-2xl font-bold tracking-tight">House of Puppies Veterinary Clinic</h1>
                        <p className="text-xs text-gray-600">Veterinary & Grooming Services</p>
                        <p className="text-xs text-gray-600">Contact: (042) 123-4567</p>
                        <div className="mt-3 text-left border-t border-gray-300 pt-3">
                            <p className="text-base font-bold tracking-widest uppercase">Prescription (Rx)</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="print:text-lg">Rx: {pet.name}</CardTitle>
                            <CardDescription className="print:text-black print:text-sm">
                                {pet.species || "Animal"} — {pet.breed || "N/A"}
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium print:text-base">Owner: {pet.owner?.firstName} {pet.owner?.lastName}</p>
                            <p className="text-sm text-muted-foreground print:text-black print:text-sm">Date: {new Date(record.visitDate).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {existingPrescriptions.length > 0 ? (
                        <div className="space-y-2 print:space-y-3 min-h-[300px]">
                            <h3 className="text-sm font-bold print:text-base print:font-black print:uppercase print:tracking-wider flex items-center gap-2">
                                <Pill className="h-4 w-4 text-primary print:hidden" />
                                Prescribed Medications
                            </h3>
                            <div className="border rounded-lg divide-y print:border-black print:divide-gray-300">
                                {existingPrescriptions.map((rx: any, idx: number) => (
                                    <div key={rx.id} className="p-3 print:p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <p className="font-bold text-sm print:text-base">{idx + 1}. {rx.medicationName}</p>
                                                <p className="text-xs text-muted-foreground print:text-black print:text-sm">Dosage: <span className="font-medium">{rx.dosage}</span></p>
                                                {rx.instructions && (
                                                    <p className="text-xs text-muted-foreground print:text-black print:text-sm">Instructions: <span className="italic">{rx.instructions}</span></p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-10 text-center text-muted-foreground print:hidden">
                            No prescriptions found for this record.
                        </div>
                    )}

                    <div className="hidden print:block mt-16 pt-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Notes:</p>
                                <div className="border-b border-gray-300 h-12"></div>
                            </div>
                            <div className="text-right">
                                <div className="border-t border-black w-56 mx-auto text-center pt-2 mt-10">
                                    <p className="text-sm font-bold">Veterinarian Signature</p>
                                    <p className="text-xs text-gray-600">License No: _________________</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-center text-[9px] text-gray-400 mt-8 border-t pt-2">
                            This prescription was generated by the House of Puppies Veterinary Management System. Record ID: {recordId.slice(0, 8)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
