'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Mail, Loader2, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';

import { AuthHeader } from './AuthHeader';
import { PasswordField } from './PasswordField';
import { RememberMe } from './RememberMe';
import { SocialLogin } from './SocialLogin';
import { AuthFooter } from './AuthFooter';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid work email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OPERATOR']),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginCard() {
  const { login } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'superadmin@example.com',
      password: 'Admin@123',
      role: 'SUPER_ADMIN',
      rememberMe: true,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      await login(values.email, values.password, values.role, values.rememberMe);
      toast.success('Successfully authenticated', {
        description: `Welcome back to VastraCommerce Admin!`,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickSeed = (email: string, password: string, role: UserRole) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    setValue('role', role, { shouldValidate: true });
    setAuthError(null);
    toast.info(`Configured form credentials for ${role}`, { duration: 1500 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto space-y-6"
    >
      <AuthHeader />

      {authError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-700 dark:text-red-300 text-xs font-medium"
        >
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Sign in failed</p>
            <p className="text-[11px] text-red-600/90 dark:text-red-400/90">{authError}</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="email-input"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Work Email
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email-input"
              type="email"
              autoFocus
              placeholder="name@company.com"
              disabled={isSubmitting}
              {...register('email')}
              className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none transition-all duration-200 ${
                errors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/15'
              } ${isSubmitting ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-950' : ''}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <PasswordField
          register={register('password')}
          error={errors.password?.message}
          disabled={isSubmitting}
        />

        {/* Role Simulation Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="role-select"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Simulated Role
            </label>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              RBAC Context
            </span>
          </div>
          <select
            id="role-select"
            disabled={isSubmitting}
            {...register('role')}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/15 cursor-pointer font-medium transition-all"
          >
            <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
            <option value="ADMIN">Store Admin (Operations & Orders)</option>
            <option value="MANAGER">Sales Manager (Catalog & CRM)</option>
            <option value="OPERATOR">Fulfilment Operator (Read Only)</option>
          </select>
        </div>

        {/* Remember Me & Forgot Password */}
        <RememberMe register={register('rememberMe')} />

        {/* Primary Sign In Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Role Profiles */}
      <SocialLogin onSelectProfile={handleQuickSeed} />

      {/* Footer */}
      <AuthFooter />
    </motion.div>
  );
}
