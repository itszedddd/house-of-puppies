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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { createEmployee } from "@/app/actions/employees";

export default function EmployeeForm() {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function action(formData: FormData) {
        setIsLoading(true);
        setError("");

        const result = await createEmployee(formData);

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
                    <Plus className="mr-2 h-4 w-4" /> Add Employee
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={action}>
                    <DialogHeader>
                        <DialogTitle>Add New Employee</DialogTitle>
                        <DialogDescription>
                            Create a new staff or admin account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {error && <div className="text-sm text-destructive">{error}</div>}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name *</Label>
                            <Input id="name" name="name" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email *</Label>
                            <Input id="email" name="email" type="email" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">Password *</Label>
                            <Input id="password" name="password" type="password" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role *</Label>
                            <div className="col-span-3">
                                <Select name="role" defaultValue="staff_records">
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
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
