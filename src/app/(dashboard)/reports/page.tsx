import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { BarChart, Activity, DollarSign, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
    const totalPatients = await prisma.pet.count();
    const servicesDelivered = await prisma.clinicalRecord.count();

    const lowStockItemsData = await prisma.inventory.findMany({
        where: { stock: { lte: 10 } } // changed from status: "Low" to stock threshold
    });
    const lowStockItemsCount = lowStockItemsData.length;

    // Fetch Recent Activities
    const recentRecords = await prisma.clinicalRecord.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { pet: true, purpose: true }
    });

    const recentPrescriptions = await prisma.prescriptionRecord.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { record: { include: { pet: true } } }
    });

    // Combine and sort by date
    const activities = [
        ...recentRecords.map(r => ({
            id: `rec-${r.id}`,
            title: r.pet.name,
            description: `Purpose: ${r.purpose?.name || "Check-up"} - ${r.status}`,
            date: r.createdAt,
            type: 'Service'
        })),
        ...recentPrescriptions.map(p => ({
            id: `pres-${p.id}`,
            title: p.record.pet.name,
            description: `Prescription: ${p.medicationName}`,
            date: p.createdAt,
            type: 'Prescription'
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 7);

    // Calculate actual revenue
    const totalRevenue = 0; // Price calculation removed in new schema

    return (
        <div className="grid gap-6">
            <h1 className="text-lg font-semibold md:text-2xl">Clinic Reports</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Based on recorded services</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPatients}</div>
                        <p className="text-xs text-muted-foreground">Registered in system</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockItemsCount}</div>
                        <p className="text-xs text-muted-foreground">Items low on stock</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Services Delivered</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{servicesDelivered}</div>
                        <p className="text-xs text-muted-foreground">All time records</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Veterinary & Grooming Activity</CardTitle>
                        <CardDescription>Latest services, prescriptions, and vaccinations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {activities.length === 0 && (
                                <p className="text-sm text-muted-foreground">No recent activity found.</p>
                            )}
                            {activities.map(activity => (
                                <div key={activity.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{activity.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {activity.description}
                                        </p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-4">
                                        <span className={`text-xs px-2 py-1 rounded-full border ${activity.type === 'Prescription' ? 'bg-blue-50 text-blue-700' : activity.type === 'Vaccination' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                                            {activity.type}
                                        </span>
                                        <div className="font-medium text-xs text-muted-foreground whitespace-nowrap">
                                            {activity.date.toLocaleDateString()} {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Inventory Quick View</CardTitle>
                        <CardDescription>Critically low items</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {lowStockItemsData.map(item => (
                                <div key={item.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.itemName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.stock} {item.unit} remaining
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-destructive text-sm">
                                        Restock
                                    </div>
                                </div>
                            ))}
                            {lowStockItemsData.length === 0 && (
                                <p className="text-sm text-muted-foreground">All items in good stock.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
