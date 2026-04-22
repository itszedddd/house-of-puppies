"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react";
import { updatePrescription } from "@/app/actions/prescriptions";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EditPrescriptionFormProps {
    prescriptionId: string;
    petName: string;
    existingData: {
        medicationName: string;
        dosage: string;
        instructions?: string | null;
    };
    medications?: any[];
}

export default function EditPrescriptionForm({ prescriptionId, petName, existingData, medications = [] }: EditPrescriptionFormProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [medicineValue, setMedicineValue] = useState(existingData.medicationName);

    async function action(formData: FormData) {
        setIsLoading(true);
        setError("");

        const result = await updatePrescription(prescriptionId, formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setOpen(false);
        }
        setIsLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="gap-1 text-xs h-6 px-2">
                    <Pencil className="h-3 w-3" /> Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <form action={action} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black">Edit Prescription</DialogTitle>
                        <DialogDescription>
                            Update prescription for {petName}.
                        </DialogDescription>
                    </DialogHeader>

                    {error && <div className="text-sm text-destructive font-bold bg-destructive/10 p-2 rounded">{error}</div>}
                    
                    <div className="space-y-2">
                        <Label htmlFor="medicine" className="font-bold text-sm">Medicine Name</Label>
                        <div className="flex items-center gap-2">
                            <Input 
                                id="medicine" 
                                name="medicine" 
                                list="edit-medications-list"
                                value={medicineValue}
                                onChange={(e) => setMedicineValue(e.target.value)}
                                required 
                            />
                            {(() => {
                                const med = medications.find(m => m.itemName?.toLowerCase() === medicineValue?.toLowerCase());
                                if (med && med.stock <= 5) {
                                    return <Badge variant="destructive" className="shrink-0 text-[10px] h-6 py-0 flex items-center">Low on stocks ({med.stock})</Badge>;
                                }
                                return null;
                            })()}
                        </div>
                        <datalist id="edit-medications-list">
                            {medications.map(med => (
                                <option key={med.id} value={med.itemName} />
                            ))}
                        </datalist>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dosage" className="font-bold text-sm">Dosage</Label>
                        <Input id="dosage" name="dosage" defaultValue={existingData.dosage} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instructions" className="font-bold text-sm">Instructions</Label>
                        <Textarea id="instructions" name="instructions" defaultValue={existingData.instructions || ""} placeholder="e.g. Give twice daily with food..." className="min-h-[60px]" />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="font-bold">
                            {isLoading ? "Saving..." : "Update Prescription"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
