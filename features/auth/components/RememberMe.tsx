'use client';

import React from 'react';
import Link from 'next/link';
import { UseFormRegisterReturn } from 'react-hook-form';

interface RememberMeProps {
  register: UseFormRegisterReturn;
}

export function RememberMe({ register }: RememberMeProps) {
  return (
    <div className="flex items-center justify-between text-xs">
      <label className="flex items-center gap-2 cursor-pointer group select-none">
        <input
          type="checkbox"
          {...register}
          className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 dark:bg-slate-900 cursor-pointer accent-blue-600"
        />
        <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
          Remember me for 30 days
        </span>
      </label>

      <Link
        href="/forgot-password"
        className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
      >
        Forgot password?
      </Link>
    </div>
  );
}
