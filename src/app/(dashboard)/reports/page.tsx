import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPets, mockInventory } from "@/lib/data";
import { BarChart, Activity, DollarSign, Package } from "lucide-react";

export default function ReportsPage() {
    const totalPatients = mockPets.length;
    const vetPatients = mockPets.filter(p => p.service === "Veterinary").length;
    const groomingPatients = mockPets.filter(p => p.service === "Grooming").length;
    const lowStockItems = mockInventory.filter(i => i.status === "Low").length;

    return (
        <div className="grid gap-6">
            <h1 className="text-lg font-semibold md:text-2xl">Clinic Reports</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue (Est)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₱45,231.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPatients}</div>
                        <p className="text-xs text-muted-foreground">{vetPatients} Vet / {groomingPatients} Grooming</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockItems}</div>
                        <p className="text-xs text-muted-foreground">Items low on stock</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Services Delivered</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">Since start of year</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {mockPets.slice(0, 5).map(pet => (
                                <div key={pet.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{pet.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {pet.service} - {pet.status}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        {pet.checkInTime}
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
                            {mockInventory.filter(i => i.status === "Low").map(item => (
                                <div key={item.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.stock} {item.unit} remaining
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-destructive">
                                        Restock
                                    </div>
                                </div>
                            ))}
                            {mockInventory.filter(i => i.status === "Low").length === 0 && (
                                <p className="text-sm text-muted-foreground">All items in good stock.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
