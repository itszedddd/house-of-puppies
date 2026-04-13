import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { ShoppingBag, User } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 select-none cursor-default">
            <div className="container flex h-16 items-center justify-between">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-primary">
                            <img
                                src="/branding.jpg"
                                alt="House of Puppies Logo"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <span className="hidden text-lg font-bold sm:inline-block">
                            <span className="text-primary">House of Puppies</span>
                            <span className="ml-1 text-sm font-normal text-muted-foreground">Vet & Grooming</span>
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/#services"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Services
                        </Link>
                        <Link
                            href="/#products"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Products
                        </Link>
                        <Link
                            href="/#about"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            About
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search or other items could go here */}
                    </div>
                    <nav className="flex items-center space-x-2">
                        <ModeToggle />
                        <Button variant="ghost" size="icon" asChild title="Check Pet Status">
                            <Link href="/client">
                                <ShoppingBag className="h-5 w-5" />
                                <span className="sr-only">Client Pet Status</span>
                            </Link>
                        </Button>
                        <Button variant="default" size="sm" asChild className="ml-2">
                            <Link href="/login" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>Staff Login</span>
                            </Link>
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    );
}
