'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Button } from '@/components/enterprise/BaseInputs';
import { Mail, Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const forgotSchema = z.object({
  email: z.string().email({ message: 'Enter a valid enterprise email address' }),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (values: ForgotFormValues) => {
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    toast.success('Recovery link generated', {
      description: `Security token sent to ${values.email}`,
    });
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-slate-900 via-slate-950 to-zinc-950 p-4 justify-center items-center">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="p-1.5 rounded-lg bg-zinc-800 text-white inline-flex items-center justify-center mb-1">
            <Sparkles className="w-5 h-5" />
          </span>
          <h3 className="text-lg font-bold text-white">Reset Credentials</h3>
          <p className="text-xs text-zinc-500 font-semibold">
            Retrieve active session access token below.
          </p>
        </div>

        {submitted ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 text-center space-y-4">
            <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
              If an enterprise profile exists, you will receive a secure token to synchronize credentials. Check spam filters.
            </p>
            <Link
              href="/reset-password?token=mock-secure-reset-key"
              className="inline-flex w-full justify-center items-center font-bold text-xs bg-white text-zinc-900 rounded-lg py-2 hover:bg-zinc-100 transition-colors"
            >
              Simulate Clicking Reset Link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Enterprise Email"
              placeholder="ykgupta042@gmail.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
              className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white"
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full py-2"
              isLoading={isSubmitting}
            >
              Generate Security Key
            </Button>
          </form>
        )}

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
