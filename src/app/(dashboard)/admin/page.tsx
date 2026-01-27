"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPets } from "@/lib/data";
import { Activity, Users, DollarSign, CalendarCheck } from "lucide-react";

export default function AdminPage() {
    const activePets = mockPets.filter((p) => p.status !== "Completed").length;
    const readyPets = mockPets.filter((p) => p.status === "Ready").length;

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$1,234.56</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Pets</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activePets}</div>
                        <p className="text-xs text-muted-foreground">Currently in shop</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{readyPets}</div>
                        <p className="text-xs text-muted-foreground">Notify owners</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12</div>
                        <p className="text-xs text-muted-foreground">New today</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Pets in Shop</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Ticket ID</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Pet</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Owner</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Service</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {mockPets.map((pet) => (
                                    <tr key={pet.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">{pet.id}</td>
                                        <td className="p-4 align-middle">{pet.name} ({pet.breed})</td>
                                        <td className="p-4 align-middle">{pet.ownerName}</td>
                                        <td className="p-4 align-middle">{pet.service}</td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold
                                        ${pet.status === 'Ready' ? 'bg-green-100 text-green-800' : ''}
                                        ${pet.status === 'Grooming' ? 'bg-blue-100 text-blue-800' : ''}
                                        ${pet.status === 'Washing' ? 'bg-blue-100 text-blue-800' : ''}
                                        ${pet.status === 'Pending' ? 'bg-gray-100 text-gray-800' : ''}
                                        ${pet.status === 'Completed' ? 'bg-gray-100 text-gray-800 opacity-50' : ''}
                                    `}>
                                                {pet.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
