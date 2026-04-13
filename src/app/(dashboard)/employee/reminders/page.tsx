import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Clock, RefreshCw, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { CreateReminderDialog } from "./create-reminder-dialog";
import { RemindersTable } from "./reminders-table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function EmployeeRemindersPage() {
    const session = await auth();
    if (!session?.user || !["staff_sms", "vet_admin"].includes((session.user as any).role)) {
        redirect("/login");
    }

    const reminders = await prisma.smsReminder.findMany({
        include: {
            record: {
                include: {
                    pet: {
                        include: { owner: true }
                    }
                }
            },
            reminderType: true,
            smsStatus: true,
        },
        orderBy: { reminderDate: 'desc' }
    });

    const pendingCount = reminders.filter(r => r.smsStatus?.name === 'pending').length;
    const sentCount = reminders.filter(r => r.smsStatus?.name === 'sent').length;

    // Fetch records and types for the creation dialog
    const rawRecords = await prisma.clinicalRecord.findMany({
        take: 200,
        orderBy: { visitDate: 'desc' },
        include: {
            pet: { include: { owner: true } }
        }
    });

    const uniqueRecordsMap = new Map();
    for (const record of rawRecords) {
        if (!uniqueRecordsMap.has(record.petId)) {
            uniqueRecordsMap.set(record.petId, record);
        }
    }
    const recentRecords = Array.from(uniqueRecordsMap.values()).slice(0, 50);
    
    // Auto-seed ReminderTypes if they don't exist, to populate the select dropdown
    let types = await prisma.reminderType.findMany();
    if (types.length === 0) {
        await prisma.reminderType.createMany({
            data: [
                { name: "follow_up" },
                { name: "vaccination_due" },
                { name: "lab_test_sched" },
                { name: "grooming" },
            ]
        });
        types = await prisma.reminderType.findMany();
    }

    // A simulated server action to send mock SMS
    async function sendSmsReminder(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        if (!id) return;

        // Ensure "sent" status exists and update
        const sentStatus = await prisma.smsStatus.upsert({
            where: { name: 'sent' },
            update: {},
            create: { name: 'sent' }
        });

        await prisma.smsReminder.update({
            where: { id },
            data: { smsStatusId: sentStatus.id }
        });

        revalidatePath("/employee/reminders");
    }

    // A simulated server action to send bulk pending SMS
    async function sendBulkSms() {
        "use server";
        const sentStatus = await prisma.smsStatus.upsert({
            where: { name: 'sent' },
            update: {},
            create: { name: 'sent' }
        });

        const pendingStatus = await prisma.smsStatus.findFirst({ where: { name: 'pending' } });
        if (pendingStatus) {
            await prisma.smsReminder.updateMany({
                where: { smsStatusId: pendingStatus.id },
                data: { smsStatusId: sentStatus.id }
            });
        }

        revalidatePath("/employee/reminders");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between flex-wrap gap-4 items-center">
                <h1 className="text-3xl font-black text-primary flex items-center gap-2">
                    <MessageSquare className="h-8 w-8 text-secondary" />
                    AI SMS Reminders
                </h1>
                <div className="flex gap-2">
                    <CreateReminderDialog records={recentRecords} types={types} />
                    <form action={sendBulkSms}>
                        <Button type="submit" disabled={pendingCount === 0} className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
                            <Send className="w-4 h-4 mr-2" />
                            Dispatch Pending ({pendingCount})
                        </Button>
                    </form>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-primary/20 shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Total Sent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary">{sentCount}</div>
                    </CardContent>
                </Card>

                <Card className="bg-secondary/5 border-secondary/20 shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Pending Dispatches</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-secondary">{pendingCount}</div>
                    </CardContent>
                </Card>

                <Card className="bg-muted/50 border-muted shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Delivery Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-muted-foreground">
                            {reminders.length > 0 ? Math.round((sentCount / reminders.length) * 100) : 0}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Reminder Queue</CardTitle>
                    <CardDescription>All scheduled and dispatched SMS notifications</CardDescription>
                </CardHeader>
                <CardContent>
                    <RemindersTable reminders={reminders} sendSmsReminder={sendSmsReminder} />
                </CardContent>
            </Card>
        </div>
    );
}

// Ensure Check is imported or replace with simple span. Let me fix the missing Check import above.
