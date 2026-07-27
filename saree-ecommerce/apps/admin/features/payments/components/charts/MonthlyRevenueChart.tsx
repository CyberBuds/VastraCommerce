
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 48000 },
    { month: "Mar", revenue: 52000 },
    { month: "Apr", revenue: 55000 },
    { month: "May", revenue: 58000 },
    { month: "Jun", revenue: 62000 },
];

export const MonthlyRevenueChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
