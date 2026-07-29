// features/marketing/hooks/useFlashSales.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFlashSales,
  getFlashSale,
  createFlashSale,
  updateFlashSale,
  deleteFlashSale,
} from '@/services/marketingService';
import { FlashSale } from '@/types/marketing';
import { toast } from 'sonner';

const FLASH_SALES_QUERY_KEY = 'flashSales';

export const useGetFlashSales = (params: any) => {
  return useQuery({
    queryKey: [FLASH_SALES_QUERY_KEY, params],
    queryFn: () => getFlashSales(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetFlashSale = (id: string) => {
  return useQuery({
    queryKey: [FLASH_SALES_QUERY_KEY, id],
    queryFn: () => getFlashSale(id),
    enabled: !!id,
  });
};

export const useCreateFlashSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<FlashSale, 'id' | 'createdAt' | 'updatedAt'>) => createFlashSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FLASH_SALES_QUERY_KEY] });
      toast.success('Flash sale created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create flash sale');
    },
  });
};

export const useUpdateFlashSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FlashSale> }) => updateFlashSale(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [FLASH_SALES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [FLASH_SALES_QUERY_KEY, id] });
      toast.success('Flash sale updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update flash sale');
    },
  });
};

export const useDeleteFlashSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFlashSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FLASH_SALES_QUERY_KEY] });
      toast.success('Flash sale deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete flash sale');
    },
  });
};
