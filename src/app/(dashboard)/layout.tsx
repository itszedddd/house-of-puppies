import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, User, LogOut, Stethoscope, Pill, FileText, Bell, PawPrint, CalendarCheck, Briefcase } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="w-full border-r bg-muted/40 md:w-64">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 select-none cursor-default">
                    <Link href="/admin" className="flex items-center gap-2 font-semibold">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                        <span className="">House of Puppies</span>
                    </Link>
                </div>
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <Link
                        href="/employee"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <Briefcase className="h-4 w-4" />
                        Employee Dashboard
                    </Link>
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
                        href="/admin/employees"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary pl-8"
                    >
                        <User className="h-4 w-4" />
                        Manage Employees
                    </Link>
                    <Link
                        href="/admin/clients"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary pl-8"
                    >
                        <Users className="h-4 w-4" />
                        Manage Pet Owners
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
                </nav>
                <div className="mt-auto p-4">
                    <LogoutButton />
                </div>
            </aside>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
            </main>
        </div >
    );
}
