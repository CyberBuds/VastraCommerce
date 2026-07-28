// app/marketing-analytics/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartdata = [
    { name: 'Campaign A', 'ROI': 2.5 },
    { name: 'Campaign B', 'ROI': 3.1 },
    { name: 'Campaign C', 'ROI': 1.8 },
];

const couponData = [
    { name: 'SUMMER25', value: 9800 },
    { name: 'WELCOME10', value: 4567 },
    { name: 'FREESHIP', value: 3908 },
    { name: 'SALE50', value: 2400 },
    { name: 'SAVEBIG', value: 1908 },
];

const COLORS = ['#64748b', '#8b5cf6', '#6366f1', '#f43f5e', '#06b6d4', '#f59e0b'];

const valueFormatter = (number: number) => `$ ${new Intl.NumberFormat('us').format(number).toString()}`;

const MarketingAnalyticsPage = () => {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Marketing Analytics</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign ROI</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartdata} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <Tooltip />
                                    <Bar dataKey="ROI" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Coupon Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72 w-full mt-4 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip formatter={(val: any) => [valueFormatter(Number(val) || 0), 'Value']} />
                                    <Pie
                                        data={couponData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={4}
                                    >
                                        {couponData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MarketingAnalyticsPage;
