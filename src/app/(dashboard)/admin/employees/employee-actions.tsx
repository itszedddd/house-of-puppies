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
import { updateEmployee, deleteEmployee } from "@/app/actions/employees";

export default function EmployeeActions({ employee }: { employee: any }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleEdit(formData: FormData) {
        setIsLoading(true);
        setError("");

        const result = await updateEmployee(employee.id, formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setOpenEdit(false);
        }
        setIsLoading(false);
    }

    async function handleDelete() {
        setIsLoading(true);
        setError("");

        const result = await deleteEmployee(employee.id);

        if (result?.error) {
            setError(result.error);
        } else {
            setOpenDelete(false);
        }
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
                            <DialogTitle>Edit Employee</DialogTitle>
                            <DialogDescription>
                                Update employee details here.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {error && <div className="text-sm text-destructive">{error}</div>}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name *</Label>
                                <Input id="name" name="name" defaultValue={employee.name} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email *</Label>
                                <Input id="email" name="email" type="email" defaultValue={employee.email} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">Role *</Label>
                                <div className="col-span-3">
                                    <Select name="role" defaultValue={employee.role}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="staff_records">Staff — Records</SelectItem>
                                            <SelectItem value="staff_sms">Staff — SMS Scheduler</SelectItem>
                                            <SelectItem value="staff_inventory">Staff — Inventory</SelectItem>
                                            <SelectItem value="vet_admin">Admin / Veterinarian</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save changes"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Employee</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this employee account? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {error && <div className="text-sm text-destructive">{error}</div>}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? "Deleting..." : "Delete Employee"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
