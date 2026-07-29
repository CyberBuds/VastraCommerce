// features/marketing/hooks/useMarketingDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { getMarketingDashboardStats } from '@/services/marketingService';

const MARKETING_DASHBOARD_STATS_QUERY_KEY = 'marketingDashboardStats';

export const useGetMarketingDashboardStats = () => {
  return useQuery({
    queryKey: [MARKETING_DASHBOARD_STATS_QUERY_KEY],
    queryFn: getMarketingDashboardStats,
  });
};
