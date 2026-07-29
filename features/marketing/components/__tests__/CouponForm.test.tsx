// apps/admin/features/marketing/components/__tests__/CouponForm.test.tsx
import { render, screen } from '@testing-library/react';
import { CouponForm } from '@/app/coupons/components/coupon-form';

describe('CouponForm', () => {
    it('should render the form with initial data', () => {
        // mock initial data
        const initialData = {
            id: '1',
            code: 'TEST',
            type: 'PERCENTAGE',
            value: 10,
            description: 'Test coupon',
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            status: 'ACTIVE',
            usageCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        render(<CouponForm initialData={initialData} />);
        
        expect(screen.getByLabelText(/coupon code/i)).toHaveValue('TEST');
        expect(screen.getByLabelText(/description/i)).toHaveValue('Test coupon');
        expect(screen.getByLabelText(/value/i)).toHaveValue(10);
    });
});
