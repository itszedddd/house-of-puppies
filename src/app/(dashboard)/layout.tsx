import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, User, LogOut } from "lucide-react";

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
                        <LayoutDashboard className="h-6 w-6" />
                        <span className="">BlackJax Panel</span>
                    </Link>
                </div>
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <Users className="h-4 w-4" />
                        Admin
                    </Link>
                    <Link
                        href="/employee"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                        <User className="h-4 w-4" />
                        Employee
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
        </div>
    );
}
