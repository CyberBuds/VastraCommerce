
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
    { status: "Paid", amount: 150000 },
    { status: "Unpaid", amount: 25000 },
    { status: "Overdue", amount: 10000 },
];

export const OutstandingInvoicesChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Outstanding Invoices</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
