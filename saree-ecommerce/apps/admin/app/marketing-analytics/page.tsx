// app/marketing-analytics/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, DonutChart } from '@tremor/react';

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
                        <BarChart
                            data={chartdata}
                            index="name"
                            categories={['ROI']}
                            colors={['blue']}
                            yAxisWidth={48}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Coupon Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <DonutChart
                        data={couponData}
                        category="value"
                        index="name"
                        valueFormatter={valueFormatter}
                        colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
                    />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MarketingAnalyticsPage;
