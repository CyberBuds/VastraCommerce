// features/marketing/hooks/useLoyaltyProgram.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLoyaltyProgram,
  updateLoyaltyProgram,
  getLoyaltyTransactions,
} from '@/services/marketingService';
import { LoyaltyProgram } from '@/types/marketing';
import { toast } from 'sonner';

const LOYALTY_PROGRAM_QUERY_KEY = 'loyaltyProgram';
const LOYALTY_TRANSACTIONS_QUERY_KEY = 'loyaltyTransactions';

export const useGetLoyaltyProgram = () => {
  return useQuery({
    queryKey: [LOYALTY_PROGRAM_QUERY_KEY],
    queryFn: () => getLoyaltyProgram(),
  });
};

export const useUpdateLoyaltyProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LoyaltyProgram>) => updateLoyaltyProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOYALTY_PROGRAM_QUERY_KEY] });
      toast.success('Loyalty program updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update loyalty program');
    },
  });
};

export const useGetLoyaltyTransactions = (params: any) => {
    return useQuery({
      queryKey: [LOYALTY_TRANSACTIONS_QUERY_KEY, params],
      queryFn: () => getLoyaltyTransactions(params),
      placeholderData: (previousData) => previousData,
    });
  };
