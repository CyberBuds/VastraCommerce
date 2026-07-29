'use client';

// app/abandoned-cart/page.tsx
import { AbandonedCartsTable } from './components/abandoned-cart-table';

const AbandonedCartsPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Abandoned Carts</h1>
      </div>
      <AbandonedCartsTable />
    </div>
  );
};

export default AbandonedCartsPage;
