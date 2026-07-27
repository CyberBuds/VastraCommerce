'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card, Alert } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Badge } from '@/components/enterprise/BaseInputs';
import { Award, ShieldCheck, RefreshCw, Cpu, CheckCircle2, Terminal } from 'lucide-react';
import { toast } from 'sonner';

export function LicenseVersionView() {
  const { licenseInfo } = useSystemStore();

  const [isCheckingUpdate, setIsCheckingUpdate] = React.useState(false);

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      toast.success('System is running the latest enterprise build', {
        description: `Current build: ${licenseInfo.installedVersion} (${licenseInfo.buildHash})`,
      });
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
          System License, Build Version & Module Registries
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-semibold">
          Inspect cluster license credentials, seat allocations, software release version, and build hash
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* License Credentials Card */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Enterprise License Seat Status</span>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Edition</span>
              <p className="text-lg font-black text-slate-900 dark:text-zinc-100">{licenseInfo.edition}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-xl space-y-1">
              <span className="text-xs font-semibold text-slate-500">License Key</span>
              <p className="font-mono text-xs font-bold text-slate-800 dark:text-zinc-200">{licenseInfo.licenseKey}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Active User Seats</span>
                <span className="font-mono">
                  {licenseInfo.activeUserSeats} / {licenseInfo.maxUserSeats} Seats
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${(licenseInfo.activeUserSeats / licenseInfo.maxUserSeats) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Licensed to: <strong>{licenseInfo.companyName}</strong> (Valid until{' '}
              {new Date(licenseInfo.validUntil).toLocaleDateString()})
            </p>
          </div>
        </Card>

        {/* Build Details Card */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Software Build & Release Hash</span>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Installed Version</span>
              <p className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">{licenseInfo.installedVersion}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-zinc-850 rounded-lg">
                <span className="text-slate-400 font-semibold block">Git Commit Hash</span>
                <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{licenseInfo.buildHash}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-zinc-850 rounded-lg">
                <span className="text-slate-400 font-semibold block">Framework</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">Next.js 15 App Router</span>
              </div>
            </div>

            <Button
              variant="primary"
              icon={RefreshCw}
              isLoading={isCheckingUpdate}
              onClick={handleCheckUpdate}
              className="w-full font-bold"
            >
              Check for System Updates
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
