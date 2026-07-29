// app/coupons/new/page.tsx
import { CouponForm } from '../components/coupon-form';

const NewCouponPage = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Create Coupon</h1>
      <CouponForm />
    </div>
  );
};

export default NewCouponPage;
