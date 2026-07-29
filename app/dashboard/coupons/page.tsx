// app/coupons/page.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CouponsTable } from './components/coupon-table';

const CouponsPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <Button asChild>
          <Link href="/coupons/new">Create Coupon</Link>
        </Button>
      </div>
      <CouponsTable />
    </div>
  );
};

export default CouponsPage;
