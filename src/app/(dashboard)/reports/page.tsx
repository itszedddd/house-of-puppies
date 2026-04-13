import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Activity, DollarSign, Package, Stethoscope, Pill, PawPrint, Users, AlertTriangle, Calendar } from "lucide-react";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
    const session = await auth();
    if (!session?.user || !["owner", "vet_admin"].includes((session.user as any).role)) {
        redirect("/login");
    }

    let totalPatients = 0;
    let totalClients = 0;
    let servicesDelivered = 0;
    let completedServices = 0;
    let totalRevenue = 0;
    let lowStockItemsData: any[] = [];
    let activities: any[] = [];
    let serviceBreakdown: { name: string; count: number; revenue: number }[] = [];

    try {
        totalPatients = await prisma.pet.count();
        totalClients = await prisma.petOwner.count();
        servicesDelivered = await prisma.clinicalRecord.count();

        const completedRecords = await prisma.clinicalRecord.findMany({
            where: { status: "Completed" },
            include: { purpose: true }
        });
        completedServices = completedRecords.length;
        totalRevenue = completedRecords.reduce((sum, r) => sum + (r.price || 0), 0);

        // Service breakdown by purpose
        const purposeMap = new Map<string, { count: number; revenue: number }>();
        for (const r of completedRecords) {
            const pName = r.purpose?.name || "Other";
            const existing = purposeMap.get(pName) || { count: 0, revenue: 0 };
            purposeMap.set(pName, { count: existing.count + 1, revenue: existing.revenue + (r.price || 0) });
        }
        serviceBreakdown = Array.from(purposeMap.entries())
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.revenue - a.revenue);

        lowStockItemsData = await prisma.inventory.findMany({
            where: { stock: { lte: 10 } },
            include: { itemType: true },
            orderBy: { stock: "asc" }
        });

        const recentRecords = await prisma.clinicalRecord.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { pet: { include: { owner: true } }, purpose: true }
        });

        const recentPrescriptions = await prisma.prescriptionRecord.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { record: { include: { pet: true } } }
        });

        activities = [
            ...recentRecords.map(r => ({
                id: `rec-${r.id}`,
                title: r.pet.name,
                owner: r.pet.owner ? `${r.pet.owner.firstName} ${r.pet.owner.lastName}` : "—",
                description: r.purpose?.name || "Visit",
                status: r.status,
                price: r.price,
                date: r.createdAt,
                type: 'Service' as const
            })),
            ...recentPrescriptions.map(p => ({
                id: `pres-${p.id}`,
                title: p.record.pet.name,
                owner: "",
                description: p.medicationName,
                status: "Prescribed",
                price: null as number | null,
                date: p.createdAt,
                type: 'Prescription' as const
            }))
        ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 12);
    } catch (e) {
        console.error("[DB] ReportsPage failed:", e);
    }

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Clinic Reports</h1>
                    <p className="text-muted-foreground text-sm mt-1">Overview of clinic performance, activity, and inventory alerts.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">From {completedServices} completed visits</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <PawPrint className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPatients}</div>
                        <p className="text-xs text-muted-foreground">Registered pets</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalClients}</div>
                        <p className="text-xs text-muted-foreground">Pet owners</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">All Records</CardTitle>
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{servicesDelivered}</div>
                        <p className="text-xs text-muted-foreground">All time clinical records</p>
                    </CardContent>
                </Card>
                <Card className={lowStockItemsData.length > 0 ? "border-red-200 dark:border-red-900" : ""}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${lowStockItemsData.length > 0 ? "text-red-600" : ""}`}>{lowStockItemsData.length}</div>
                        <p className="text-xs text-muted-foreground">Items low on stock (≤10)</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Service Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Service Breakdown</CardTitle>
                        <CardDescription>Revenue and volume by service type.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {serviceBreakdown.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No completed services yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {serviceBreakdown.map(s => (
                                    <div key={s.name} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="capitalize">{s.name}</Badge>
                                            <span className="text-xs text-muted-foreground">{s.count} visits</span>
                                        </div>
                                        <span className="font-bold text-sm">₱{s.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Low Stock Inventory */}
                <Card className={lowStockItemsData.length > 0 ? "border-red-200 dark:border-red-900" : ""}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {lowStockItemsData.length > 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            Inventory Alerts
                        </CardTitle>
                        <CardDescription>Items with critically low stock levels (≤10 units).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {lowStockItemsData.length === 0 ? (
                            <p className="text-sm text-muted-foreground">✅ All items are in good stock.</p>
                        ) : (
                            <div className="space-y-3">
                                {lowStockItemsData.map(item => (
                                    <div key={item.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium">{item.itemName}</p>
                                            <p className="text-xs text-muted-foreground">{item.itemType?.name || "General"}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="destructive" className="text-xs">{item.stock} {item.unit}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Log */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity Log</CardTitle>
                    <CardDescription>Latest clinical records and prescriptions across the clinic.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activities.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-6">No recent activity.</TableCell>
                                    </TableRow>
                                ) : (
                                    activities.map(activity => (
                                        <TableRow key={activity.id}>
                                            <TableCell>
                                                <Badge variant={activity.type === "Prescription" ? "secondary" : "outline"} className="text-[10px] whitespace-nowrap">
                                                    {activity.type === "Prescription" ? <Pill className="h-3 w-3 mr-1" /> : <Stethoscope className="h-3 w-3 mr-1" />}
                                                    {activity.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">{activity.title}</TableCell>
                                            <TableCell className="text-sm">{activity.description}</TableCell>
                                            <TableCell>
                                                <Badge variant={activity.status === "Completed" ? "default" : activity.status === "Prescribed" ? "secondary" : "outline"} className="text-[10px]">
                                                    {activity.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-bold text-sm">
                                                {activity.price != null ? `₱${activity.price.toFixed(2)}` : "—"}
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                                                {activity.date.toLocaleDateString()} {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
