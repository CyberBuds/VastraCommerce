// app/discount-rules/page.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DiscountRulesTable } from './components/discount-rule-table';

const DiscountRulesPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Discount Rules</h1>
        <Button asChild>
          <Link href="/discount-rules/new">Create Rule</Link>
        </Button>
      </div>
      <DiscountRulesTable />
    </div>
  );
};

export default DiscountRulesPage;
