import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reportsService';
import { useReportsStore } from '@/store/reportsStore';

export function useExecutiveMetrics() {
  const filters = useReportsStore((state) => state.filters);
  return useQuery({
    queryKey: ['reports', 'executive-metrics', filters],
    queryFn: () => reportsService.getExecutiveMetrics(),
  });
}

export function useSalesTrend() {
  const filters = useReportsStore((state) => state.filters);
  return useQuery({
    queryKey: ['reports', 'sales-trend', filters],
    queryFn: () => reportsService.getSalesTrend(),
  });
}

export function useSalesByCategory() {
  const filters = useReportsStore((state) => state.filters);
  return useQuery({
    queryKey: ['reports', 'sales-by-category', filters],
    queryFn: () => reportsService.getSalesByCategory(),
  });
}

export function useOrderStatusBreakdown() {
  const filters = useReportsStore((state) => state.filters);
  return useQuery({
    queryKey: ['reports', 'order-status-breakdown', filters],
    queryFn: () => reportsService.getOrderStatusBreakdown(),
  });
}

export function useCustomerAnalytics() {
  const filters = useReportsStore((state) => state.filters);
  return useQuery({
    queryKey: ['reports', 'customer-analytics', filters],
    queryFn: () => reportsService.getCustomerAnalytics(),
  });
}

export function useInventoryValuation() {
  const filters = useReportsStore((state) => state.filters);
  return useQuery({
    queryKey: ['reports', 'inventory-valuation', filters],
    queryFn: () => reportsService.getInventoryValuation(),
  });
}

export function usePaymentGateways() {
  const filters = useReportsStore((state) => state.filters);
  return useQuery({
    queryKey: ['reports', 'payment-gateways', filters],
    queryFn: () => reportsService.getPaymentGateways(),
  });
}

export function useMarketingCampaigns() {
  const filters = useReportsStore((state) => state.filters);
  return useQuery({
    queryKey: ['reports', 'marketing-campaigns', filters],
    queryFn: () => reportsService.getMarketingCampaigns(),
  });
}

export function useFinanceSummary() {
  const filters = useReportsStore((state) => state.filters);
  return useQuery({
    queryKey: ['reports', 'finance-summary', filters],
    queryFn: () => reportsService.getFinanceSummary(),
  });
}

export function useShippingPerformance() {
  const filters = useReportsStore((state) => state.filters);
  return useQuery({
    queryKey: ['reports', 'shipping-performance', filters],
    queryFn: () => reportsService.getShippingPerformance(),
  });
}

export function useAuditLogs() {
  const filters = useReportsStore((state) => state.filters);
  return useQuery({
    queryKey: ['reports', 'audit-logs', filters],
    queryFn: () => reportsService.getAuditLogs(),
  });
}

export function useSystemMetrics() {
  const filters = useReportsStore((state) => state.filters);
  return useQuery({
    queryKey: ['reports', 'system-metrics', filters],
    queryFn: () => reportsService.getSystemMetrics(),
  });
}
