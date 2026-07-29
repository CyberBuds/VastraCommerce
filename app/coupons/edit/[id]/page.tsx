// app/coupons/edit/[id]/page.tsx
'use client';

import { CouponForm } from '../../components/coupon-form';
import { useGetCoupon } from '@/features/marketing/hooks/useCoupons';
import { useParams } from 'next/navigation';

const EditCouponPage = () => {
  const params = useParams();
  const { id } = params;
  const { data: coupon, isLoading, isError } = useGetCoupon(id as string);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading coupon data</div>;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Coupon</h1>
      <CouponForm initialData={coupon} />
    </div>
  );
};

export default EditCouponPage;
