
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
    { gateway: "Razorpay", performance: 95 },
    { gateway: "Stripe", performance: 98 },
    { gateway: "PayPal", performance: 92 },
    { gateway: "Cashfree", performance: 96 },
];

export const GatewayPerformanceChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Gateway Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis dataKey="gateway" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="performance" fill="#ffc658" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
