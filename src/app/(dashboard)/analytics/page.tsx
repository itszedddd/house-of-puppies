import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Activity, TrendingUp, TrendingDown, Presentation, BarChart3, CalendarDays } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RevenueChart } from "./revenue-chart";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
    const session = await auth();
    if (!session?.user || !["owner", "vet_admin"].includes((session.user as any).role)) {
        redirect("/employee");
    }

    const sParams = await searchParams;
    const filter = sParams.filter || "month";

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);
    const yearAgo = new Date(today);
    yearAgo.setFullYear(today.getFullYear() - 1);

    let whereClause: any = { status: "Completed" };
    if (filter === "today") whereClause.visitDate = { gte: today };
    if (filter === "week") whereClause.visitDate = { gte: weekAgo };
    if (filter === "month") whereClause.visitDate = { gte: monthAgo };
    if (filter === "year") whereClause.visitDate = { gte: yearAgo };

    let filteredRecords: any[] = [];
    let allCompletedRecords: any[] = [];
    try {
        filteredRecords = await prisma.clinicalRecord.findMany({
            where: whereClause,
            include: { purpose: true },
            orderBy: { visitDate: "desc" }
        });

        // Fetch ALL completed records for comparison calculations
        allCompletedRecords = await prisma.clinicalRecord.findMany({
            where: { status: "Completed" },
            orderBy: { visitDate: "asc" }
        });
    } catch (e) {
        console.error("[DB] AnalyticsPage failed:", e);
    }

    // ============ INCOME COMPARISON CALCULATIONS ============

    function getRecordsInRange(start: Date, end: Date) {
        return allCompletedRecords.filter(r => {
            const d = new Date(r.visitDate);
            return d >= start && d < end;
        });
    }

    function sumRevenue(records: any[]) {
        return records.reduce((sum, r) => sum + (r.price || 0), 0);
    }

    // This Week vs Last Week
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const thisWeekRevenue = sumRevenue(getRecordsInRange(thisWeekStart, new Date(thisWeekStart.getTime() + 7 * 86400000)));
    const lastWeekRevenue = sumRevenue(getRecordsInRange(lastWeekStart, thisWeekStart));
    const weekChange = lastWeekRevenue > 0 ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue * 100) : 0;

    // This Month vs Last Month
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonthRevenue = sumRevenue(getRecordsInRange(thisMonthStart, new Date(now.getFullYear(), now.getMonth() + 1, 1)));
    const lastMonthRevenue = sumRevenue(getRecordsInRange(lastMonthStart, thisMonthStart));
    const monthChange = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;

    // This Year vs Last Year
    const thisYearStart = new Date(now.getFullYear(), 0, 1);
    const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
    const lastYearEnd = new Date(now.getFullYear(), 0, 1);
    const thisYearRevenue = sumRevenue(getRecordsInRange(thisYearStart, new Date(now.getFullYear() + 1, 0, 1)));
    const lastYearRevenue = sumRevenue(getRecordsInRange(lastYearStart, lastYearEnd));
    const yearChange = lastYearRevenue > 0 ? ((thisYearRevenue - lastYearRevenue) / lastYearRevenue * 100) : 0;

    // ============ CHART DATA ============

    // For daily chart (week/month view)
    const chartSourceRecords = filter === "year" || filter === "all"
        ? allCompletedRecords.filter(r => new Date(r.visitDate) >= yearAgo)
        : allCompletedRecords.filter(r => new Date(r.visitDate) >= monthAgo);

    let chartData: { date: string; revenue: number }[] = [];

    if (filter === "year" || filter === "all") {
        // Monthly aggregation for yearly view
        const monthlyMap = new Map<string, number>();
        chartSourceRecords.forEach(r => {
            const d = new Date(r.visitDate);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            monthlyMap.set(key, (monthlyMap.get(key) || 0) + (r.price || 0));
        });
        chartData = Array.from(monthlyMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, revenue]) => {
                const [y, m] = month.split("-");
                const monthName = new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString("en-PH", { month: "short", year: "numeric" });
                return { date: monthName, revenue };
            });
    } else {
        // Daily aggregation for day/week/month view
        const dailyMap = new Map<string, number>();
        chartSourceRecords.forEach(r => {
            const dateStr = new Date(r.visitDate).toLocaleDateString("en-PH");
            dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + (r.price || 0));
        });
        chartData = Array.from(dailyMap.entries()).map(([date, revenue]) => ({ date, revenue }));
    }

    const totalRevenue = filteredRecords.reduce((sum, r) => sum + (r.price || 0), 0);
    const averageRecordPrice = filteredRecords.length > 0 ? totalRevenue / filteredRecords.length : 0;

    function ComparisonCard({ title, current, previous, change, icon: Icon }: {
        title: string; current: number; previous: number; change: number; icon: any;
    }) {
        const isPositive = change >= 0;
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        ₱{current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        {isPositive
                            ? <TrendingUp className="h-3 w-3 text-green-500" />
                            : <TrendingDown className="h-3 w-3 text-red-500" />
                        }
                        <span className={`text-xs font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                            {isPositive ? "+" : ""}{change.toFixed(1)}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                            vs ₱{previous.toLocaleString(undefined, { minimumFractionDigits: 2 })} prev
                        </span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">Financial Analytics</h1>
                    <p className="text-muted-foreground mt-1">AI-driven revenue insights and income comparison analysis.</p>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded font-medium flex items-center gap-2">
                    <Activity className="h-5 w-5" /> Live Data
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 p-1 bg-muted w-fit rounded-lg">
                <Button variant={filter === "today" ? "default" : "ghost"} size="sm" asChild>
                    <Link href="/analytics?filter=today">Today</Link>
                </Button>
                <Button variant={filter === "week" ? "default" : "ghost"} size="sm" asChild>
                    <Link href="/analytics?filter=week">This Week</Link>
                </Button>
                <Button variant={filter === "month" ? "default" : "ghost"} size="sm" asChild>
                    <Link href="/analytics?filter=month">This Month</Link>
                </Button>
                <Button variant={filter === "year" ? "default" : "ghost"} size="sm" asChild>
                    <Link href="/analytics?filter=year">This Year</Link>
                </Button>
                <Button variant={filter === "all" ? "default" : "ghost"} size="sm" asChild>
                    <Link href="/analytics?filter=all">All Time</Link>
                </Button>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Period Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            ₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground">From {filteredRecords.length} completed visits</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Visit Value</CardTitle>
                        <Presentation className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₱{averageRecordPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground">Per consultation average</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Total Visits (Period)</CardTitle>
                        <BarChart3 className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{filteredRecords.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Completed clinical records</p>
                    </CardContent>
                </Card>
            </div>

            {/* Income Comparison Section */}
            <div>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    Income Comparisons
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <ComparisonCard
                        title="Weekly"
                        current={thisWeekRevenue}
                        previous={lastWeekRevenue}
                        change={weekChange}
                        icon={TrendingUp}
                    />
                    <ComparisonCard
                        title="Monthly"
                        current={thisMonthRevenue}
                        previous={lastMonthRevenue}
                        change={monthChange}
                        icon={TrendingUp}
                    />
                    <ComparisonCard
                        title="Yearly"
                        current={thisYearRevenue}
                        previous={lastYearRevenue}
                        change={yearChange}
                        icon={TrendingUp}
                    />
                </div>
            </div>

            {/* Revenue Chart */}
            <RevenueChart data={chartData} />

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Completed Transactions</CardTitle>
                    <CardDescription>Breakdown of the clinic's latest finalized visits and billed amounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {filteredRecords.length === 0 ? (
                            <p className="text-muted-foreground">No completed transactions available for this period.</p>
                        ) : (
                            filteredRecords.slice(0, 30).map(record => (
                                <div key={record.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{record.purpose?.name || "Consultation"}</p>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(record.visitDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="font-bold">
                                        ₱{(record.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
