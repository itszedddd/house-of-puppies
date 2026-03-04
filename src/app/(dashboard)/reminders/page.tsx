"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockPets } from "@/lib/data";
import { MessageSquare, Bell } from "lucide-react";

export default function RemindersPage() {
    // Mock pets with upcoming due dates
    const petsWithDueDates = mockPets.filter(p => p.vaccinations.length > 0 || p.service === "Veterinary");

    const handleSendSMS = (petName: string, owner: string) => {
        // Simulation
        alert(`SMS sent to ${owner} (09xxxxxxxxx):\n"Reminder: ${petName} is due for vaccination next week at House of Puppies."`);
    };

    return (
        <div className="grid gap-6">
            <h1 className="text-lg font-semibold md:text-2xl">SMS Reminders & Notifications</h1>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Automated Reminders</CardTitle>
                        <CardDescription>Upcoming vaccinations and check-ups.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {petsWithDueDates.map(pet => (
                                    <TableRow key={pet.id}>
                                        <TableCell className="font-medium">{pet.name}</TableCell>
                                        <TableCell>{pet.ownerName}</TableCell>
                                        <TableCell>
                                            {pet.vaccinations[0]?.nextDueDate || "2026-03-01"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {pet.vaccinations[0]?.name || "Routine Checkup"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="outline" onClick={() => handleSendSMS(pet.name, pet.ownerName)}>
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Notify
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notification Log</CardTitle>
                        <CardDescription>Recent SMS sent by the system.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 text-sm border-b pb-4">
                                <Bell className="mt-1 h-4 w-4 text-primary" />
                                <div>
                                    <p className="font-medium">Vaccination Reminder Sent</p>
                                    <p className="text-muted-foreground">To: John Loyd (Luiz) - 5-in-1 Vaccine</p>
                                    <p className="text-xs text-muted-foreground mt-1">Today, 9:00 AM</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 text-sm border-b pb-4">
                                <Bell className="mt-1 h-4 w-4 text-primary" />
                                <div>
                                    <p className="font-medium">Appointment Confirmation</p>
                                    <p className="text-muted-foreground">To: Kobe Bryant (Mamba) - Grooming</p>
                                    <p className="text-xs text-muted-foreground mt-1">Yesterday, 2:30 PM</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
