'use client';

import * as React from 'react';
import { CustomerForm } from '@/features/customer/components/CustomerForm';
import { useCreateCustomer } from '@/hooks/useCustomers';
import { useRouter } from 'next/navigation';

export default function NewCustomerPage() {
  const router = useRouter();
  const createMutation = useCreateCustomer();

  const handleSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/dashboard/customers/list');
      },
    });
  };

  const handleCancel = () => {
    router.push('/dashboard/customers/list');
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xl" id="new-customer-page-root">
      <CustomerForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
