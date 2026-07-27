// apps/admin/features/marketing/hooks/__tests__/useCoupons.test.tsx
import { renderHook } from '@testing-library/react-hooks';
import { useGetCoupons } from '../useCoupons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('useGetCoupons', () => {
    it('should return coupons', async () => {
        const { result, waitFor } = renderHook(() => useGetCoupons(), {
            wrapper: createWrapper()
        });

        await waitFor(() => result.current.isSuccess);

        expect(result.current.data).toBeDefined();
    });
});
