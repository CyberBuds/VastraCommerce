// features/marketing/hooks/useProductRecommendations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProductRecommendations,
  updateProductRecommendations,
} from '@/services/marketingService';
import { ProductRecommendation } from '@/types/marketing';
import { toast } from 'sonner';

const PRODUCT_RECOMMENDATIONS_QUERY_KEY = 'productRecommendations';

export const useGetProductRecommendations = (productId: string) => {
  return useQuery({
    queryKey: [PRODUCT_RECOMMENDATIONS_QUERY_KEY, productId],
    queryFn: () => getProductRecommendations(productId),
    enabled: !!productId,
  });
};

export const useUpdateProductRecommendations = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: Partial<ProductRecommendation> }) => updateProductRecommendations(productId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_RECOMMENDATIONS_QUERY_KEY, productId] });
      toast.success('Product recommendations updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update product recommendations');
    },
  });
};
