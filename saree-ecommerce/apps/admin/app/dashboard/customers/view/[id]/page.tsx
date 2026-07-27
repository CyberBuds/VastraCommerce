'use client';

import * as React from 'react';
import { CustomerProfile360 } from '@/features/customer/components/CustomerProfile360';
import { useCustomer } from '@/hooks/useCustomers';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { Button } from '@/components/enterprise/BaseInputs';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ViewCustomerPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  
  const { data: customer, isLoading, isError } = useCustomer(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <div className="h-8 w-8 border-4 border-slate-900 dark:border-zinc-100 border-t-transparent animate-spin rounded-full" />
        <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">Compiling Customer 360° View...</span>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <span className="text-xs font-bold text-rose-500 font-mono">CRM LEDGER ACCESS ERROR: PROFILE FAULT</span>
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/customers/list')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Return To Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="view-customer-page-root">
      {/* Small Header for easy editing access and directory navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/customers/list')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Customers Directory
        </Button>
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/customers/edit/${id}`)}>
          <Edit2 className="w-4 h-4 mr-1.5" /> Edit Profile Ledger
        </Button>
      </div>

      <CustomerProfile360 customer={customer} />
    </div>
  );
}
