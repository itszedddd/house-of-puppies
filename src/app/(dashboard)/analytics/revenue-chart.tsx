"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueChartProps {
    data: { date: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    const [barColor, setBarColor] = useState("#1d4ed8");

    useEffect(() => {
        // Read the computed primary color from the DOM at runtime
        const root = document.documentElement;
        const style = getComputedStyle(root);
        const primary = style.getPropertyValue("--primary").trim();
        if (primary) {
            // Create a temporary element to resolve the color to rgb
            const temp = document.createElement("div");
            temp.style.color = primary;
            document.body.appendChild(temp);
            const computed = getComputedStyle(temp).color;
            document.body.removeChild(temp);

            // Convert rgb(r, g, b) to hex
            const match = computed.match(/\d+/g);
            if (match && match.length >= 3) {
                const hex = "#" + match.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, "0")).join("");
                setBarColor(hex);
            }
        }
    }, []);

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Timeline</CardTitle>
                    <CardDescription>Daily completed transactions and total billed clinic revenue over time.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] flex items-center justify-center text-muted-foreground">
                    Not enough data to construct a chart.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Revenue Timeline</CardTitle>
                <CardDescription>Daily completed transactions and total billed clinic revenue over time.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                            />
                            <YAxis
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₱${value.toLocaleString()}`}
                                width={80}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                                formatter={(value: any) => [`₱${Number(value).toLocaleString()}`, "Revenue"]}
                                labelStyle={{ color: '#6b7280', marginBottom: '8px' }}
                            />
                            <Bar
                                dataKey="revenue"
                                fill={barColor}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
