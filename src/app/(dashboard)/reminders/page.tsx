import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { MessageSquare, Bell } from "lucide-react";

export default async function RemindersPage() {
    let reminders: any[] = [];
    try {
        reminders = await prisma.smsReminder.findMany({
            include: {
                record: { include: { pet: { include: { owner: true } } } },
                reminderType: true,
                smsStatus: true
            },
            orderBy: { reminderDate: "asc" }
        });
    } catch (e) {
        console.error("[DB] RemindersPage failed:", e);
    }
    const sendAction = async (formData: FormData) => {
        "use server";
        // Here we could integrate real SMS logic
        console.log("Sending SMS to", formData.get("phone"));
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
                                {reminders.map(rem => (
                                    <TableRow key={rem.id}>
                                        <TableCell className="font-medium">{rem.record.pet.name}</TableCell>
                                        <TableCell>{rem.record.pet.owner.firstName} {rem.record.pet.owner.lastName}</TableCell>
                                        <TableCell>
                                            {rem.reminderDate.toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {rem.reminderType.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <form action={sendAction}>
                                                <input type="hidden" name="phone" value={rem.record.pet.owner.contactNumber || ""} />
                                                <Button type="submit" size="sm" variant="outline">
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Notify
                                                </Button>
                                            </form>
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
