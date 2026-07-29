// apps/admin/app/coupons/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react';
import CouponsPage from '../page';

describe('CouponsPage', () => {
    it('should render the page with the table', () => {
        render(<CouponsPage />);
        
        expect(screen.getByText('Coupons')).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
    });
});
