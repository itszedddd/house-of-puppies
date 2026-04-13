import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInventoryItems } from "@/app/actions/inventory";
import { AlertTriangle } from "lucide-react";
import AddItemForm from "./add-item-form";
import EditItemForm from "./edit-item-form";
import InventorySearch from "./inventory-search";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
    const session = await auth();
    if (!session?.user || !["staff_inventory", "vet_admin", "owner"].includes((session.user as any).role)) {
        redirect("/login");
    }

    const inventory = await getInventoryItems();

    return (
        <div className="grid gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-lg font-semibold md:text-2xl">Inventory Management</h1>
                <AddItemForm />
            </div>

            <InventorySearch inventory={inventory} />
        </div>
    );
}
