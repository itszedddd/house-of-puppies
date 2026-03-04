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
import { Plus } from "lucide-react";
import { useState } from "react";
import { createRecord } from "@/app/actions/records";
import { Textarea } from "@/components/ui/textarea";
import { Pet, Client } from "@prisma/client";

type PetWithClient = Pet & { client: Client };

export default function RecordForm({ pets }: { pets: PetWithClient[] }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function action(formData: FormData) {
        setIsLoading(true);
        setError("");

        const result = await createRecord(formData);

        if (result.error) {
            setError(result.error);
        } else {
            setOpen(false);
        }
        setIsLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Record
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={action}>
                    <DialogHeader>
                        <DialogTitle>Add Service Record</DialogTitle>
                        <DialogDescription>
                            Create a new grooming service record or appointment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                        {error && <div className="text-sm text-destructive">{error}</div>}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="petId" className="text-right">
                                Pet *
                            </Label>
                            <select
                                id="petId"
                                name="petId"
                                className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="" disabled selected>Select a Pet</option>
                                {pets.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.client.name})</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="serviceType" className="text-right">
                                Service *
                            </Label>
                            <Input id="serviceType" name="serviceType" className="col-span-3" placeholder="e.g. Full Grooming" required />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                Date
                            </Label>
                            <Input id="date" name="date" type="datetime-local" className="col-span-3" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Price ($)
                            </Label>
                            <Input id="price" name="price" type="number" min="0" step="0.01" className="col-span-3" required />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <select
                                id="status"
                                name="status"
                                className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="pending">Pending / Scheduled</option>
                                <option value="in-progress">In Progress</option>
                                <option value="ready">Ready for Pickup</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <Textarea id="notes" name="notes" placeholder="Any special instructions or observations" className="col-span-3" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
