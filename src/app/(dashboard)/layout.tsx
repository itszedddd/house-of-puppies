import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LayoutDashboard, Users, User, Stethoscope, Pill, FileText, TrendingUp, PawPrint, CalendarCheck, Briefcase, Menu, LogOut, Sun, MessageSquare } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const role = (session.user as any).role as string;

    const navItems = [
        // Staff Records — intake, clients, pets
        { href: "/employee", label: "Records Dashboard", icon: Briefcase, roles: ["staff_records", "vet_admin"] },
        { href: "/employee/clients", label: "Clients Directory", icon: Users, roles: ["staff_records", "vet_admin", "owner"] },
        { href: "/employee/pets", label: "Pets Registry", icon: PawPrint, roles: ["staff_records", "vet_admin", "owner"] },

        // Veterinarian — examine patients
        { href: "/veterinary", label: "Veterinary", icon: Stethoscope, roles: ["vet_admin"] },

        // Staff SMS — AI reminders
        { href: "/employee/reminders", label: "AI SMS Reminders", icon: MessageSquare, roles: ["staff_sms"] },

        // Staff Inventory
        { href: "/inventory", label: "Inventory", icon: Pill, roles: ["staff_inventory", "owner"] },

        // Owner & Admin — analytics and reports
        { href: "/analytics", label: "Analytics & Sales", icon: TrendingUp, roles: ["owner", "vet_admin"] },
        { href: "/reports", label: "Reports", icon: FileText, roles: ["owner", "vet_admin"] },

        // Owner only — manage employees
        { href: "/admin/employees", label: "Manage Employees", icon: Users, roles: ["owner"] },
    ];

    const filteredNav = navItems.filter((item) => item.roles.includes(role));

    // Reusable Nav rendering component
    const NavigationLinks = () => (
        <>
            {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                );
            })}
        </>
    );

    return (
        <div className="flex min-h-screen flex-col md:flex-row relative">
            {/* Mobile Header with Hamburger Menu */}
            <div className="flex md:hidden h-14 items-center justify-between border-b px-4 bg-muted/40 shrink-0 print:hidden">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <div className="relative h-6 w-6 overflow-hidden rounded-full bg-white">
                        <img src="/profile-icon-1.png" alt="Logo" className="object-cover h-full w-full" />
                    </div>
                    <span className="text-sm">House of Puppies</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[80%] max-w-sm flex flex-col p-4">
                            <nav className="flex flex-col gap-1 text-lg font-medium mt-6">
                                <NavigationLinks />
                                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                    <LogoutButton />
                                    <ModeToggle />
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-muted/40 shrink-0 print:hidden">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 select-none cursor-default">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <div className="relative h-6 w-6 overflow-hidden rounded-full bg-white flex shrink-0">
                            <img src="/profile-icon-1.png" alt="Logo" className="object-cover h-full w-full" />
                        </div>
                        <span className="">House of Puppies</span>
                    </Link>
                </div>
                <nav className="flex flex-col gap-1 px-2 text-sm font-medium lg:px-4 py-4 flex-1">
                    <NavigationLinks />
                    <div className="mt-4 pt-4 border-t flex items-center justify-between gap-2">
                        <LogoutButton />
                        <ModeToggle />
                    </div>
                </nav>
            </aside>
            
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
