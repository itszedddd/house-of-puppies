"use client";

import { useState } from "react";
import { Clock, Phone, Check, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RemindersTable({ reminders, sendSmsReminder }: { reminders: any[], sendSmsReminder: (fd: FormData) => void }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredReminders = reminders.filter(r => {
        if (!searchQuery) return true;
        
        const q = searchQuery.toLowerCase();
        const petName = (r.record?.pet?.name || "").toLowerCase();
        const ownerName = `${r.record?.pet?.owner?.firstName || ""} ${r.record?.pet?.owner?.lastName || ""}`.toLowerCase();
        const phone = (r.record?.pet?.owner?.contactNumber || "").toLowerCase();
        const message = (r.message || "").toLowerCase();

        return petName.includes(q) || ownerName.includes(q) || phone.includes(q) || message.includes(q);
    });

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by Pet Name, Owner Name, Number or Content..."
                    className="pl-9 bg-background/50 border-primary/20 max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            {filteredReminders.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground flex flex-col items-center bg-muted/20 rounded-lg">
                    <Search className="h-10 w-10 mb-3 opacity-20" />
                    <p>No reminders match your search.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-4 py-3 min-w-[150px]">Pet / Client</th>
                                <th className="px-4 py-3 min-w-[200px]">AI Message Content</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Scheduled Date</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReminders.map(r => (
                                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20 align-top">
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-primary">{r.record?.pet?.name || "Unknown"}</div>
                                        <div className="text-xs text-muted-foreground">{r.record?.pet?.owner?.firstName} {r.record?.pet?.owner?.lastName}</div>
                                        <div className="text-[10px] flex items-center gap-1 mt-1 text-muted-foreground">
                                            <Phone className="h-2 w-2" />
                                            {r.record?.pet?.owner?.contactNumber || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="bg-background border rounded p-2 text-xs italic text-muted-foreground max-w-sm line-clamp-3 hover:line-clamp-none transition-all">
                                            {r.message || "No custom message. System default will be applied."}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant="outline" className="text-[10px] capitalize">
                                            {r.reminderType?.name?.replace("_", " ")}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-xs">
                                        {new Date(r.reminderDate).toLocaleDateString()} <br/>
                                        <span className="text-muted-foreground">at {new Date(r.reminderDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {r.smsStatus?.name === "pending" ? (
                                            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                                                <Clock className="h-3 w-3 mr-1" /> Pending
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                                <Check className="h-3 w-3 mr-1" /> Sent
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {r.smsStatus?.name === "pending" && (
                                            <form action={sendSmsReminder}>
                                                <input type="hidden" name="id" value={r.id} />
                                                <Button size="sm" type="submit" variant="ghost" className="h-8 text-primary hover:text-primary hover:bg-primary/10">
                                                    Simulate Send
                                                </Button>
                                            </form>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
