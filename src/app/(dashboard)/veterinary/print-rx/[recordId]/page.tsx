import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, Pill, FileDown } from "lucide-react";
import Link from "next/link";
import PrintClientButton from "./print-client-button";

export const dynamic = "force-dynamic";

export default async function PrintPrescriptionPage({ params }: { params: Promise<{ recordId: string }> }) {
    const { recordId } = await params;

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
    
    // Calculate Age
    const calculateAge = (dobString: string | null) => {
        if (!dobString) return "N/A";
        try {
            const birthDate = new Date(dobString);
            if (isNaN(birthDate.getTime())) return dobString;
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age === 0) {
                const months = today.getMonth() - birthDate.getMonth() + (12 * (today.getFullYear() - birthDate.getFullYear()));
                return months > 0 ? `${months} month(s)` : "Newborn";
            }
            return `${age} year(s)`;
        } catch {
            return dobString;
        }
    };

    const petAge = calculateAge(pet.dateOfBirth);
    const validUntil = new Date(record.visitDate);
    validUntil.setDate(validUntil.getDate() + 30);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen bg-white">
            {/* Control Bar - Hidden on Print */}
            <div className="flex items-center justify-between mb-8 print:hidden">
                <Button variant="outline" asChild>
                    <Link href="/veterinary">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <PrintClientButton />
                </div>
            </div>

            {/* Main Rx Template Container */}
            <div 
                className="relative border-[2px] border-[#004AAD] p-6 md:p-8 bg-white overflow-hidden shadow-sm"
                id="prescription-card"
            >
                {/* Paw Print Watermark SVG */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0">
                    <svg viewBox="0 0 512 512" className="w-[80%] h-[80%]" fill="currentColor">
                        <path d="M256 160c14.1 0 27.2 3.9 38.4 10.7C310.2 135 343.8 112 384 112c53 0 96 43 96 96s-43 96-96 96c-14.1 0-27.2-3.9-38.4-10.7C331.8 329 298.2 352 256 352s-75.8-23-91.6-54.7c-11.2 6.8-24.3 10.7-38.4 10.7-53 0-96-43-96-96s43-96 96-96c40.2 0 73.8 23 89.6 58.7c11.2-6.8 24.3-10.7 38.4-10.7zM112 304c10.5 0 20.3-2.5 29-7C131 278.4 128 259.6 128 240s3-38.4 13-57c-8.7-4.5-18.5-7-29-7-35.3 0-64 28.7-64 64s28.7 64 64 64zm288-7c8.7 4.5 18.5 7 29 7 35.3 0 64-28.7 64-64s-28.7-64-64-64c-10.5 0-20.3 2.5-29 7 10 18.6 13 37.4 13 57s-3 38.4-13 57zm-144 55c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z" />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-[2px] border-[#004AAD] pb-4 mb-4">
                        <div className="flex gap-3 items-center">
                            <div className="w-16 md:w-20">
                                <img src="/rx-logo.png" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-4xl font-black text-[#004AAD] leading-none mb-1 uppercase tracking-tighter">HOUSE OF PUPPIES</h1>
                                <p className="text-[#004AAD] text-xs md:text-sm font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase mb-1">VETERINARY CLINIC & GROOMING SALON</p>
                                <p className="text-[#004AAD] text-[9px] md:text-[10px] font-semibold leading-tight">149 MALARIA ROAD, BARANGAY 185, NORTH CALOOCAN CITY, METRO MANILA 1428</p>
                            </div>
                        </div>
                    </div>

                    {/* Pet & Owner Info Info */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-8 mb-4 text-xs md:text-sm font-bold text-black uppercase">
                        <div className="space-y-2">
                            <p className="flex items-baseline">
                                <span className="min-w-[120px]">PET NAME:</span>
                                <span className="border-b border-black flex-1 ml-2 font-normal lowercase first-letter:uppercase">{pet.name}</span>
                            </p>
                            <p className="flex items-baseline">
                                <span className="min-w-[120px]">PET AGE:</span>
                                <span className="border-b border-black flex-1 ml-2 font-normal">{petAge}</span>
                            </p>
                            <p className="flex items-baseline">
                                <span className="min-w-[120px]">PET GENDER:</span>
                                <span className="border-b border-black flex-1 ml-2 font-normal lowercase first-letter:uppercase">{pet.gender || "—"}</span>
                            </p>
                            <p className="flex items-baseline">
                                <span className="min-w-[120px]">OWNER:</span>
                                <span className="border-b border-black flex-1 ml-2 font-normal lowercase first-letter:uppercase">{pet.owner?.firstName} {pet.owner?.lastName}</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 pr-2">
                            <div className="text-right">
                                <p className="text-[10px] md:text-xs font-black">PRESCRIBED ON</p>
                                <p className="border-b border-black px-2 py-1 text-sm md:text-base font-normal">
                                    {new Date(record.visitDate).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Blue Prescription Banner */}
                    <div className="bg-[#004AAD] text-white py-1 md:py-1.5 text-center text-xs md:text-base font-black tracking-[0.2em] md:tracking-[0.3em] uppercase mb-3 md:mb-4">
                        PRESCRIPTION
                    </div>

                    {/* Rx Content */}
                    <div className="flex-1">
                        <div className="mb-4 text-center md:text-left pl-0 md:pl-4">
                            <h2 className="text-4xl md:text-5xl font-black text-black">Rx</h2>
                        </div>

                        <div className="grid grid-cols-[1fr_2.5fr] gap-x-4 gap-y-1">
                            <div className="text-center md:text-left font-bold text-[10px] md:text-xs uppercase text-gray-400 mb-1">Quantity</div>
                            <div className="text-left font-bold text-[10px] md:text-xs uppercase text-gray-400 mb-1">Prescription</div>
                            
                            {existingPrescriptions.length > 0 ? (
                                existingPrescriptions.map((rx: any) => (
                                    <React.Fragment key={rx.id}>
                                        <div className="font-bold text-sm md:text-base border-b border-gray-100 pb-1 pt-2">{rx.dosage}</div>
                                        <div className="pb-2 pt-2 text-sm xl:text-base">
                                            <p className="font-black text-black lowercase first-letter:uppercase">{rx.medicationName}</p>
                                            {rx.instructions && (
                                                <p className="text-xs text-gray-600 font-medium italic mt-0.5">{rx.instructions}</p>
                                            )}
                                        </div>
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="col-span-2 py-10 text-center text-gray-400 italic">No prescriptions found.</div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-4 flex justify-between items-end border-t border-[#004AAD]">
                        <div className="space-y-1 uppercase">
                            <p className="text-[10px] font-black text-black">VALID UNTIL</p>
                            <p className="text-sm md:text-lg font-bold border-b-2 border-black inline-block min-w-[120px] md:min-w-[150px] text-center">
                                {validUntil.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-center px-2 md:px-4">
                                <p className="text-sm md:text-lg font-black text-black mb-0 leading-tight">DR. ANALIZA P. YORAC, DVM</p>
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider md:tracking-widest leading-none mb-1">Senior Veterinarian</p>
                                <p className="text-[10px] font-bold text-gray-600">LIC #: 0012065</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React from "react";
