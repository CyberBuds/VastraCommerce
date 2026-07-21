'use client';

import * as React from 'react';
import { useCustomers, useCustomerGroups } from '@/hooks/useCustomers';
import { CustomerTable } from '@/features/customer/components/CustomerTable';
import { Button } from '@/components/enterprise/BaseInputs';
import { Plus, Users, Wallet, Coins, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

export default function CustomerListPage() {
  const router = useRouter();
  const { data: customers = [], isLoading } = useCustomers();
  const { data: groups = [] } = useCustomerGroups();

  const totalCount = customers.length;
  const activeCount = customers.filter(c => c.status === 'ACTIVE').length;
  const totalBalance = customers.reduce((sum, c) => sum + c.walletBalance, 0);
  const totalPoints = customers.reduce((sum, c) => sum + c.rewardPoints, 0);

  return (
    <div className="space-y-6" id="customers-list-viewport">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <Users className="w-5.5 h-5.5" />
            CRM & Relationship Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your consumer cohorts, wallet reserves, loyalty points tiers, and support service pipelines.
          </p>
        </div>
        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/dashboard/customers/new')}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Provision Customer
          </Button>
        </div>
      </div>

      {/* Stats Bento Deck */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Registered Customers</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{totalCount} users</span>
          </div>
          <div className="p-2.5 bg-slate-100 dark:bg-zinc-800 rounded-lg text-slate-600 dark:text-zinc-300"><Users className="w-4 h-4" /></div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Active Accounts</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{activeCount} users</span>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-emerald-600 dark:text-emerald-400"><UserCheck className="w-4 h-4" /></div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Total Wallet Assets</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg text-indigo-600 dark:text-indigo-400"><Wallet className="w-4 h-4" /></div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Active Reward Points</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">{totalPoints.toLocaleString()} pts</span>
          </div>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-amber-600 dark:text-amber-500"><Coins className="w-4 h-4" /></div>
        </div>
      </div>

      {/* Main Table card wrapper */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs">
        <CustomerTable customers={customers} isLoading={isLoading} />
      </div>
    </div>
  );
}
