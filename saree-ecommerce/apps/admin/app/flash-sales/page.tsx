// app/flash-sales/page.tsx
import { Button } from '@/components/enterprise/BaseInputs';
import Link from 'next/link';
import { FlashSalesTable } from './components/flash-sale-table';

const FlashSalesPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Flash Sales</h1>
        <Button asChild>
          <Link href="/flash-sales/new">Create Flash Sale</Link>
        </Button>
      </div>
      <FlashSalesTable />
    </div>
  );
};

export default FlashSalesPage;
