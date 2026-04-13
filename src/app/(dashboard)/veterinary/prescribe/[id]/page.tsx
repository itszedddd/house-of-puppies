"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Printer, Save, History, Package, AlertTriangle, Pill, FileDown } from "lucide-react";
import Link from "next/link";
import { createPrescription } from "@/app/actions/prescriptions";

interface Pet {
    id: string;
    name: string;
    breed: string | null;
    species: string | null;
    owner: { firstName: string; lastName: string; contactNumber: string | null };
    records: any[];
}

interface InventoryItem {
    id: string;
    itemName: string;
    stock: number;
    unit: string | null;
    status: string | null;
}

export default function PrescribePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);
    const [medicine, setMedicine] = useState("");
    const [dosage, setDosage] = useState("");
    const [instructions, setInstructions] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    async function fetchData() {
        try {
            const [petRes, invRes] = await Promise.all([
                fetch(`/api/pets/${id}`),
                fetch(`/api/inventory`),
            ]);
            if (petRes.ok) {
                const data = await petRes.json();
                setPet(data);
            }
            if (invRes.ok) {
                const invData = await invRes.json();
                setInventory(invData);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        const formData = new FormData();
        formData.append("medicine", medicine);
        formData.append("dosage", dosage);
        formData.append("instructions", instructions);

        const result = await createPrescription(id, formData);

        if (result.error) {
            alert(result.error);
        } else {
            setSaved(true);
            // Refetch to get the updated prescriptions list
            await fetchData();
        }
        setSaving(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleNewPrescription = () => {
        setMedicine("");
        setDosage("");
        setInstructions("");
        setSaved(false);
    };

    // Check if typed medicine matches something in inventory
    const matchingItem = inventory.find(
        (item) => item.itemName.toLowerCase().includes(medicine.toLowerCase()) && medicine.length > 1
    );

    // Get prescriptions from the latest record
    const latestRecord = pet?.records?.[0];
    const existingPrescriptions = latestRecord?.prescriptions || [];

    if (loading) {
        return <div className="p-8 text-muted-foreground">Loading patient...</div>;
    }

    if (!pet) {
        return (
            <div className="p-8 flex flex-col items-center gap-4">
                <p>Patient not found.</p>
                <Button variant="link" asChild><Link href="/veterinary">Back to Dashboard</Link></Button>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-[1fr_320px] items-start">
            <div className="grid gap-6">
                <div className="flex items-center gap-4 print:hidden">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/veterinary">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-lg font-semibold md:text-2xl">Write Prescription</h1>
                </div>

                {/* Prescription Document Card — this is the printable area */}
                <Card className="print:shadow-none print:border-none print:m-0 print:p-0" id="prescription-card">
                    <CardHeader className="print:pb-2">
                        {/* Print Header */}
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
                                <p className="text-sm text-muted-foreground print:text-black print:text-sm">Date: {new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Show existing prescriptions for this visit */}
                        {existingPrescriptions.length > 0 && (
                            <div className="space-y-2 print:space-y-3">
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
                        )}

                        {/* New prescription form (hidden on print if already saved) */}
                        {!saved ? (
                            <div className="space-y-4 print:hidden">
                                <h3 className="text-sm font-bold flex items-center gap-2 border-t pt-4">
                                    Add New Prescription
                                </h3>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Medicine Name</label>
                                    <Input
                                        placeholder="e.g. Amoxicillin 500mg"
                                        value={medicine}
                                        onChange={e => setMedicine(e.target.value)}
                                    />
                                    {/* Stock indicator */}
                                    {medicine.length > 1 && (
                                        <div>
                                            {matchingItem ? (
                                                <div className={`flex items-center gap-2 text-xs p-2 rounded-md border ${matchingItem.stock <= 10 ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400' : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400'}`}>
                                                    <Package className="h-3 w-3" />
                                                    <span className="font-bold">{matchingItem.itemName}</span>
                                                    <span>—</span>
                                                    <span className="font-bold">{matchingItem.stock} {matchingItem.unit}</span>
                                                    <span>in stock</span>
                                                    {matchingItem.stock <= 10 && <AlertTriangle className="h-3 w-3 ml-1" />}
                                                    {matchingItem.stock <= 10 && <span className="font-bold">LOW STOCK</span>}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-muted-foreground italic">No matching medicine found in inventory for &quot;{medicine}&quot;</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Dosage</label>
                                    <Input
                                        placeholder="e.g. 500mg twice daily for 7 days"
                                        value={dosage}
                                        onChange={e => setDosage(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Instructions</label>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground disabled:opacity-50"
                                        placeholder="e.g. Give twice daily with food. Complete full course."
                                        value={instructions}
                                        onChange={e => setInstructions(e.target.value)}
                                    />
                                </div>

                                {/* Save Button */}
                                <div className="flex gap-2 pt-2">
                                    <Button onClick={handleSave} className="gap-2" disabled={saving || !medicine || !dosage}>
                                        <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Prescription"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 print:hidden border-t pt-4">
                                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-3 text-green-700 dark:text-green-400 text-sm font-medium">
                                    ✓ Prescription saved successfully!
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={handleNewPrescription} className="gap-2">
                                        <Pill className="h-4 w-4" /> Add Another
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Print Footer / Signature Line */}
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
                                This prescription was generated by the House of Puppies Veterinary Management System.
                            </div>
                        </div>

                        {/* Print / PDF Buttons */}
                        <div className="flex gap-2 pt-4 border-t print:hidden">
                            <Button variant="default" onClick={handlePrint} className="gap-2">
                                <Printer className="h-4 w-4" /> Print Prescription
                            </Button>
                            <Button variant="outline" onClick={handlePrint} className="gap-2">
                                <FileDown className="h-4 w-4" /> Save as PDF
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link href="/veterinary">← Back to Dashboard</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Sidebar */}
            <div className="grid gap-6 print:hidden">
                {/* Patient History */}
                <Card className="h-fit max-h-[40vh] overflow-y-auto">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <History className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-md">Patient History</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!pet.records || pet.records.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No previous records.</p>
                        ) : (
                            <div className="space-y-4">
                                {pet.records.map((r: any, idx: number) => (
                                    <div key={idx} className="text-sm border-b pb-2 last:border-0">
                                        <div className="flex justify-between font-medium">
                                            <span>{r.purpose?.name || "Visit"}</span>
                                            <span>{new Date(r.visitDate).toLocaleDateString()}</span>
                                        </div>
                                        {r.diagnosis && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.diagnosis}</p>}
                                        {r.prescriptions?.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {r.prescriptions.map((rx: any) => (
                                                    <Badge key={rx.id} variant="outline" className="text-[10px]">
                                                        <Pill className="h-2 w-2 mr-1" /> {rx.medicationName}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        <Badge variant="outline" className="mt-1 text-[10px]">{r.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Medicine Stock Quick View */}
                <Card className="h-fit max-h-[40vh] overflow-y-auto">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-md">Medicine Stock</CardTitle>
                        </div>
                        <CardDescription className="text-xs">Click a medicine to use it</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {inventory.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No medicines in inventory.</p>
                        ) : (
                            <div className="space-y-2">
                                {inventory.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center justify-between text-xs p-2 rounded border cursor-pointer hover:bg-muted/50 transition-colors ${item.stock <= 10 ? 'border-red-200 dark:border-red-900' : ''}`}
                                        onClick={() => { setMedicine(item.itemName); setSaved(false); }}
                                        title="Click to use this medicine"
                                    >
                                        <span className="font-medium truncate max-w-[160px]">{item.itemName}</span>
                                        <div className="flex items-center gap-1">
                                            {item.stock <= 10 && <AlertTriangle className="h-3 w-3 text-red-500" />}
                                            <Badge variant={item.stock <= 10 ? "destructive" : "secondary"} className="text-[10px]">
                                                {item.stock} {item.unit}
                                            </Badge>
                                        </div>
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
