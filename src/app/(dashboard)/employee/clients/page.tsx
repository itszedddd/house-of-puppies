import { prisma } from "@/lib/prisma";
import ClientSearch from "./client-search";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session?.user || !["staff_records", "vet_admin"].includes(role)) {
        redirect("/login");
    }

    let allClients: any[] = [];
    try {
        allClients = await prisma.petOwner.findMany({
            include: { pets: true },
            orderBy: { firstName: 'asc' }
        });
    } catch (e) {
        console.error("[DB] Failed to load clients:", e);
    }

    return (
        <div className="grid gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between border-b pb-4 gap-4">
                <div className="grid gap-1 w-full text-center md:text-left">
                    <h1 className="text-2xl font-black tracking-tighter md:text-3xl">Client Directory</h1>
                    <p className="text-muted-foreground text-sm">View and search for all registered pet owners.</p>
                </div>
            </div>
            
            <ClientSearch clients={allClients} />
        </div>
    );
}
