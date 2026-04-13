"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PawPrint, Search, ChevronDown, ChevronUp, Filter, Pill, Stethoscope, Calendar } from "lucide-react";

interface PetSearchProps {
    pets: any[];
}

export default function PetSearch({ pets }: PetSearchProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "visits">("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filterSpecies, setFilterSpecies] = useState<string>("all");

    // Extract unique species for filter
    const speciesList = Array.from(new Set(pets.map(p => p.species || "Unknown").filter(Boolean)));

    const filteredPets = pets
        .filter(pet => {
            const fullString = `${pet.name} ${pet.species} ${pet.breed} ${pet.owner?.firstName} ${pet.owner?.lastName}`.toLowerCase();
            const matchesSearch = fullString.includes(searchTerm.toLowerCase());

            let matchesFilter = true;
            if (filterSpecies !== "all") matchesFilter = (pet.species || "Unknown") === filterSpecies;

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === "name") {
                return sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            if (sortBy === "visits") {
                const diff = (a.records?.length || 0) - (b.records?.length || 0);
                return sortDir === "asc" ? diff : -diff;
            }
            return 0;
        });

    const toggleSort = (col: "name" | "visits") => {
        if (sortBy === col) {
            setSortDir(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(col);
            setSortDir("asc");
        }
    };

    const SortIcon = ({ col }: { col: "name" | "visits" }) => {
        if (sortBy !== col) return null;
        return sortDir === "asc" ? <ChevronUp className="h-3 w-3 inline ml-1" /> : <ChevronDown className="h-3 w-3 inline ml-1" />;
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2"><PawPrint className="h-5 w-5" /> Pet Registry</CardTitle>
                            <CardDescription>Search by pet name, breed, or owner. Click a row to view visit history.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search pets..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-medium">Species:</span>
                        <Button
                            variant={filterSpecies === "all" ? "default" : "outline"}
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => setFilterSpecies("all")}
                        >
                            All
                        </Button>
                        {speciesList.map(sp => (
                            <Button
                                key={sp}
                                variant={filterSpecies === sp ? "default" : "outline"}
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => setFilterSpecies(sp)}
                            >
                                {sp}
                            </Button>
                        ))}
                        <span className="ml-auto text-xs text-muted-foreground">{filteredPets.length} result(s)</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("name")}>
                                    Pet Name <SortIcon col="name" />
                                </TableHead>
                                <TableHead>Species</TableHead>
                                <TableHead>Breed</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead className="text-center cursor-pointer select-none" onClick={() => toggleSort("visits")}>
                                    Visits <SortIcon col="visits" />
                                </TableHead>
                                <TableHead className="text-center">History</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                        No pets found{searchTerm ? ` matching "${searchTerm}"` : ""}.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPets.map((pet: any) => {
                                    const visitCount = pet.records?.length || 0;
                                    return (
                                        <>
                                            <TableRow key={pet.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(expandedId === pet.id ? null : pet.id)}>
                                                <TableCell className="font-medium">{pet.name}</TableCell>
                                                <TableCell>{pet.species || "—"}</TableCell>
                                                <TableCell>{pet.breed || "—"}</TableCell>
                                                <TableCell>{pet.owner ? `${pet.owner.firstName} ${pet.owner.lastName}` : "—"}</TableCell>
                                                <TableCell className="text-center">
                                                    {visitCount > 0 ? (
                                                        <Badge variant="outline">{visitCount}</Badge>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">0</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                        {expandedId === pet.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            {/* Expanded Visit History Row */}
                                            {expandedId === pet.id && (
                                                <TableRow key={`${pet.id}-history`}>
                                                    <TableCell colSpan={6} className="bg-muted/30 p-4">
                                                        <div className="space-y-3">
                                                            <h4 className="text-sm font-bold flex items-center gap-2">
                                                                <Stethoscope className="h-4 w-4" />
                                                                Clinical Visit History — {pet.name}
                                                            </h4>
                                                            {!pet.records || pet.records.length === 0 ? (
                                                                <p className="text-xs text-muted-foreground italic">No clinic visits recorded for this pet.</p>
                                                            ) : (
                                                                <div className="space-y-2">
                                                                    {pet.records.map((record: any, idx: number) => (
                                                                        <div key={record.id} className="border rounded-lg p-3 bg-background">
                                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                                        <Calendar className="h-4 w-4 text-primary" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-sm font-medium">
                                                                                            {record.purpose?.name || "Visit"} 
                                                                                            <span className="text-xs text-muted-foreground ml-2">
                                                                                                {new Date(record.visitDate).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
                                                                                            </span>
                                                                                        </p>
                                                                                        {record.chiefComplaint && (
                                                                                            <p className="text-xs text-muted-foreground mt-0.5">Chief Complaint: {record.chiefComplaint}</p>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-2 ml-11 md:ml-0">
                                                                                    <Badge variant={record.status === "Completed" ? "default" : "outline"} className="text-[10px]">
                                                                                        {record.status}
                                                                                    </Badge>
                                                                                    {record.price != null && record.price > 0 && (
                                                                                        <span className="text-xs font-bold">₱{record.price.toFixed(2)}</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            {/* Show diagnosis + treatment if completed */}
                                                                            {record.status === "Completed" && (record.diagnosis || record.treatment) && (
                                                                                <div className="mt-2 ml-11 space-y-1 text-xs">
                                                                                    {record.diagnosis && <p><span className="font-medium">Diagnosis:</span> {record.diagnosis}</p>}
                                                                                    {record.treatment && <p><span className="font-medium">Treatment:</span> {record.treatment}</p>}
                                                                                </div>
                                                                            )}
                                                                            {/* Prescriptions */}
                                                                            {record.prescriptions && record.prescriptions.length > 0 && (
                                                                                <div className="mt-2 ml-11 flex flex-wrap gap-1">
                                                                                    {record.prescriptions.map((rx: any) => (
                                                                                        <Badge key={rx.id} variant="secondary" className="text-[10px] gap-1">
                                                                                            <Pill className="h-2 w-2" /> {rx.medicationName} ({rx.dosage})
                                                                                        </Badge>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
