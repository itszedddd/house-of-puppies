import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, User, LogOut, Stethoscope, Pill, FileText, Bell, PawPrint, CalendarCheck } from "lucide-react";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="w-full border-r bg-muted/40 md:w-64">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                        <span className="">House of Puppies</span>
                    </Link>
                </div>
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <Link
                        href="/veterinary"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <Stethoscope className="h-4 w-4" />
                        Veterinary
                    </Link>
                    <Link
                        href="/inventory"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <Pill className="h-4 w-4" />
                        Inventory
                    </Link>
                    <Link
                        href="/reminders"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <Bell className="h-4 w-4" />
                        Reminders
                    </Link>
                    <Link
                        href="/reports"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <FileText className="h-4 w-4" />
                        Reports
                    </Link>
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                    </Link>
                    <Link
                        href="/admin/clients"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary pl-8"
                    >
                        <Users className="h-4 w-4" />
                        Manage Clients
                    </Link>
                    <Link
                        href="/admin/pets"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary pl-8"
                    >
                        <PawPrint className="h-4 w-4" />
                        Manage Pets
                    </Link>
                    <Link
                        href="/admin/records"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary pl-8"
                    >
                        <CalendarCheck className="h-4 w-4" />
                        Manage Records
                    </Link>
                    <Link
                        href="/client"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <User className="h-4 w-4" />
                        Client View
                    </Link>
                </nav>
                <div className="mt-auto p-4">
                    <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                        <Link href="/">
                            <LogOut className="h-4 w-4" />
                            Exit to Site
                        </Link>
                    </Button>
                </div>
            </aside>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
            </main>
        </div >
    );
}
