'use client';

import * as React from 'react';
import { CustomerForm } from '@/features/customer/components/CustomerForm';
import { useCustomer, useUpdateCustomer } from '@/hooks/useCustomers';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/enterprise/BaseInputs';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditCustomerPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  
  const { data: customer, isLoading, isError } = useCustomer(id);
  const updateMutation = useUpdateCustomer();

  const handleSubmit = (data: any) => {
    updateMutation.mutate({ id, data }, {
      onSuccess: () => {
        router.push('/dashboard/customers/list');
      },
    });
  };

  const handleCancel = () => {
    router.push('/dashboard/customers/list');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <div className="h-8 w-8 border-4 border-slate-900 dark:border-zinc-100 border-t-transparent animate-spin rounded-full" />
        <span className="text-xs text-slate-400 font-mono">Loading customer profile...</span>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <span className="text-xs font-bold text-rose-500 font-mono">CRITICAL ERROR: CUSTOMER NOT FOUND IN DATABASE</span>
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/customers/list')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Return To Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xl" id="edit-customer-page-root">
      <CustomerForm
        initialData={customer}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
