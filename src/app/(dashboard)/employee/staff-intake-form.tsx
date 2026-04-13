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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, HeartPulse, ClipboardList, ShieldCheck, FileSignature, UserPlus, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { submitStaffIntake } from "@/app/actions/records";
import { createClient } from "@/app/actions/clients";
import { createPet } from "@/app/actions/pets";

type ClientInfo = { id: string; name: string };

export default function StaffIntakeForm({ pets, clients }: { pets: any[]; clients: ClientInfo[] }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Intake form state
    const [purpose, setPurpose] = useState("");
    const [comboboxOpen, setComboboxOpen] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState("");

    // --- Add Client inline state ---
    const [showAddClient, setShowAddClient] = useState(false);
    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientAddress, setClientAddress] = useState("");
    const [clientLoading, setClientLoading] = useState(false);
    const [clientError, setClientError] = useState("");
    const [clientSuccess, setClientSuccess] = useState("");

    // --- Add Pet inline state ---
    const [showAddPet, setShowAddPet] = useState(false);
    const [petName, setPetName] = useState("");
    const [petSpecies, setPetSpecies] = useState("");
    const [petBreed, setPetBreed] = useState("");
    const [petAge, setPetAge] = useState("");
    const [petOwnerId, setPetOwnerId] = useState("");
    const [ownerComboOpen, setOwnerComboOpen] = useState(false);
    const [petLoading, setPetLoading] = useState(false);
    const [petError, setPetError] = useState("");
    const [petSuccess, setPetSuccess] = useState("");

    async function handleAddClient() {
        setClientLoading(true);
        setClientError("");
        setClientSuccess("");
        if (!clientName.trim()) {
            setClientError("Name is required.");
            setClientLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append("name", clientName.trim());
        if (clientPhone) formData.append("phone", clientPhone);
        if (clientEmail) formData.append("email", clientEmail);
        if (clientAddress) formData.append("address", clientAddress);

        const result = await createClient(formData);
        if (result.error) {
            setClientError(result.error);
        } else {
            setClientSuccess(`Client "${clientName}" added! Refresh to see them in the pet owner list.`);
            setClientName("");
            setClientPhone("");
            setClientEmail("");
            setClientAddress("");
        }
        setClientLoading(false);
    }

    async function handleAddPet() {
        setPetLoading(true);
        setPetError("");
        setPetSuccess("");
        if (!petName.trim() || !petOwnerId) {
            setPetError("Pet name and owner are required.");
            setPetLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append("name", petName.trim());
        formData.append("clientId", petOwnerId);
        if (petSpecies) formData.append("species", petSpecies);
        if (petBreed) formData.append("breed", petBreed);
        if (petAge) formData.append("age", petAge);

        const result = await createPet(formData);
        if (result.error) {
            setPetError(result.error);
        } else {
            setPetSuccess(`Pet "${petName}" registered! Refresh to see them in the patient list.`);
            setPetName("");
            setPetSpecies("");
            setPetBreed("");
            setPetAge("");
            setPetOwnerId("");
        }
        setPetLoading(false);
    }

    async function action(formData: FormData) {
        setIsLoading(true);
        setError("");

        if (!selectedPetId) {
            setError("Please select a pet.");
            setIsLoading(false);
            return;
        }

        formData.append("petId", selectedPetId);
        const result = await submitStaffIntake(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setOpen(false);
            setSelectedPetId("");
            setPurpose("");
        }
        setIsLoading(false);
    }

    const selectedPet = pets.find((pet) => pet.id === selectedPetId);
    const isGrooming = purpose.toLowerCase().includes("grooming");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg transition-all hover:scale-105 active:scale-95">
                    <ClipboardList className="mr-2 h-4 w-4" /> Add Client Form
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
                <form action={action} className="space-y-6">
                    <DialogHeader className="border-b pb-4">
                        <DialogTitle className="text-2xl font-extrabold flex items-center gap-2">
                            <ClipboardList className="h-6 w-6 text-primary" />
                            Add Client Form
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                            Register a new client, add their pet, and capture vitals for clinical intake.
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20 font-medium">
                            {error}
                        </div>
                    )}

                    {/* ==================== QUICK REGISTER CLIENT ==================== */}
                    <div className="space-y-3 border rounded-lg p-4 bg-muted/20">
                        <button
                            type="button"
                            onClick={() => setShowAddClient(!showAddClient)}
                            className="flex items-center gap-2 text-sm font-bold text-primary hover:underline w-full text-left"
                        >
                            <UserPlus className="h-4 w-4" />
                            {showAddClient ? "Hide" : "Step 1: Register New Client (if not yet in system)"}
                        </button>
                        {showAddClient && (
                            <div className="space-y-3 pt-2 animate-in fade-in duration-300">
                                {clientError && <div className="text-sm text-destructive font-medium bg-destructive/10 p-2 rounded">{clientError}</div>}
                                {clientSuccess && <div className="text-sm text-green-700 dark:text-green-400 font-medium bg-green-50 dark:bg-green-950/30 p-2 rounded">{clientSuccess}</div>}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold">Full Name *</Label>
                                        <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Juan Dela Cruz" className="h-8 text-sm" required />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold text-primary">Phone (Req. for AI SMS) *</Label>
                                        <Input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="09171234567" className="h-8 text-sm border-primary/30 outline-primary" required />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold">Email</Label>
                                        <Input value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="email@example.com" className="h-8 text-sm" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold">Address</Label>
                                        <Input value={clientAddress} onChange={e => setClientAddress(e.target.value)} placeholder="Subdivision, City" className="h-8 text-sm" />
                                    </div>
                                </div>
                                <Button type="button" size="sm" onClick={handleAddClient} disabled={clientLoading} className="w-full">
                                    {clientLoading ? "Saving..." : "Save Client"}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* ==================== QUICK REGISTER PET ==================== */}
                    <div className="space-y-3 border rounded-lg p-4 bg-muted/20">
                        <button
                            type="button"
                            onClick={() => setShowAddPet(!showAddPet)}
                            className="flex items-center gap-2 text-sm font-bold text-primary hover:underline w-full text-left"
                        >
                            <PawPrint className="h-4 w-4" />
                            {showAddPet ? "Hide" : "Step 2: Register New Pet (if not yet in system)"}
                        </button>
                        {showAddPet && (
                            <div className="space-y-3 pt-2 animate-in fade-in duration-300">
                                {petError && <div className="text-sm text-destructive font-medium bg-destructive/10 p-2 rounded">{petError}</div>}
                                {petSuccess && <div className="text-sm text-green-700 dark:text-green-400 font-medium bg-green-50 dark:bg-green-950/30 p-2 rounded">{petSuccess}</div>}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold">Owner *</Label>
                                    <Popover open={ownerComboOpen} onOpenChange={setOwnerComboOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between text-sm h-8">
                                                {petOwnerId ? clients.find(c => c.id === petOwnerId)?.name : "Select owner..."}
                                                <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0 z-[100]">
                                            <Command>
                                                <CommandInput placeholder="Search owner..." />
                                                <CommandList>
                                                    <CommandEmpty>No owner found. Register one first.</CommandEmpty>
                                                    <CommandGroup>
                                                        {clients.map(c => (
                                                            <CommandItem key={c.id} value={c.name} onSelect={() => { setPetOwnerId(c.id); setOwnerComboOpen(false); }}>
                                                                <Check className={cn("mr-2 h-4 w-4", petOwnerId === c.id ? "opacity-100" : "opacity-0")} />
                                                                {c.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold">Pet Name *</Label>
                                        <Input value={petName} onChange={e => setPetName(e.target.value)} placeholder="Bantay" className="h-8 text-sm" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold">Species</Label>
                                        <Input value={petSpecies} onChange={e => setPetSpecies(e.target.value)} placeholder="Dog, Cat" className="h-8 text-sm" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold">Breed</Label>
                                        <Input value={petBreed} onChange={e => setPetBreed(e.target.value)} placeholder="Shih Tzu" className="h-8 text-sm" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold">Age (yrs)</Label>
                                        <Input value={petAge} onChange={e => setPetAge(e.target.value)} placeholder="2" className="h-8 text-sm" />
                                    </div>
                                </div>
                                <Button type="button" size="sm" onClick={handleAddPet} disabled={petLoading} className="w-full">
                                    {petLoading ? "Saving..." : "Save Pet"}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* ==================== CLINICAL INTAKE (Step 3) ==================== */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground">Step 3: Clinical Intake Record</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="petId" className="text-sm font-bold flex items-center gap-1">
                                    Patient (Pet) <span className="text-destructive">*</span>
                                </Label>
                                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={comboboxOpen}
                                            className="w-full justify-between border-primary/20 hover:border-primary/40"
                                        >
                                            {selectedPet
                                                ? `${selectedPet.name} (${selectedPet.owner?.firstName} ${selectedPet.owner?.lastName})`
                                                : "Search patient list..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0 z-[100]">
                                        <Command>
                                            <CommandInput placeholder="Search name or owner..." />
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
                                                                    "mr-2 h-4 w-4 text-primary",
                                                                    selectedPetId === pet.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="font-bold">{pet.name}</span>
                                                                <span className="text-xs text-muted-foreground">Owner: {pet.owner?.firstName} {pet.owner?.lastName}</span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="serviceType" className="text-sm font-bold flex items-center gap-1">
                                    Purpose of Visit <span className="text-destructive">*</span>
                                </Label>
                                <Input 
                                    id="serviceType" 
                                    name="serviceType" 
                                    placeholder="e.g. Consultation, Grooming, Vaccination" 
                                    className="border-primary/20 focus:border-primary ring-offset-background"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Vitals (Physical Exam Parameters) */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <HeartPulse className="h-4 w-4 text-primary" />
                            Physical Exam / Signalment
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase">Weight</Label>
                                <Input name="weight" placeholder="kg" className="h-8 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase">Temp</Label>
                                <Input name="temperature" placeholder="°C" className="h-8 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase">Heart Rate</Label>
                                <Input name="heartRate" placeholder="bpm" className="h-8 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase">Resp. Rate</Label>
                                <Input name="respRate" placeholder="br/m" className="h-8 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase">CRT</Label>
                                <Input name="crt" placeholder="sec" className="h-8 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase">Stool Consistency/Color</Label>
                                <Input name="stool" placeholder="Normal, soft, etc." className="h-8 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold uppercase">Urine Consistency/Color</Label>
                                <Input name="urine" placeholder="Clear, dark, etc." className="h-8 text-xs" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Complaints & History */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold">Chief Complaint/s</Label>
                            <Textarea 
                                name="chiefComplaint" 
                                placeholder="State the reason/s for visit as described by the owner..." 
                                className="min-h-[60px] text-sm border-primary/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold">Medical History</Label>
                            <Textarea 
                                name="medicalHistory" 
                                placeholder="Previous conditions, recurring issues, allergies..." 
                                className="min-h-[60px] text-sm border-primary/10"
                            />
                        </div>
                    </div>

                    {/* Section 4: Vaccination History Checklist */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            Vaccination / Deworming History
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border p-3 rounded-lg bg-muted/30">
                            {[
                                { id: "vaxRabies", label: "Rabies" },
                                { id: "vax5in1", label: "5 in 1" },
                                { id: "vaxLepto", label: "Leptospirosis" },
                                { id: "vaxCorona", label: "Corona Virus" },
                                { id: "vaxKennelCough", label: "Kennel Cough" },
                            ].map((vax) => (
                                <label key={vax.id} className="flex items-center gap-2 cursor-pointer hover:bg-background/50 p-1 rounded transition-colors">
                                    <input type="checkbox" name={vax.id} className="accent-primary h-4 w-4" />
                                    <span className="text-xs font-medium">{vax.label}</span>
                                </label>
                            ))}
                            <div className="col-span-full mt-2">
                                <Label className="text-[10px] font-bold uppercase">Others</Label>
                                <Input name="vaxOthers" placeholder="Other vaccines or deworming details" className="h-7 text-[10px]" />
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Grooming Consent (Dynamic) */}
                    {isGrooming && (
                        <div className="space-y-4 pt-4 border-t animate-in fade-in duration-500">
                            <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-900 rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <FileSignature className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                                    <h3 className="font-bold text-yellow-800 dark:text-yellow-400">Sedation for Grooming Consent</h3>
                                </div>
                                <p className="text-[10px] text-yellow-700 dark:text-yellow-600 mb-3 leading-relaxed italic">
                                    I certify that I am the owner and responsible party... I have been informed of the risks of sedation... and will not hold the clinic/staff responsible for any related injuries.
                                </p>
                                <label className="flex items-center gap-3 bg-white dark:bg-black/40 p-3 rounded-lg group cursor-pointer border border-yellow-300 dark:border-yellow-900 hover:shadow-md transition-all">
                                    <input type="checkbox" name="consentedToSedation" className="accent-yellow-600 h-5 w-5" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-yellow-900 dark:text-yellow-300 group-hover:text-yellow-600 transition-colors">Owner has Signed Agreement</span>
                                        <span className="text-[10px] text-yellow-700/60 font-medium uppercase tracking-tighter">Verified Paper Signature</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-6 border-t font-bold">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => setOpen(false)}
                            className="bg-muted/50 hover:bg-muted text-muted-foreground"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-primary text-primary-foreground min-w-[140px] shadow-lg shadow-primary/20"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" />
                                    Processing...
                                </span>
                            ) : (
                                "Forward to Vet"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
