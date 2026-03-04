import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, getRecentClients } from "@/app/actions/dashboard";
import { Activity, Users, DollarSign, CalendarCheck } from "lucide-react";

export default async function AdminPage() {
    const stats = await getDashboardStats();
    const recentClients = await getRecentClients();

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.clientCount}</div>
                        <p className="text-xs text-muted-foreground">Registered owners</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Pets</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.petCount}</div>
                        <p className="text-xs text-muted-foreground">Registered pets</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.recordCount}</div>
                        <p className="text-xs text-muted-foreground">Completed services</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.00</div>
                        <p className="text-xs text-muted-foreground">Calculated later</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / List */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Clients</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">ID</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Phone</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Pets</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {recentClients.map((client) => (
                                    <tr key={client.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-mono text-xs">{client.id.slice(-8)}</td>
                                        <td className="p-4 align-middle">{client.name}</td>
                                        <td className="p-4 align-middle">{client.phone || '-'}</td>
                                        <td className="p-4 align-middle">{client.email || '-'}</td>
                                        <td className="p-4 align-middle">
                                            {client.pets.length > 0 ? (
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                                                    {client.pets.length}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">0</span>
                                            )}
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
