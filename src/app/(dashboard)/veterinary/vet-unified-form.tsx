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
import { HeartPulse, History, ShieldCheck, FileSignature, Stethoscope, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VetUnifiedFormProps {
    recordId: string;
    petName: string;
    intakeData?: any;
    medications?: any[];
}

export default function VetUnifiedForm({ recordId, petName, intakeData, medications = [] }: VetUnifiedFormProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [prescriptions, setPrescriptions] = useState([{ medicationName: "", dosage: "", instructions: "" }]);

    const addPrescription = () => {
        setPrescriptions([...prescriptions, { medicationName: "", dosage: "", instructions: "" }]);
    };

    const removePrescription = (idx: number) => {
        setPrescriptions(prescriptions.filter((_, i) => i !== idx));
    };

    const updatePrescription = (idx: number, field: string, value: string) => {
        const newRx = [...prescriptions];
        newRx[idx] = { ...newRx[idx], [field]: value };
        setPrescriptions(newRx);
    };

    async function action(formData: FormData) {
        setIsLoading(true);
        setError("");

        // Pass prescriptions as JSON string
        formData.append("prescriptions", JSON.stringify(prescriptions.filter(p => p.medicationName.trim() !== "")));

        const result = await completeVetRecord(recordId, formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setShowSuccess(true);
            // Auto-close after 2 seconds and open print window
            setTimeout(() => {
                setShowSuccess(false);
                setOpen(false);
                window.open(`/veterinary/print-rx/${recordId}`, '_blank');
            }, 2000);
        }
        setIsLoading(false);
    }

    return (
        <>
            {/* Success Popup */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-[400px]">
                    <div className="flex flex-col items-center justify-center py-8 gap-4">
                        <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-in zoom-in-50 duration-300">
                            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-black text-center">Record Completed Successfully!</h2>
                        <p className="text-sm text-muted-foreground text-center">
                            {petName}'s diagnosis has been saved. Opening prescription print view...
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Examination Form */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="font-bold">
                        <Stethoscope className="mr-2 h-4 w-4" /> Examine
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
                    <form action={action} className="space-y-6">
                        <DialogHeader className="border-b pb-4">
                            <DialogTitle className="text-2xl font-black">Examination: {petName}</DialogTitle>
                            <DialogDescription>
                                Review staff intake data and complete the diagnostic/treatment record.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Left Side: Intake Data Review */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-xl border border-primary/10">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase text-primary flex items-center gap-2">
                                    <HeartPulse className="h-4 w-4" /> Vitals & Vitals
                                </h3>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-background p-2 rounded border">
                                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Weight</span>
                                        <span className="font-medium">{intakeData?.weight || "---"} kg</span>
                                    </div>
                                    <div className="bg-background p-2 rounded border">
                                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Temp</span>
                                        <span className="font-medium">{intakeData?.temperature || "---"} °C</span>
                                    </div>
                                    <div className="bg-background p-2 rounded border">
                                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Heart Rate</span>
                                        <span className="font-medium">{intakeData?.heartRate || "---"} bpm</span>
                                    </div>
                                    <div className="bg-background p-2 rounded border">
                                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Resp. Rate</span>
                                        <span className="font-medium">{intakeData?.respRate || "---"} br/m</span>
                                    </div>
                                </div>

                                <h3 className="text-xs font-black uppercase text-primary flex items-center gap-2 pt-2">
                                    <ShieldCheck className="h-4 w-4" /> Vaccination Status
                                </h3>
                                <div className="flex flex-wrap gap-1">
                                    {intakeData?.vaxRabies && <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Rabies</span>}
                                    {intakeData?.vax5in1 && <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">5-in-1</span>}
                                    {intakeData?.vaxLepto && <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Lepto</span>}
                                    {intakeData?.vaxCorona && <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Corona</span>}
                                    {intakeData?.vaxKennelCough && <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Kennel Cough</span>}
                                    {!intakeData?.vaxRabies && !intakeData?.vax5in1 && !intakeData?.vaxLepto && !intakeData?.vaxCorona && !intakeData?.vaxKennelCough && (
                                        <span className="text-[10px] italic text-muted-foreground">No recent vaccines logged</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase text-primary flex items-center gap-2">
                                    <History className="h-4 w-4" /> Observations
                                </h3>
                                <div className="text-xs space-y-2">
                                    <div>
                                        <span className="font-bold block uppercase text-[9px] text-muted-foreground">Chief Complaint</span>
                                        <p className="bg-background p-2 rounded border italic">{intakeData?.chiefComplaint || "No complaint logged"}</p>
                                    </div>
                                    <div>
                                        <span className="font-bold block uppercase text-[9px] text-muted-foreground">Medical History</span>
                                        <p className="bg-background p-2 rounded border italic">{intakeData?.medicalHistory || "None provided"}</p>
                                    </div>
                                </div>
                                {intakeData?.consentedToSedation && (
                                    <div className="bg-yellow-100 border border-yellow-300 p-2 rounded-lg flex items-center gap-2">
                                        <FileSignature className="h-4 w-4 text-yellow-700" />
                                        <span className="text-[10px] font-black text-yellow-800 uppercase">Sedation Consent Signed</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-4 py-4 pt-4 border-t">
                            {error && <div className="text-sm text-destructive font-bold">{error}</div>}
                            
                            <div className="space-y-2">
                                <Label htmlFor="diagnosis" className="font-bold text-sm">Veterinary Diagnosis</Label>
                                <Textarea id="diagnosis" name="diagnosis" placeholder="What is your professional diagnosis?" className="min-h-[100px] border-primary/20" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="treatment" className="font-bold text-sm">Treatment</Label>
                                <Textarea id="treatment" name="treatment" placeholder="Detail the treatment, procedures, and next steps..." className="min-h-[80px] border-primary/20" required />
                            </div>

                            <div className="space-y-3 bg-muted/10 p-4 rounded border">
                                <div className="flex justify-between items-center">
                                    <Label className="font-bold text-sm text-primary">Prescriptions (Rx)</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addPrescription}>+ Add Rx</Button>
                                </div>
                                {prescriptions.map((rx, idx) => (
                                    <div key={idx} className="flex gap-2 items-start border p-2 rounded bg-background">
                                        <div className="grid flex-1 gap-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <Input 
                                                    list="medications-list" 
                                                    placeholder="Medication Name (Select or Type)" 
                                                    value={rx.medicationName} 
                                                    onChange={(e) => updatePrescription(idx, 'medicationName', e.target.value)} 
                                                    className="h-8 text-sm flex-1" 
                                                />
                                                {(() => {
                                                    const med = medications.find(m => m.itemName?.toLowerCase() === rx.medicationName?.toLowerCase());
                                                    if (med && med.stock <= 5) {
                                                        return <Badge variant="destructive" className="shrink-0 text-[10px] h-6 py-0 flex items-center">Low on stocks ({med.stock})</Badge>;
                                                    }
                                                    return null;
                                                })()}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input placeholder="Dosage (e.g. 1 tab)" value={rx.dosage} onChange={(e) => updatePrescription(idx, 'dosage', e.target.value)} className="h-8 text-sm" />
                                                <Input placeholder="Instructions (e.g. 2x a day)" value={rx.instructions} onChange={(e) => updatePrescription(idx, 'instructions', e.target.value)} className="h-8 text-sm" />
                                            </div>
                                        </div>
                                        <Button type="button" variant="ghost" size="sm" className="text-destructive h-8" onClick={() => removePrescription(idx)}>X</Button>
                                    </div>
                                ))}
                                <datalist id="medications-list">
                                    {medications.map(med => (
                                        <option key={med.id} value={med.itemName} />
                                    ))}
                                </datalist>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price" className="font-bold text-sm">Final Bill Amount (₱)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground font-bold">₱</span>
                                    <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00" className="pl-8 border-primary/20 font-black text-lg" required />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading} className="min-w-[180px] font-bold">
                                {isLoading ? "Saving..." : "Finalize & Print Rx"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
