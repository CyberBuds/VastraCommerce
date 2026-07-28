'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoginCard } from '@/features/auth/components/LoginCard';
import { DashboardPreview } from '@/features/auth/components/DashboardPreview';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 flex items-center justify-center p-0 lg:p-6 xl:p-10 transition-colors">
      <div className="w-full max-w-7xl min-h-screen lg:min-h-[720px] bg-white dark:bg-slate-950 border-0 lg:border border-slate-200/80 dark:border-slate-800 lg:rounded-3xl shadow-none lg:shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column (40% Desktop): Authentication Form Card */}
        <div className="lg:col-span-5 p-6 sm:p-10 xl:p-12 flex flex-col justify-between bg-white dark:bg-slate-950 z-10">
          <LoginCard />
        </div>

        {/* Right Column (60% Desktop): SaaS Dashboard Preview */}
        <div className="hidden lg:block lg:col-span-7 bg-slate-900">
          <DashboardPreview />
        </div>
      </div>
    </div>
  );
}
