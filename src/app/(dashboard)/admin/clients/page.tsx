import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import ClientForm from "./client-form";

export default async function AdminClientsPage() {
    const clients = await prisma.client.findMany({
        orderBy: { createdAt: "desc" },
        include: { pets: true }
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Clients</h1>
                <ClientForm />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Client Directory</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-64">ID</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Contact</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Pets</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {clients.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                            No clients found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                                {clients.map((client) => (
                                    <tr key={client.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-mono text-xs">{client.id}</td>
                                        <td className="p-4 align-middle font-medium">{client.name}</td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {client.phone && <div>{client.phone}</div>}
                                            {client.email && <div>{client.email}</div>}
                                            {!client.phone && !client.email && <span>-</span>}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                                                {client.pets.length} pets
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right text-muted-foreground">
                                            {new Date(client.createdAt).toLocaleDateString()}
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
