import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import PetForm from "./pet-form";
import PetActions from "./pet-actions";

import SearchSort from "../search-sort";

export const dynamic = "force-dynamic";

export default async function AdminPetsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const search = typeof params?.search === 'string' ? params.search : undefined;
    const sortBy = typeof params?.sortBy === 'string' ? params.sortBy : 'createdAt';
    const sortDir = typeof params?.sortDir === 'string' ? params.sortDir : 'desc';

    const validSortKeys = ['name', 'createdAt'] as const;
    type SortKey = typeof validSortKeys[number];
    const sortField: SortKey = validSortKeys.includes(sortBy as SortKey) ? (sortBy as SortKey) : 'createdAt';

    let pets: any[] = [];
    let mappedClients: { id: string; name: string }[] = [];
    try {
        pets = await prisma.pet.findMany({
            where: search ? {
                OR: [
                    { name: { contains: search } },
                    { species: { contains: search } },
                    { breed: { contains: search } },
                    { owner: { firstName: { contains: search } } },
                    { owner: { lastName: { contains: search } } }
                ]
            } : undefined,
            orderBy: { [sortField]: sortDir as 'asc' | 'desc' },
            include: { owner: true, records: { orderBy: { visitDate: 'desc' }, take: 1, include: { purpose: true } } }
        });
        const clients = await prisma.petOwner.findMany({ orderBy: { firstName: 'asc' } });
        mappedClients = clients.map(c => ({ id: c.id, name: `${c.firstName} ${c.lastName}` }));
    } catch (e) {
        console.error("[DB] AdminPetsPage failed:", e);
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Pets</h1>
                <PetForm clients={mappedClients} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pet Directory</CardTitle>
                </CardHeader>
                <CardContent>
                    <SearchSort
                        sortOptions={[
                            { label: 'Name', value: 'name' },
                            { label: 'Date Added', value: 'createdAt' },
                        ]}
                        defaultSort="createdAt"
                        searchPlaceholder="Search by pet name, species, breed or owner..."
                    />
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-32">Ticket ID</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Pet</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Owner</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Species/Breed</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {pets.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                            No pets found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                                {pets.map((pet: any) => {
                                    const status = pet.records[0]?.status || 'Pending';
                                    return (
                                        <tr key={pet.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-mono text-xs">{pet.id.slice(-8)}</td>
                                            <td className="p-4 align-middle font-medium">{pet.name}</td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {pet.owner.firstName} {pet.owner.lastName}
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {pet.species} {pet.breed ? `(${pet.breed})` : ''}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold
                                                ${status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                                            `}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <PetActions pet={pet} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
