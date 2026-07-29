
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
    { date: "2023-01-01", amount: 1200 },
    { date: "2023-01-02", amount: 1500 },
    { date: "2023-01-03", amount: 1300 },
    { date: "2023-01-04", amount: 1700 },
    { date: "2023-01-05", amount: 1900 },
    { date: "2023-01-06", amount: 2100 },
    { date: "2023-01-07", amount: 2000 },
];

export const DailyCollectionsChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Daily Collections</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
