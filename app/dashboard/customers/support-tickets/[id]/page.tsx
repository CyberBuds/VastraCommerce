'use client';

import * as React from 'react';
import { TicketDetailView } from '@/features/customer/components/TicketDetailView';
import { useCustomers } from '@/hooks/useCustomers';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/enterprise/BaseInputs';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TicketDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const { data: customers = [], isLoading, isError } = useCustomers();

  let foundData = null;
  for (const c of customers) {
    const t = c.tickets.find(tick => tick.id === id);
    if (t) {
      foundData = { customer: c, ticket: t };
      break;
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <div className="h-8 w-8 border-4 border-slate-900 dark:border-zinc-100 border-t-transparent animate-spin rounded-full" />
        <span className="text-xs text-slate-400 font-mono">Syncing helpdesk chat stream...</span>
      </div>
    );
  }

  if (isError || !foundData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <span className="text-xs font-bold text-rose-500 font-mono">HELPDESK ACCESS EXPIRED OR FAULT DETECTED</span>
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/customers/support-tickets')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Return To SLA Queue
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xl" id="ticket-detail-page-root">
      <TicketDetailView
        customer={foundData.customer}
        ticket={foundData.ticket}
        onBack={() => router.push('/dashboard/customers/support-tickets')}
      />
    </div>
  );
}
