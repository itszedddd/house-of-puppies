"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { scheduleReminder } from "@/app/actions/reminders";
import { Plus, Check, ChevronsUpDown, Bot, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

// ============ RULE-BASED AI TEMPLATES ============
const SMS_TEMPLATES: Record<string, string> = {
    follow_up:
        "Good day, {ownerName}! This is House of Puppies reminding you that {petName}'s follow-up visit is scheduled on {date}. Please arrive 10 minutes early. Thank you!",
    vaccination_due:
        "Hi {ownerName}! {petName}'s vaccination is due on {date}. Please schedule a visit at House of Puppies to keep {petName} protected and healthy. Thank you!",
    lab_test_sched:
        "Hello {ownerName}, this is a reminder that {petName}'s lab test results are expected on {date}. Please visit House of Puppies to pick them up. Thank you!",
    grooming:
        "Hi {ownerName}! {petName}'s next grooming appointment is on {date}. We look forward to pampering {petName} at House of Puppies! See you then!",
};

function generateMessage(templateKey: string, ownerName: string, petName: string, dateStr: string): string {
    const template = SMS_TEMPLATES[templateKey];
    if (!template) return "";

    const formattedDate = dateStr
        ? new Date(dateStr).toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
        : "[Date]";

    return template
        .replace(/{ownerName}/g, ownerName || "[Owner]")
        .replace(/{petName}/g, petName || "[Pet]")
        .replace(/{date}/g, formattedDate);
}

export function CreateReminderDialog({ records, types }: { records: any[], types: any[] }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [comboboxOpen, setComboboxOpen] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState("");
    const [selectedTypeId, setSelectedTypeId] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [previewMessage, setPreviewMessage] = useState("");

    // Auto-generate message whenever selection changes
    useEffect(() => {
        if (!selectedRecordId || !selectedTypeId || !reminderDate) {
            setPreviewMessage("");
            return;
        }

        const record = records.find(r => r.id === selectedRecordId);
        const type = types.find(t => t.id === selectedTypeId);

        if (record && type) {
            const ownerName = `${record.pet.owner.firstName} ${record.pet.owner.lastName}`;
            const petName = record.pet.name;
            const msg = generateMessage(type.name, ownerName, petName, reminderDate);
            setPreviewMessage(msg);
        }
    }, [selectedRecordId, selectedTypeId, reminderDate, records, types]);

    async function action(formData: FormData) {
        setIsLoading(true);
        setError("");

        // Auto-attach the AI-generated message
        formData.set("message", previewMessage);

        const result = await scheduleReminder(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setOpen(false);
            setSelectedRecordId("");
            setSelectedTypeId("");
            setReminderDate("");
            setPreviewMessage("");
        }
        setIsLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="font-bold">
                    <Plus className="mr-2 h-4 w-4" /> Schedule Reminder
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <form action={action} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            AI-Powered SMS Scheduler
                        </DialogTitle>
                        <DialogDescription>
                            Select a client, reminder type, and date — the AI will automatically generate the message using veterinary rule-based templates.
                        </DialogDescription>
                    </DialogHeader>

                    {error && <div className="text-sm font-bold text-destructive">{error}</div>}

                    {/* Client/Pet Selection */}
                    <div className="space-y-2 flex flex-col">
                        <Label>Client & Pet Target</Label>
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
                                            return r ? `${r.pet.owner.firstName} ${r.pet.owner.lastName} — ${r.pet.name}` : "Select target...";
                                        })()
                                        : "Select client & pet..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[500px] max-w-[90vw] p-0" align="start">
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
                                                        <span>{r.pet.owner.firstName} {r.pet.owner.lastName} — <span className="font-bold">{r.pet.name}</span></span>
                                                        <span className="text-[10px] text-muted-foreground tracking-tight">
                                                            📞 {r.pet.owner.contactNumber || "No phone"} • Visit: {new Date(r.visitDate).toLocaleDateString()}
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

                    {/* Reminder Type */}
                    <div className="space-y-2">
                        <Label>Reminder Category</Label>
                        <Select name="reminderTypeId" value={selectedTypeId} onValueChange={setSelectedTypeId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type..." />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map(t => (
                                    <SelectItem key={t.id} value={t.id}>
                                        {t.name === "follow_up" ? "🔄 Follow-Up Visit" :
                                         t.name === "vaccination_due" ? "💉 Vaccination Due" :
                                         t.name === "lab_test_sched" ? "🧪 Lab Test Schedule" :
                                         t.name === "grooming" ? "✂️ Grooming Appointment" :
                                         t.name.replace("_", " ")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-2">
                        <Label>Scheduled Date</Label>
                        <Input
                            type="datetime-local"
                            name="reminderDate"
                            value={reminderDate}
                            onChange={(e) => setReminderDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* AI-Generated Message Preview */}
                    {previewMessage && (
                        <div className="space-y-2 border-t pt-4">
                            <Label className="flex items-center gap-2 text-primary font-bold">
                                <Eye className="h-4 w-4" />
                                AI-Generated Message Preview
                            </Label>
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm leading-relaxed">
                                <div className="flex items-start gap-2">
                                    <Bot className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                    <p className="italic text-foreground">{previewMessage}</p>
                                </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                📱 This message is auto-generated by the AI rule-based engine based on veterinary scheduling rules.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading || !previewMessage} className="font-bold">
                            {isLoading ? "Scheduling..." : "Schedule AI Reminder"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
