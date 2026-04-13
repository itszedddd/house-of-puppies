import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import EmployeeForm from "./employee-form";
import EmployeeActions from "./employee-actions";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SearchSort from "../search-sort";

export const dynamic = "force-dynamic";

export default async function AdminEmployeesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const session = await auth();
    if (!session?.user || session.user.role !== "owner") {
        redirect("/login");
    }
    const search = typeof params?.search === 'string' ? params.search : undefined;
    const sortBy = typeof params?.sortBy === 'string' ? params.sortBy : 'createdAt';
    const sortDir = typeof params?.sortDir === 'string' ? params.sortDir : 'desc';

    const validSortKeys = ['fullName', 'createdAt'] as const;
    type SortKey = typeof validSortKeys[number];
    const sortField: SortKey = validSortKeys.includes(sortBy as SortKey) ? (sortBy as SortKey) : 'createdAt';

    let employees: any[] = [];
    try {
        employees = await prisma.staff.findMany({
            where: search ? {
                OR: [
                    { fullName: { contains: search } },
                    { username: { contains: search } }
                ]
            } : undefined,
            orderBy: { [sortField]: sortDir as 'asc' | 'desc' },
            include: { role: true }
        });
    } catch (e) {
        console.error("[DB] AdminEmployeesPage failed:", e);
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Employees</h1>
                <EmployeeForm />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Employee Directory</CardTitle>
                </CardHeader>
                <CardContent>
                    <SearchSort
                        sortOptions={[
                            { label: 'Name', value: 'fullName' },
                            { label: 'Date Added', value: 'createdAt' },
                        ]}
                        defaultSort="createdAt"
                        searchPlaceholder="Search by name or username..."
                    />
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Role</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Registered</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {employees.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                            No employees found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                                {employees.map((employee: any) => (
                                    <tr key={employee.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">{employee.fullName || "N/A"}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{employee.username}</td>
                                        <td className="p-4 align-middle">
                                            <Badge variant={employee.role?.name === "vet_admin" ? "default" : "secondary"}>
                                                {employee.role?.name}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {new Date(employee.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <EmployeeActions employee={employee} />
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
