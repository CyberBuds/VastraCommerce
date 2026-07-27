'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Input, Button, Checkbox } from '@/components/enterprise/BaseInputs';
import { Alert } from '@/components/enterprise/FeedbackComponents';
import { Sparkles, Mail, Lock, ShieldCheck, HelpCircle } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email({ message: 'Enter a valid enterprise email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OPERATOR']),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isAuthenticated, isAuthenticating } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = React.useState<string | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '••••••••', // prefilled placeholder
      role: 'SUPER_ADMIN',
      rememberMe: true,
    },
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      await login(values.email, values.role, values.rememberMe);
      toast.success('Successfully authenticated', {
        description: `Welcome back to Aero Enterprise Dashboard!`,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setAuthError('Authentication failed. Check credentials and retry.');
    }
  };

  const seedAccount = (email: string, role: UserRole) => {
    setValue('email', email);
    setValue('role', role);
    toast.info(`Configured form credentials for ${role}`, { duration: 1500 });
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-slate-900 via-slate-950 to-zinc-950 p-4 justify-center items-center">
      <div className="w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Left column: Branding Hero banner */}
        <div className="lg:col-span-5 bg-linear-to-b from-slate-800 to-slate-950 p-8 flex flex-col justify-between text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand/20 via-transparent to-transparent opacity-80 pointer-events-none" />
          <div className="relative flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-brand text-white shadow-lg shadow-brand/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <span className="font-extrabold text-lg tracking-wider">AERO ENTERPRISE</span>
          </div>

          <div className="relative space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Enterprise Dashboard Foundation.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              A high-precision client architecture for critical systems. Complete with RBAC routing controls, persistent storage intercepts, dynamic visualizers, and state-of-the-art UI modules.
            </p>
          </div>

          <div className="relative text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>FIPS-Compliant Mock Security Layer active</span>
          </div>
        </div>

        {/* Right column: Interactive login form */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Access Control Terminal</h3>
              <p className="text-xs text-zinc-500 mt-1.5 font-semibold">
                Provide security keys or seed a demo workspace role below.
              </p>
            </div>

            {authError && <Alert type="error" title="Access Denied" description={authError} />}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Enterprise Email"
                placeholder="ykgupta042@gmail.com"
                icon={Mail}
                error={errors.email?.message}
                {...register('email')}
                className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white"
              />

              <Input
                label="Security Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
                {...register('password')}
                className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white"
              />

              {/* Role selection for demonstration */}
              <div className="w-full flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400 tracking-wide">
                  Simulate Session Role
                </label>
                <select
                  {...register('role')}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-650 cursor-pointer font-semibold"
                >
                  <option value="SUPER_ADMIN">Super Admin (All permissions)</option>
                  <option value="ADMIN">Admin (Excludes direct system control)</option>
                  <option value="MANAGER">Manager (Excludes admin & systems)</option>
                  <option value="OPERATOR">Operator (Read-Only access)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <Checkbox
                  label="Remember session keys"
                  id="remember-me-checkbox"
                  {...register('rememberMe')}
                  className="text-white accent-zinc-500 border-zinc-700 rounded-xs"
                />
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Forgot Key?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 font-bold text-sm hover:opacity-95"
                isLoading={isSubmitting}
              >
                Sign In to Terminal
              </Button>
            </form>

            {/* Quick Seed Toggles */}
            <div className="border-t border-zinc-800 pt-5 space-y-3">
              <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest leading-none">
                Quick Seed Account Profiles (One-Click)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => seedAccount('ykgupta042@gmail.com', 'SUPER_ADMIN')}
                  className="p-2 border border-zinc-800 hover:border-zinc-750 bg-zinc-950 rounded-lg text-left text-[11px] font-bold text-zinc-400 hover:text-white transition-all hover:scale-[1.01]"
                >
                  <p className="font-extrabold text-zinc-200">Yash Gupta</p>
                  <p className="text-[9px] text-zinc-500 font-medium">Super Admin</p>
                </button>
                <button
                  type="button"
                  onClick={() => seedAccount('admin@enterprise.com', 'ADMIN')}
                  className="p-2 border border-zinc-800 hover:border-zinc-750 bg-zinc-950 rounded-lg text-left text-[11px] font-bold text-zinc-400 hover:text-white transition-all hover:scale-[1.01]"
                >
                  <p className="font-extrabold text-zinc-200">Sarah Connor</p>
                  <p className="text-[9px] text-zinc-500 font-medium">Admin</p>
                </button>
                <button
                  type="button"
                  onClick={() => seedAccount('manager@enterprise.com', 'MANAGER')}
                  className="p-2 border border-zinc-800 hover:border-zinc-750 bg-zinc-950 rounded-lg text-left text-[11px] font-bold text-zinc-400 hover:text-white transition-all hover:scale-[1.01]"
                >
                  <p className="font-extrabold text-zinc-200">Michael Scott</p>
                  <p className="text-[9px] text-zinc-500 font-medium">Manager</p>
                </button>
                <button
                  type="button"
                  onClick={() => seedAccount('operator@enterprise.com', 'OPERATOR')}
                  className="p-2 border border-zinc-800 hover:border-zinc-750 bg-zinc-950 rounded-lg text-left text-[11px] font-bold text-zinc-400 hover:text-white transition-all hover:scale-[1.01]"
                >
                  <p className="font-extrabold text-zinc-200">Dwight Schrute</p>
                  <p className="text-[9px] text-zinc-500 font-medium">Operator</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
