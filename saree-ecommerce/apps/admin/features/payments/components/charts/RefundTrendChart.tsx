
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
    { date: "2023-01-01", amount: 200 },
    { date: "2023-01-02", amount: 300 },
    { date: "2023-01-03", amount: 250 },
    { date: "2023-01-04", amount: 400 },
    { date: "2023-01-05", amount: 350 },
];

export const RefundTrendChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Refund Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="amount" stroke="#ff7300" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
