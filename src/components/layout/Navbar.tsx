import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                            <Image
                                src="/logo.jpg"
                                alt="BlackJax Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="hidden text-lg font-bold sm:inline-block">
                            <span className="text-black dark:text-black">BLACK</span>
                            <span className="text-primary">JAX</span>
                            <span className="ml-1 text-sm font-normal text-muted-foreground">PET HUB</span>
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
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/client">
                                <ShoppingBag className="h-5 w-5" />
                                <span className="sr-only">Client</span>
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/employee">
                                <User className="h-5 w-5" />
                                <span className="sr-only">Employee</span>
                            </Link>
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    );
}
