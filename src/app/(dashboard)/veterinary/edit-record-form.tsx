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
import { completeVetRecord } from "@/app/actions/records";
import { Pencil } from "lucide-react";

interface EditRecordFormProps {
    recordId: string;
    petName: string;
    existingData: {
        diagnosis?: string;
        treatment?: string;
        price?: number;
    };
}

export default function EditRecordForm({ recordId, petName, existingData }: EditRecordFormProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function action(formData: FormData) {
        setIsLoading(true);
        setError("");

        const result = await completeVetRecord(recordId, formData);

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
                <Button size="sm" variant="outline" className="gap-1 text-xs">
                    <Pencil className="h-3 w-3" /> Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <form action={action} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black">Edit Record: {petName}</DialogTitle>
                        <DialogDescription>
                            Update the diagnosis, treatment, and billing for this record.
                        </DialogDescription>
                    </DialogHeader>

                    {error && <div className="text-sm text-destructive font-bold bg-destructive/10 p-2 rounded">{error}</div>}
                    
                    <div className="space-y-2">
                        <Label htmlFor="diagnosis" className="font-bold text-sm">Diagnosis</Label>
                        <Textarea id="diagnosis" name="diagnosis" defaultValue={existingData.diagnosis || ""} placeholder="Diagnosis..." className="min-h-[80px]" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="treatment" className="font-bold text-sm">Treatment & Plan</Label>
                        <Textarea id="treatment" name="treatment" defaultValue={existingData.treatment || ""} placeholder="Treatment details..." className="min-h-[80px]" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price" className="font-bold text-sm">Bill Amount (₱)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground font-bold">₱</span>
                            <Input id="price" name="price" type="number" step="0.01" min="0" defaultValue={existingData.price || 0} className="pl-8 font-black text-lg" required />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="font-bold">
                            {isLoading ? "Saving..." : "Update Record"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
