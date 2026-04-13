import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import ClientForm from "./client-form";
import ClientActions from "./client-actions";

import SearchSort from "../search-sort";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const search = typeof params?.search === 'string' ? params.search : undefined;
    const sortBy = typeof params?.sortBy === 'string' ? params.sortBy : 'createdAt';
    const sortDir = typeof params?.sortDir === 'string' ? params.sortDir : 'desc';

    // Build valid sortable keys
    const validSortKeys = ['firstName', 'createdAt'] as const;
    type SortKey = typeof validSortKeys[number];
    const sortField: SortKey = validSortKeys.includes(sortBy as SortKey) ? (sortBy as SortKey) : 'createdAt';

    let clients: any[] = [];
    try {
        clients = await prisma.petOwner.findMany({
            where: search ? {
                OR: [
                    { firstName: { contains: search } },
                    { lastName: { contains: search } },
                    { email: { contains: search } },
                    { contactNumber: { contains: search } }
                ]
            } : undefined,
            orderBy: { [sortField]: sortDir as 'asc' | 'desc' },
            include: { pets: true }
        });
    } catch (e) {
        console.error("[DB] AdminClientsPage failed:", e);
    }

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
                    <SearchSort
                        sortOptions={[
                            { label: 'Name', value: 'firstName' },
                            { label: 'Date Added', value: 'createdAt' },
                        ]}
                        defaultSort="createdAt"
                        searchPlaceholder="Search by name, email or contact..."
                    />
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-64">ID</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Contact</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Pets</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Registered</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {clients.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                            No clients found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                                {clients.map((client: any) => (
                                    <tr key={client.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-mono text-xs">{client.id}</td>
                                        <td className="p-4 align-middle font-medium">{client.firstName} {client.lastName}</td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {client.contactNumber && <div>{client.contactNumber}</div>}
                                            {client.email && <div>{client.email}</div>}
                                            {!client.contactNumber && !client.email && <span>-</span>}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                                                {client.pets.length} pets
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {new Date(client.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <ClientActions client={client} />
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
