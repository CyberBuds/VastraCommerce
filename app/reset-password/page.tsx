'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Button } from '@/components/enterprise/BaseInputs';
import { Lock, Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const resetSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password confirmation must match' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (values: ResetFormValues) => {
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Security key reset complete', {
      description: 'Your account login key has been updated.',
    });
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-slate-900 via-slate-950 to-zinc-950 p-4 justify-center items-center">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="p-1.5 rounded-lg bg-zinc-800 text-white inline-flex items-center justify-center mb-1">
            <Sparkles className="w-5 h-5" />
          </span>
          <h3 className="text-lg font-bold text-white">Reset Secure Keys</h3>
          <p className="text-xs text-zinc-500 font-semibold">
            Specify a brand-new cryptographically-sound key.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Security Key"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.password?.message}
            {...register('password')}
            className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white"
          />

          <Input
            label="Confirm Security Key"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
            className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2"
            isLoading={isSubmitting}
          >
            Update Login Key
          </Button>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Login Terminal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
