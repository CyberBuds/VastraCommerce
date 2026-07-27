// app/dashboard/marketing/dashboard/page.tsx
'use client';

import { MarketingDashboardStats } from '@/types/marketing';
import { useGetMarketingDashboardStats } from '@/features/marketing/hooks/useMarketingDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, BarChart } from '@tremor/react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const chartdata = [
    { date: 'Jan 22', 'Running Coupons': 2890, 'Active Campaigns': 2338 },
    { date: 'Feb 22', 'Running Coupons': 2756, 'Active Campaigns': 2103 },
    { date: 'Mar 22', 'Running Coupons': 3322, 'Active Campaigns': 2194 },
    { date: 'Apr 22', 'Running Coupons': 3470, 'Active Campaigns': 2108 },
    { date: 'May 22', 'Running Coupons': 3475, 'Active Campaigns': 1812 },
    { date: 'Jun 22', 'Running Coupons': 3129, 'Active Campaigns': 1726 },
];

const dataFormatter = (number: number) => {
    return '$' + Intl.NumberFormat('us').format(number).toString();
};


const MarketingDashboardPage = () => {
  const { data: stats, isLoading, isError } = useGetMarketingDashboardStats();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading dashboard data</div>;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Marketing Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Active Campaigns" value={stats?.activeCampaigns} />
        <StatCard title="Running Coupons" value={stats?.runningCoupons} />
        <StatCard title="Active Flash Sales" value={stats?.flashSales} />
        <StatCard title="Revenue From Promotions" value={`$${stats?.revenueFromPromotions?.toFixed(2)}`} />
        <StatCard title="Total Discount Amount" value={`$${stats?.discountAmount?.toFixed(2)}`} />
        <StatCard title="Gift Cards Issued" value={stats?.giftCardsIssued} />
        <StatCard title="Referral Registrations" value={stats?.referralRegistrations} />
        <StatCard title="Loyalty Program Members" value={stats?.loyaltyMembers} />
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
                <CardHeader>
                <CardTitle>Campaigns vs Coupons</CardTitle>
                </CardHeader>
                <CardContent>
                <AreaChart
                    className="h-72 mt-4"
                    data={chartdata}
                    index="date"
                    categories={['Running Coupons', 'Active Campaigns']}
                    colors={['indigo', 'cyan']}
                    valueFormatter={dataFormatter}
                />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Abandoned Cart Recovery</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <div className='flex flex-col'>
                            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Total Carts</p>
                            <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">{stats?.abandonedCarts}</span>
                        </div>
                        <div className='flex flex-col'>
                            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Recovered Carts</p>
                            <span className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">{stats?.recoveredCarts}</span>
                        </div>
                    </div>
                    <Progress value={(stats?.recoveredCarts || 0) / (stats?.abandonedCarts || 1) * 100} />
                    <div className="mt-2 flex justify-between">
                        <Badge variant="secondary">Recovery Rate</Badge>
                        <Badge variant="default">{(((stats?.recoveredCarts || 0) / (stats?.abandonedCarts || 1)) * 100).toFixed(2)}%</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add more charts and widgets here */}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: string | number | undefined }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value ?? 'N/A'}</div>
      </CardContent>
    </Card>
  );
};

export default MarketingDashboardPage;
