"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockPets } from "@/lib/data";
import { ArrowLeft, Printer, Save } from "lucide-react";
import Link from "next/link";

export default function PrescribePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const pet = mockPets.find((p) => p.id === id);

    const [medicine, setMedicine] = useState("");
    const [dosage, setDosage] = useState("");
    const [instructions, setInstructions] = useState("");

    if (!pet) {
        return <div className="p-8">Patient not found</div>;
    }

    const handleSave = () => {
        // In a real app, this would save to DB.
        // For prototype, we simulate a save.
        alert(`Prescription saved for ${pet.name}:\n${medicine} - ${dosage}`);
        router.push(`/patient/${id}`);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="grid gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/patient/${id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-lg font-semibold md:text-2xl">Write Prescription</h1>
            </div>

            <Card className="print:shadow-none print:border-none">
                <CardHeader>
                    <CardTitle>Rx: {pet.name}</CardTitle>
                    <CardDescription>Owner: {pet.ownerName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Medicine Name</label>
                        <Input
                            placeholder="e.g. Amoxicillin"
                            value={medicine}
                            onChange={e => setMedicine(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Dosage</label>
                        <Input
                            placeholder="e.g. 500mg"
                            value={dosage}
                            onChange={e => setDosage(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Instructions</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="e.g. Give twice daily with food..."
                            value={instructions}
                            onChange={e => setInstructions(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 pt-4 print:hidden">
                        <Button onClick={handleSave} className="gap-2">
                            <Save className="h-4 w-4" /> Save Prescription
                        </Button>
                        <Button variant="outline" onClick={handlePrint} className="gap-2">
                            <Printer className="h-4 w-4" /> Print View
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
