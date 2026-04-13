import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import RecordForm from "./record-form";
import RecordActions from "./record-actions";

export const dynamic = "force-dynamic";

export default async function AdminRecordsPage() {
    const records = await prisma.clinicalRecord.findMany({
        orderBy: { visitDate: "desc" },
        include: { pet: { include: { owner: true } }, purpose: true, createdBy: true }
    });

    const pets = await prisma.pet.findMany({
        orderBy: { name: 'asc' },
        include: { owner: true }
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
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Visit Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Pet</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Purpose</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {records.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                            No records found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                                {records.map((record: any) => (
                                    <tr key={record.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle whitespace-nowrap">
                                            {new Date(record.visitDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-middle font-medium">
                                            {record.pet.name} <span className="text-xs text-muted-foreground font-normal">({record.pet.owner.firstName} {record.pet.owner.lastName})</span>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {record.purpose?.name || '-'}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold
                                                ${record.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    record.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' :
                                                        record.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-blue-100 text-blue-800'}
                                            `}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <RecordActions record={record} />
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
