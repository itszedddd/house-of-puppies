"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Search, ChevronDown, ChevronUp, PawPrint, Phone, Mail, MapPin, Filter } from "lucide-react";

interface ClientComponentProps {
    clients: any[];
}

export default function ClientSearch({ clients }: ClientComponentProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "pets">("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filterByPets, setFilterByPets] = useState<"all" | "with-pets" | "no-pets">("all");

    const filteredClients = clients
        .filter(client => {
            const fullString = `${client.firstName} ${client.lastName} ${client.contactNumber || ""} ${client.email || ""} ${client.address || ""}`.toLowerCase();
            const matchesSearch = fullString.includes(searchTerm.toLowerCase());

            let matchesFilter = true;
            if (filterByPets === "with-pets") matchesFilter = (client.pets?.length || 0) > 0;
            if (filterByPets === "no-pets") matchesFilter = (client.pets?.length || 0) === 0;

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === "name") {
                const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                return sortDir === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            }
            if (sortBy === "pets") {
                const diff = (a.pets?.length || 0) - (b.pets?.length || 0);
                return sortDir === "asc" ? diff : -diff;
            }
            return 0;
        });

    const toggleSort = (col: "name" | "pets") => {
        if (sortBy === col) {
            setSortDir(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(col);
            setSortDir("asc");
        }
    };

    const SortIcon = ({ col }: { col: "name" | "pets" }) => {
        if (sortBy !== col) return null;
        return sortDir === "asc" ? <ChevronUp className="h-3 w-3 inline ml-1" /> : <ChevronDown className="h-3 w-3 inline ml-1" />;
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Client Directory</CardTitle>
                            <CardDescription>Search by name, phone, email, or address. Click a row to view pet details.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search clients..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-medium">Filter:</span>
                        {(["all", "with-pets", "no-pets"] as const).map(f => (
                            <Button
                                key={f}
                                variant={filterByPets === f ? "default" : "outline"}
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => setFilterByPets(f)}
                            >
                                {f === "all" ? "All Clients" : f === "with-pets" ? "With Pets" : "No Pets Yet"}
                            </Button>
                        ))}
                        <span className="ml-auto text-xs text-muted-foreground">{filteredClients.length} result(s)</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("name")}>
                                    Name <SortIcon col="name" />
                                </TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead className="hidden lg:table-cell">Address</TableHead>
                                <TableHead className="text-center cursor-pointer select-none" onClick={() => toggleSort("pets")}>
                                    Pets <SortIcon col="pets" />
                                </TableHead>
                                <TableHead className="text-center">Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                        No clients found{searchTerm ? ` matching "${searchTerm}"` : ""}.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredClients.map((client: any) => (
                                    <>
                                        <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}>
                                            <TableCell className="font-medium">{client.firstName} {client.lastName}</TableCell>
                                            <TableCell className="whitespace-nowrap">{client.contactNumber || "—"}</TableCell>
                                            <TableCell className="hidden md:table-cell">{client.email || "—"}</TableCell>
                                            <TableCell className="max-w-[200px] truncate hidden lg:table-cell" title={client.address || ""}>{client.address || "—"}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">{client.pets?.length || 0}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                    {expandedId === client.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        {/* Expanded Detail Row */}
                                        {expandedId === client.id && (
                                            <TableRow key={`${client.id}-detail`}>
                                                <TableCell colSpan={6} className="bg-muted/30 p-4">
                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        {/* Client Info */}
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-bold">Client Information</h4>
                                                            <div className="text-sm space-y-1">
                                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                                    <Phone className="h-3 w-3" /> {client.contactNumber || "No phone"}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                                    <Mail className="h-3 w-3" /> {client.email || "No email"}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                                    <MapPin className="h-3 w-3" /> {client.address || "No address"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Pets List */}
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-bold flex items-center gap-1"><PawPrint className="h-3 w-3" /> Registered Pets ({client.pets?.length || 0})</h4>
                                                            {client.pets && client.pets.length > 0 ? (
                                                                <div className="space-y-2">
                                                                    {client.pets.map((pet: any) => (
                                                                        <div key={pet.id} className="flex items-center justify-between border rounded-md p-2 bg-background">
                                                                            <div>
                                                                                <p className="text-sm font-medium">{pet.name}</p>
                                                                                <p className="text-xs text-muted-foreground">{pet.species || "Animal"} — {pet.breed || "N/A"}</p>
                                                                            </div>
                                                                            {pet.gender && <Badge variant="outline" className="text-[10px]">{pet.gender}</Badge>}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-muted-foreground italic">No pets registered for this client.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
