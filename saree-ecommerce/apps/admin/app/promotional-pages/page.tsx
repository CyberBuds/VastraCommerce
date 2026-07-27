// app/promotional-pages/page.tsx
import { Button } from '@/components/enterprise/BaseInputs';
import Link from 'next/link';
import { PromotionalPagesTable } from './components/promotional-page-table';

const PromotionalPagesPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Promotional Pages</h1>
        <Button asChild>
          <Link href="/promotional-pages/new">Create Page</Link>
        </Button>
      </div>
      <PromotionalPagesTable />
    </div>
  );
};

export default PromotionalPagesPage;
