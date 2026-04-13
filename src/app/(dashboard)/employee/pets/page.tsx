import { prisma } from "@/lib/prisma";
import PetSearch from "./pet-search";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PetsPage() {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session?.user || !["staff", "vet_admin", "owner"].includes(role)) {
        redirect("/login");
    }

    let pets: any[] = [];
    try {
        pets = await prisma.pet.findMany({
            include: {
                owner: true,
                records: {
                    orderBy: { visitDate: "desc" },
                    include: {
                        purpose: true,
                        prescriptions: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (e) {
        console.error("[DB] Failed to load pets:", e);
    }

    return (
        <div className="grid gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between border-b pb-4 gap-4">
                <div className="grid gap-1 w-full text-center md:text-left">
                    <h1 className="text-2xl font-black tracking-tighter md:text-3xl">Pet Registry</h1>
                    <p className="text-muted-foreground text-sm">View and search for all registered patients. Click a row to view clinical history.</p>
                </div>
            </div>
            
            <PetSearch pets={pets} />
        </div>
    );
}
