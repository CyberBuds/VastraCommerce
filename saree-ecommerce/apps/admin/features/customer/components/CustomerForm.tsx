'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Input } from '@/components/enterprise/BaseInputs';
import { useCustomerGroups } from '@/hooks/useCustomers';
import { Customer } from '@/types/customer';
import { ArrowLeft, Check, Users, ShieldAlert, Coins, Wallet } from 'lucide-react';
import { motion } from 'motion/react';

const customerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  dob: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  source: z.enum(['WEB', 'IOS', 'ANDROID', 'ADMIN', 'REFERRAL']),
  referralCode: z.string().optional(),
  groupId: z.string().min(1, 'Please assign a customer group'),
  tags: z.string().optional(),
  walletBalance: z.coerce.number().min(0, 'Wallet balance cannot be negative').optional(),
  rewardPoints: z.coerce.number().min(0, 'Loyalty points cannot be negative').optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  initialData?: Customer | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CustomerForm({ initialData, onSubmit, onCancel, isLoading }: CustomerFormProps) {
  const { data: groups = [] } = useCustomerGroups();

  const defaultValues: Partial<CustomerFormValues> = initialData
    ? {
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        dob: initialData.dob || '',
        gender: initialData.gender || 'PREFER_NOT_TO_SAY',
        status: initialData.status,
        emailVerified: initialData.emailVerified,
        phoneVerified: initialData.phoneVerified,
        source: initialData.source,
        referralCode: initialData.referralCode || '',
        groupId: initialData.groupId,
        tags: initialData.tags ? initialData.tags.join(', ') : '',
      }
    : {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        gender: 'PREFER_NOT_TO_SAY',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: false,
        source: 'ADMIN',
        referralCode: '',
        groupId: 'g-default',
        tags: '',
        walletBalance: 0,
        rewardPoints: 0,
      };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues,
  });

  const selectedStatus = watch('status');
  const selectedSource = watch('source');
  const selectedGender = watch('gender');
  const selectedGroupId = watch('groupId');

  const onFormSubmit = (values: CustomerFormValues) => {
    // Process tags
    const processedTags = values.tags
      ? values.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];

    onSubmit({
      ...values,
      tags: processedTags,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8" id="customer-form">
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-850 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
              {initialData ? `Edit Customer Ledger` : `Provision New Customer Account`}
            </h2>
            <p className="text-xs text-slate-500">
              {initialData ? `Modify account settings for ${initialData.firstName} ${initialData.lastName}` : `Register a fresh verified user in CRM core database.`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            <Check className="w-4 h-4 mr-1.5" />
            {initialData ? 'Save Changes' : 'Provision Customer'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Core Profile info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-slate-200/60 dark:border-zinc-800/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Core Demographic Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name *"
                placeholder="e.g. Yash"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name *"
                placeholder="e.g. Gupta"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Email Address *"
                type="email"
                placeholder="e.g. yash@enterprise.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Mobile Contact *"
                placeholder="e.g. +91 98765 43210"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date of Birth (Optional)"
                type="date"
                error={errors.dob?.message}
                {...register('dob')}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tracking-wide">
                  Gender Identification
                </label>
                <select
                  value={selectedGender}
                  onChange={(e: any) => setValue('gender', e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm transition-all outline-hidden focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-slate-900 dark:text-zinc-100"
                >
                  <option value="PREFER_NOT_TO_SAY">Prefer Not To Say</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Profile Tag Labels (Comma-separated)"
                placeholder="e.g. High Net, Tech, Auto Components"
                helperText="Enter tags separated by commas. They will be registered as quick filters."
                error={errors.tags?.message}
                {...register('tags')}
              />
            </div>
          </div>

          {!initialData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 dark:bg-zinc-900/30 rounded-xl p-6 border border-slate-200/60 dark:border-zinc-800/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center">
                  <Wallet className="w-4 h-4 mr-2" />
                  Initial Ledger Seed
                </h3>
                <Input
                  label="Initial Wallet Credit (INR)"
                  type="number"
                  placeholder="0.00"
                  error={errors.walletBalance?.message}
                  {...register('walletBalance')}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center">
                  <Coins className="w-4 h-4 mr-2" />
                  Initial Loyalty Score
                </h3>
                <Input
                  label="Welcome Rewards Points Allocation"
                  type="number"
                  placeholder="0"
                  error={errors.rewardPoints?.message}
                  {...register('rewardPoints')}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Right 1 Column: System metadata classification */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-slate-200/60 dark:border-zinc-800/80 shadow-xs space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2" />
              System Classification
            </h3>

            {/* Status Option Cards */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Operational Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['ACTIVE', 'INACTIVE', 'BLOCKED'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setValue('status', st)}
                    className={`p-2.5 rounded-lg border text-xs font-bold tracking-wider transition-all flex flex-col items-center justify-center gap-1 ${
                      selectedStatus === st
                        ? st === 'ACTIVE'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400'
                          : st === 'INACTIVE'
                          ? 'bg-slate-100 border-slate-300 text-slate-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                          : 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-400'
                        : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-850'
                    }`}
                  >
                    <span>{st}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Groups Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Pricing & Loyalty Tier
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => setValue('groupId', e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm transition-all outline-hidden focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-slate-900 dark:text-zinc-100"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.discountPercentage}% flat discount)
                  </option>
                ))}
              </select>
              {errors.groupId && (
                <span className="text-xs text-red-500 font-medium">{errors.groupId.message}</span>
              )}
            </div>

            {/* Registration Source */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Onboarding Acquisition Channel
              </label>
              <select
                value={selectedSource}
                onChange={(e: any) => setValue('source', e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm transition-all outline-hidden focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-slate-900 dark:text-zinc-100"
              >
                <option value="WEB">Web Desktop Portal</option>
                <option value="IOS">iOS Native Application</option>
                <option value="ANDROID">Android Mobile Client</option>
                <option value="ADMIN">CRM Admin Manual Add</option>
                <option value="REFERRAL">Referral Invite Program</option>
              </select>
            </div>

            {selectedSource === 'REFERRAL' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-2"
              >
                <Input
                  label="Referral Code ID"
                  placeholder="e.g. YASH95"
                  error={errors.referralCode?.message}
                  {...register('referralCode')}
                />
              </motion.div>
            )}

            {/* Account Verification Toggles */}
            <div className="pt-2 space-y-3">
              <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block uppercase tracking-wide">
                Channel Verification
              </label>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-zinc-850/50 border border-slate-100 dark:border-zinc-800">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Email Address Verified</span>
                  <span className="text-[10px] text-slate-400">SMTP delivery handshake complete</span>
                </div>
                <input
                  type="checkbox"
                  className="rounded-sm border-slate-300 text-slate-900 focus:ring-slate-500 h-4 w-4"
                  {...register('emailVerified')}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-zinc-850/50 border border-slate-100 dark:border-zinc-800">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Mobile Number Verified</span>
                  <span className="text-[10px] text-slate-400">SMS OTP token verified</span>
                </div>
                <input
                  type="checkbox"
                  className="rounded-sm border-slate-300 text-slate-900 focus:ring-slate-500 h-4 w-4"
                  {...register('phoneVerified')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
