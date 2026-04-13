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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createConsultation } from "@/app/actions/veterinary";

export default function NewConsultationForm({ pets }: { pets: any[] }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Combobox state
    const [comboboxOpen, setComboboxOpen] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState("");

    async function action(formData: FormData) {
        setIsLoading(true);
        setError("");

        if (!selectedPetId) {
            setError("Please select a pet.");
            setIsLoading(false);
            return;
        }

        formData.append("petId", selectedPetId); // Ensure petId is manually appended
        const result = await createConsultation(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setOpen(false);
            setSelectedPetId(""); // Reset
        }
        setIsLoading(false);
    }

    const selectedPet = pets.find((pet) => pet.id === selectedPetId);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>New Consultation</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={action}>
                    <DialogHeader>
                        <DialogTitle>Start New Consultation</DialogTitle>
                        <DialogDescription>
                            Search and select a pet to start a veterinary consultation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {error && <div className="text-sm text-destructive">{error}</div>}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="petId" className="text-right">Pet *</Label>
                            <div className="col-span-3">
                                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={comboboxOpen}
                                            className="w-full justify-between"
                                        >
                                            {selectedPet
                                                ? `${selectedPet.name} (${selectedPet.owner?.firstName} ${selectedPet.owner?.lastName})`
                                                : "Search patient..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search pet or owner name..." />
                                            <CommandList>
                                                <CommandEmpty>No patient found.</CommandEmpty>
                                                <CommandGroup>
                                                    {pets.map((pet) => (
                                                        <CommandItem
                                                            key={pet.id}
                                                            value={`${pet.name} ${pet.owner?.firstName} ${pet.owner?.lastName}`}
                                                            onSelect={() => {
                                                                setSelectedPetId(pet.id);
                                                                setComboboxOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedPetId === pet.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {pet.name} ({pet.owner?.firstName} {pet.owner?.lastName})
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">Initial Notes</Label>
                            <Input id="notes" name="notes" className="col-span-3" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Starting..." : "Start Consultation"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
