// features/marketing/hooks/useReferralProgram.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReferrals,
  getReferralRules,
  updateReferralRule,
} from '@/services/marketingService';
import { ReferralRule } from '@/types/marketing';
import { toast } from 'sonner';

const REFERRALS_QUERY_KEY = 'referrals';
const REFERRAL_RULES_QUERY_KEY = 'referralRules';

export const useGetReferrals = (params: any) => {
  return useQuery({
    queryKey: [REFERRALS_QUERY_KEY, params],
    queryFn: () => getReferrals(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetReferralRules = () => {
  return useQuery({
    queryKey: [REFERRAL_RULES_QUERY_KEY],
    queryFn: () => getReferralRules(),
  });
};

export const useUpdateReferralRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ReferralRule> }) => updateReferralRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REFERRAL_RULES_QUERY_KEY] });
      toast.success('Referral rule updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update referral rule');
    },
  });
};
