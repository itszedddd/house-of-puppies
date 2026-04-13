"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { scheduleReminder } from "@/app/actions/reminders";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function CreateReminderDialog({ records, types }: { records: any[], types: any[] }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [comboboxOpen, setComboboxOpen] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState("");

    async function action(formData: FormData) {
        setIsLoading(true);
        setError("");

        const result = await scheduleReminder(formData);

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
                <Button className="font-bold">
                    <Plus className="mr-2 h-4 w-4" /> Schedule New Reminder
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form action={action} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Schedule Custom AI SMS</DialogTitle>
                        <DialogDescription>
                            Target a recent consultation and configure the AI message prompt.
                        </DialogDescription>
                    </DialogHeader>

                    {error && <div className="text-sm font-bold text-destructive">{error}</div>}

                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="recordId">Client & Pet Target (Recent Consults)</Label>
                        <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={comboboxOpen}
                                    className="justify-between w-full font-normal"
                                >
                                    {selectedRecordId
                                        ? (() => {
                                            const r = records.find(record => record.id === selectedRecordId);
                                            return r ? `${r.pet.owner.firstName} ${r.pet.owner.lastName} - ${r.pet.name}` : "Select target...";
                                        })()
                                        : "Select target..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[450px] max-w-[90vw] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Search client name, pet name, or phone..." />
                                    <CommandList>
                                        <CommandEmpty>No consultations found.</CommandEmpty>
                                        <CommandGroup>
                                            {records.map(r => (
                                                <CommandItem
                                                    key={r.id}
                                                    value={`${r.pet.owner.firstName} ${r.pet.owner.lastName} ${r.pet.name} ${r.pet.owner.contactNumber || ""}`}
                                                    onSelect={() => {
                                                        setSelectedRecordId(r.id);
                                                        setComboboxOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedRecordId === r.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span>{r.pet.owner.firstName} {r.pet.owner.lastName} - <span className="font-bold">{r.pet.name}</span></span>
                                                        <span className="text-[10px] text-muted-foreground tracking-tight">
                                                            {r.pet.owner.contactNumber} • Visit: {new Date(r.visitDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <input type="hidden" name="recordId" value={selectedRecordId} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reminderTypeId">Reminder Category</Label>
                        <Select name="reminderTypeId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category..." />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map(t => (
                                    <SelectItem key={t.id} value={t.id}>
                                        {t.name.replace("_", " ")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reminderDate">Scheduled Dispatch Date/Time</Label>
                        <Input type="datetime-local" id="reminderDate" name="reminderDate" required />
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <Label htmlFor="message">AI SMS Content / Prompt</Label>
                        <Textarea 
                            id="message" 
                            name="message" 
                            required 
                            placeholder="Type exactly what you want the AI to send (e.g., 'Hi [Name], this is a reminder for Milo's upcoming vaccination...')" 
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Schedule Reminder"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
