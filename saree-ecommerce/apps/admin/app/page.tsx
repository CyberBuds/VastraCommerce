'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/enterprise/InteractiveComponents';

export default function RootIndexPage() {
  const router = useRouter();
  const { isAuthenticated, isAuthenticating, checkSession } = useAuthStore();

  React.useEffect(() => {
    checkSession();
  }, [checkSession]);

  React.useEffect(() => {
    if (!isAuthenticating) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isAuthenticating, router]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center space-y-4">
        <Spinner className="w-8 h-8 border-slate-700 border-t-white" />
        <span className="text-xs font-bold text-slate-400 tracking-widest uppercase animate-pulse">
          Routing Gateway...
        </span>
      </div>
    </div>
  );
}
