"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

export interface SortOption {
    label: string;
    value: string; // corresponds to a Prisma field name
}

interface SearchSortProps {
    sortOptions?: SortOption[];
    defaultSort?: string;
    searchPlaceholder?: string;
}

export default function SearchSort({
    sortOptions = [{ label: "Date Added", value: "createdAt" }],
    defaultSort = "createdAt",
    searchPlaceholder = "Search...",
}: SearchSortProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get("search") || "";
    const initialSortBy = searchParams.get("sortBy") || defaultSort;
    const initialSortDir = searchParams.get("sortDir") || "desc";

    const [search, setSearch] = useState(initialSearch);
    const [sortBy, setSortBy] = useState(initialSortBy);
    const [sortDir, setSortDir] = useState(initialSortDir);

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (search) {
                params.set("search", search);
            } else {
                params.delete("search");
            }
            params.set("sortBy", sortBy);
            params.set("sortDir", sortDir);
            router.push(`${pathname}?${params.toString()}`);
        }, 300);

        return () => clearTimeout(timer);
    }, [search, sortBy, sortDir, router, pathname, searchParams]);

    const toggleDir = () => {
        setSortDir(prev => prev === "desc" ? "asc" : "desc");
    };

    return (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[180px] max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder={searchPlaceholder}
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleDir}
                    title={sortDir === "desc" ? "Newest first — click for oldest" : "Oldest first — click for newest"}
                >
                    {sortDir === "desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}
