
'use client';

import { AdminLayout } from "@/features/layout/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import { usePermission } from "@/hooks/usePermission";
import { RevenueCard } from "@/features/payments/components/RevenueCard";
import { TransactionCard } from "@/features/payments/components/TransactionCard";
import { DollarSign, CreditCard } from "lucide-react";
import { RevenueTrendChart } from "@/features/payments/components/charts/RevenueTrendChart";
import { DailyCollectionsChart } from "@/features/payments/components/charts/DailyCollectionsChart";
import { MonthlyRevenueChart } from "@/features/payments/components/charts/MonthlyRevenueChart";
import { PaymentMethodDistributionChart } from "@/features/payments/components/charts/PaymentMethodDistributionChart";
import { GatewayPerformanceChart } from "@/features/payments/components/charts/GatewayPerformanceChart";
import { RefundTrendChart } from "@/features/payments/components/charts/RefundTrendChart";
import { OutstandingInvoicesChart } from "@/features/payments/components/charts/OutstandingInvoicesChart";

const PaymentDashboardPage = () => {
    const { user } = useAuth();
    const { hasPermission } = usePermission('Payment.View');

    if (!hasPermission) {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Payment Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <RevenueCard title="Total Revenue" amount="$45,231.89" icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
                <TransactionCard title="Completed Payments" count={2350} icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} />
                <TransactionCard title="Pending Payments" count={120} icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} />
                <TransactionCard title="Failed Payments" count={30} icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <RevenueTrendChart />
                <DailyCollectionsChart />
                <MonthlyRevenueChart />
                <PaymentMethodDistributionChart />
                <GatewayPerformanceChart />
                <RefundTrendChart />
                <OutstandingInvoicesChart />
            </div>
        </AdminLayout>
    );
};

export default PaymentDashboardPage;
