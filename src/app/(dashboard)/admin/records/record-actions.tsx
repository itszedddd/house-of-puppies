"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { updateRecord, deleteRecord } from "@/app/actions/records";

export default function RecordActions({ record }: { record: any }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleEdit(formData: FormData) {
        setIsLoading(true);
        setError("");
        const result = await updateRecord(record.id, formData);
        if (result?.error) { setError(result.error); }
        else { setOpenEdit(false); }
        setIsLoading(false);
    }

    async function handleDelete() {
        setIsLoading(true);
        const result = await deleteRecord(record.id);
        if (result?.error) { setError(result.error); }
        else { setOpenDelete(false); }
        setIsLoading(false);
    }

    return (
        <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOpenEdit(true)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setOpenDelete(true)}>
                <Trash2 className="h-4 w-4" />
            </Button>

            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="sm:max-w-[425px]">
                    <form action={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Record</DialogTitle>
                            <DialogDescription>Update the service record details.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {error && <div className="text-sm text-destructive">{error}</div>}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="serviceType" className="text-right">Service *</Label>
                                <Input id="serviceType" name="serviceType" defaultValue={record.serviceType} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">Date</Label>
                                <Input id="date" name="date" type="date" defaultValue={record.visitDate ? new Date(record.visitDate).toISOString().split("T")[0] : ''} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">Price</Label>
                                <Input id="price" name="price" type="number" step="0.01" defaultValue={record.price} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <div className="col-span-3">
                                    <Select name="status" defaultValue={record.status || "Pending"}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Scheduled</SelectItem>
                                            <SelectItem value="Shower">Shower</SelectItem>
                                            <SelectItem value="Trimming Nails">Trimming Nails</SelectItem>
                                            <SelectItem value="Washing">Washing</SelectItem>
                                            <SelectItem value="Grooming">Grooming</SelectItem>
                                            <SelectItem value="In Consultation">In Consultation</SelectItem>
                                            <SelectItem value="Ready">Ready</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="notes" className="text-right">Notes</Label>
                                <Input id="notes" name="notes" defaultValue={record.notes} className="col-span-3" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save changes"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Record</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this service record? This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {error && <div className="text-sm text-destructive">{error}</div>}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? "Deleting..." : "Delete Record"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
