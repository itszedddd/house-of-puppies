import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import RecordForm from "./record-form";

export default async function AdminRecordsPage() {
    const records = await prisma.record.findMany({
        orderBy: { date: "desc" },
        include: { pet: { include: { client: true } } }
    });

    const pets = await prisma.pet.findMany({
        orderBy: { name: 'asc' },
        include: { client: true }
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Service Records</h1>
                <RecordForm pets={pets} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Records</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Pet</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Service</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Price</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {records.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                            No records found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                                {records.map((record) => (
                                    <tr key={record.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle whitespace-nowrap">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-middle font-medium">
                                            {record.pet.name} <span className="text-xs text-muted-foreground font-normal">({record.pet.client.name})</span>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {record.serviceType}
                                        </td>
                                        <td className="p-4 align-middle">
                                            ${(record.price || 0).toFixed(2)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold
                                                ${record.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    record.status === 'ready' ? 'bg-emerald-100 text-emerald-800' :
                                                        record.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-blue-100 text-blue-800'}
                                            `}>
                                                {record.status}
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
