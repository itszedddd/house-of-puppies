"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PawPrint } from "lucide-react";
import { searchPetStatus } from "@/app/actions/pets";
import { Pet } from "@prisma/client";

export default function ClientPage() {
    const [ticketId, setTicketId] = useState("");
    const [foundPet, setFoundPet] = useState<Pet | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setFoundPet(null);
        setIsLoading(true);

        const pet = await searchPetStatus(ticketId);

        if (pet) {
            setFoundPet(pet);
        } else {
            setError("No pet found with that Ticket ID. Please check and try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 max-w-md mx-auto w-full">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Check Pet Status</h1>
                <p className="text-muted-foreground">Enter your Ticket ID to see if your furry friend is ready.</p>
            </div>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Track Your Pet</CardTitle>
                    <CardDescription>Example ID: TIC-1002</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            placeholder="Enter Ticket ID (e.g., TIC-1001)"
                            value={ticketId}
                            onChange={(e) => setTicketId(e.target.value)}
                        />
                        <Button type="submit">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                    {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                </CardContent>
            </Card>

            {foundPet && (
                <Card className="w-full border-primary/50 bg-primary/5 animate-in fade-in slide-in-from-bottom-4">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto bg-background p-3 rounded-full mb-2 w-fit border">
                            <PawPrint className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{foundPet.name}</CardTitle>
                        <CardDescription>{foundPet.breed}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Current Status</p>
                            <div className={`text-3xl font-bold mt-1 
                    ${(foundPet as any).records?.[0]?.status === 'completed' ? 'text-green-600' : 'text-primary'}`}>
                                {(foundPet as any).records?.[0]?.status || 'pending'}
                            </div>
                        </div>

                        {(foundPet as any).records?.[0]?.status === 'completed' ? (
                            <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm font-medium">
                                Your pet is ready for pickup!
                            </div>
                        ) : (
                            <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
                                We are still pampering your pet. Check back soon!
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
