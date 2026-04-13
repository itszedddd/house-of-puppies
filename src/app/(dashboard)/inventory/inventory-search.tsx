"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Search, Filter, Package } from "lucide-react";
import EditItemForm from "./edit-item-form";

interface InventorySearchProps {
    inventory: any[];
}

export default function InventorySearch({ inventory }: InventorySearchProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "ok" | "low">("all");

    // Extract unique categories
    const categories = Array.from(new Set(inventory.map(i => i.itemType?.name || "Unknown")));
    const [filterCategory, setFilterCategory] = useState<string>("all");

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = `${item.itemName} ${item.itemType?.name || ""}`.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesStatus = true;
        if (filterStatus === "low") matchesStatus = item.stock <= 10;
        if (filterStatus === "ok") matchesStatus = item.stock > 10;

        let matchesCategory = true;
        if (filterCategory !== "all") matchesCategory = (item.itemType?.name || "Unknown") === filterCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Current Stock</CardTitle>
                            <CardDescription>Manage medicines, food, and supplies.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search inventory..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-medium">Status:</span>
                        {(["all", "ok", "low"] as const).map(f => (
                            <Button
                                key={f}
                                variant={filterStatus === f ? "default" : "outline"}
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => setFilterStatus(f)}
                            >
                                {f === "all" ? "All" : f === "ok" ? "In Stock" : "⚠ Low Stock"}
                            </Button>
                        ))}
                        <span className="text-xs text-muted-foreground font-medium ml-2">Category:</span>
                        <Button
                            variant={filterCategory === "all" ? "default" : "outline"}
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => setFilterCategory("all")}
                        >
                            All
                        </Button>
                        {categories.map(cat => (
                            <Button
                                key={cat}
                                variant={filterCategory === cat ? "default" : "outline"}
                                size="sm"
                                className="text-xs h-7 capitalize"
                                onClick={() => setFilterCategory(cat)}
                            >
                                {cat}
                            </Button>
                        ))}
                        <span className="ml-auto text-xs text-muted-foreground">{filteredInventory.length} item(s)</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Stock Level</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead className="hidden md:table-cell">Expiry Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventory.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                        No items found{searchTerm ? ` matching "${searchTerm}"` : ""}.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredInventory.map((item: any) => (
                                    <TableRow key={item.id} className={item.stock <= 10 ? "bg-red-50/50 dark:bg-red-950/10" : ""}>
                                        <TableCell className="font-medium">{item.itemName}</TableCell>
                                        <TableCell className="capitalize">{item.itemType?.name || "N/A"}</TableCell>
                                        <TableCell>
                                            <span className={`font-bold ${item.stock <= 10 ? "text-red-600" : ""}`}>
                                                {item.stock}
                                            </span>
                                        </TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                        <TableCell className="hidden md:table-cell">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "N/A"}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === "Low" || item.stock <= 10 ? "destructive" : "secondary"}>
                                                {(item.status === "Low" || item.stock <= 10) && <AlertTriangle className="mr-1 h-3 w-3" />}
                                                {item.stock <= 10 ? "Low" : item.status || "Ok"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <EditItemForm item={item} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
