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
import { updatePet, deletePet } from "@/app/actions/pets";

export default function PetActions({ pet }: { pet: any }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleEdit(formData: FormData) {
        setIsLoading(true);
        setError("");
        const result = await updatePet(pet.id, formData);
        if (result?.error) { setError(result.error); }
        else { setOpenEdit(false); }
        setIsLoading(false);
    }

    async function handleDelete() {
        setIsLoading(true);
        const result = await deletePet(pet.id);
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
                            <DialogTitle>Edit Pet</DialogTitle>
                            <DialogDescription>Update pet details.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {error && <div className="text-sm text-destructive">{error}</div>}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name *</Label>
                                <Input id="name" name="name" defaultValue={pet.name} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="species" className="text-right">Species</Label>
                                <Input id="species" name="species" defaultValue={pet.species} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="breed" className="text-right">Breed</Label>
                                <Input id="breed" name="breed" defaultValue={pet.breed} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="age" className="text-right">Age (yrs)</Label>
                                <Input id="age" name="age" type="number" defaultValue={pet.age} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <div className="col-span-3">
                                    <Select name="status" defaultValue={pet.records?.[0]?.status || "Pending"}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Scheduled</SelectItem>
                                            <SelectItem value="Shower">Shower</SelectItem>
                                            <SelectItem value="Trimming Nails">Trimming Nails</SelectItem>
                                            <SelectItem value="Washing">Washing</SelectItem>
                                            <SelectItem value="Grooming">Grooming</SelectItem>
                                            <SelectItem value="Ready">Ready</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="notes" className="text-right">Notes</Label>
                                <Input id="notes" name="notes" defaultValue={pet.notes} className="col-span-3" />
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
                        <DialogTitle>Delete Pet</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{pet.name}</strong>? All associated records and vaccinations will be deleted. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {error && <div className="text-sm text-destructive">{error}</div>}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? "Deleting..." : "Delete Pet"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
