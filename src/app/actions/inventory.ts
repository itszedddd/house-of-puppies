"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInventoryItems() {
    return prisma.inventory.findMany({
        orderBy: { itemName: "asc" },
        include: { itemType: true }
    });
}

export async function createInventoryItem(data: FormData) {
    const itemName = data.get("name") as string;
    const itemTypeName = data.get("category") as string; // Using category as itemType name
    const stock = parseInt(data.get("stock") as string) || 0;
    const unit = data.get("unit") as string;
    const expiryDateStr = data.get("expiryDate") as string;

    if (!itemName || !itemTypeName) {
        return { error: "Name and Category are required" };
    }

    try {
        // Find or create the item type
        let itemType = await prisma.itemType.findUnique({ where: { name: itemTypeName.toLowerCase() } });
        if (!itemType) {
            itemType = await prisma.itemType.create({ data: { name: itemTypeName.toLowerCase() } });
        }

        let status = "Ok";
        if (stock <= 0) status = "Out of Stock";
        else if (stock <= 5) status = "Low";

        const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null;

        await prisma.inventory.create({
            data: {
                itemName,
                itemTypeId: itemType.id,
                stock,
                unit,
                expiryDate,
                status,
            }
        });
        revalidatePath("/inventory");
        revalidatePath("/reports");
        return { success: true };
    } catch (e) {
        console.error("Failed to create inventory item", e);
        return { error: "Failed to create inventory item" };
    }
}

export async function updateInventoryItem(id: string, data: FormData) {
    const itemName = data.get("name") as string;
    const itemTypeName = data.get("category") as string;
    const stock = parseInt(data.get("stock") as string) || 0;
    const unit = data.get("unit") as string;
    const expiryDateStr = data.get("expiryDate") as string;

    try {
        let itemType = await prisma.itemType.findUnique({ where: { name: itemTypeName.toLowerCase() } });
        if (!itemType) {
            itemType = await prisma.itemType.create({ data: { name: itemTypeName.toLowerCase() } });
        }

        let status = "Ok";
        if (stock <= 0) status = "Out of Stock";
        else if (stock <= 5) status = "Low";

        const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null;

        await prisma.inventory.update({
            where: { id },
            data: {
                itemName,
                itemTypeId: itemType.id,
                stock,
                unit,
                expiryDate,
                status,
            }
        });
        revalidatePath("/inventory");
        revalidatePath("/reports");
        return { success: true };
    } catch (e) {
        console.error("Failed to update inventory item", e);
        return { error: "Failed to update inventory item" };
    }
}

export async function deleteInventoryItem(id: string) {
    try {
        await prisma.inventory.delete({
            where: { id }
        });
        revalidatePath("/inventory");
        revalidatePath("/reports");
        return { success: true };
    } catch (e) {
        console.error("Failed to delete inventory item", e);
        return { error: "Failed to delete inventory item" };
    }
}
