'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLayoutStore } from '@/store/layoutStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Card } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Switch } from '@/components/enterprise/BaseInputs';
import { Autocomplete, DatePicker, TagInput, RichTextEditor } from '@/components/enterprise/ComplexInputs';
import { Sliders, Settings, HelpCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

// Validation Schema for general application settings
const settingsSchema = z.object({
  appName: z.string().min(2, { message: 'App name must be at least 2 characters' }),
  supportEmail: z.string().email({ message: 'Enter a valid corporate email' }),
  maxUsers: z.number().min(1, { message: 'Minimum 1 seat required' }),
  fiscalYearStart: z.string(),
  defaultCurrency: z.string(),
  allowedDomains: z.array(z.string()).min(1, { message: 'At least one corporate domain required' }),
  systemMessage: z.string(),
  twoFactorMandatory: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function GeneralSettingsPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { settings, updateSettings } = useSettingsStore();

  // Page Header & Breadcrumbs
  React.useEffect(() => {
    setActiveMenuId('settings');
    setBreadcrumbs([
      { label: 'Settings', href: '/dashboard/settings/general' },
      { label: 'General Configuration' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      appName: settings.appName,
      supportEmail: 'secops@enterprise.aero',
      maxUsers: 500,
      fiscalYearStart: new Date('2026-04-01').toISOString(),
      defaultCurrency: 'USD',
      allowedDomains: ['enterprise.aero', 'aero.com'],
      systemMessage: '<b>Notice:</b> Standard security maintenance window schedules apply on Sunday morning.',
      twoFactorMandatory: true,
    },
  });

  const onSubmit = async (values: SettingsFormValues) => {
    // Simulate API Saving
    await new Promise((r) => setTimeout(r, 800));

    // Update global Zustand settings store
    updateSettings({
      appName: values.appName,
    });

    toast.success('System Settings Updated', {
      description: 'Corporate settings have been synchronized on all clusters.',
    });

    // Reset dirty state to current values
    reset(values);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
          General Configurations
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-semibold">
          Adjust corporate registry settings, security parameters, and regional defaults
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main settings column */}
          <div className="md:col-span-8 space-y-6">
            <Card
              header={
                <div className="flex items-center gap-2">
                  <Settings className="w-4.5 h-4.5" />
                  <span className="font-bold text-sm text-slate-800 dark:text-zinc-150">Brand & Registry Settings</span>
                </div>
              }
            >
              <div className="space-y-4">
                <Input
                  label="Application Name"
                  placeholder="Aero Enterprise"
                  error={errors.appName?.message}
                  {...register('appName')}
                />

                <Input
                  label="Corporate SecOps Email"
                  placeholder="secops@enterprise.aero"
                  error={errors.supportEmail?.message}
                  {...register('supportEmail')}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="User License Seat Limit"
                    type="number"
                    error={errors.maxUsers?.message}
                    {...register('maxUsers', { valueAsNumber: true })}
                  />

                  {/* Autocomplete for Default Currency selection */}
                  <Controller
                    name="defaultCurrency"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        label="System Default Currency"
                        options={[
                          { value: 'USD', label: 'USD - US Dollar' },
                          { value: 'EUR', label: 'EUR - Euro' },
                          { value: 'GBP', label: 'GBP - British Pound' },
                          { value: 'INR', label: 'INR - Indian Rupee' },
                          { value: 'JPY', label: 'JPY - Japanese Yen' },
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Search currency..."
                      />
                    )}
                  />
                </div>

                {/* Date Picker for Fiscal Year Calendar */}
                <Controller
                  name="fiscalYearStart"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Fiscal Year Calendar Start"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.fiscalYearStart?.message}
                    />
                  )}
                />

                {/* Tag Input for Allowed Email domains */}
                <Controller
                  name="allowedDomains"
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      label="Allowed Corporate Email Domains"
                      tags={field.value}
                      onChange={field.onChange}
                      placeholder="Add corporate domain (press Enter)..."
                    />
                  )}
                />
              </div>
            </Card>

            {/* Rich Text Editor card */}
            <Card
              header={
                <div className="flex items-center gap-2">
                  <Sliders className="w-4.5 h-4.5" />
                  <span className="font-bold text-sm text-slate-800 dark:text-zinc-150">Global Banner Notice</span>
                </div>
              }
            >
              <Controller
                name="systemMessage"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    label="Notice Content (HTML Supported)"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter security notice banner text..."
                  />
                )}
              />
            </Card>
          </div>

          {/* Right/Secondary parameters column */}
          <div className="md:col-span-4 space-y-6">
            <Card
              header={
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4.5 h-4.5" />
                  <span className="font-bold text-sm text-slate-800 dark:text-zinc-150">Access Polices</span>
                </div>
              }
            >
              <div className="space-y-4">
                {/* Switch for mandatory 2FA security checks */}
                <Controller
                  name="twoFactorMandatory"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      label="Two-Factor Security Enforcement"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
                <p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 leading-normal">
                  If activated, session check intercepts verify multifactor credential tokens.
                </p>
              </div>
            </Card>

            {/* Save trigger card */}
            <Card>
              <div className="space-y-4 text-center">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full font-bold text-sm"
                  isLoading={isSubmitting}
                  disabled={!isDirty}
                  icon={Save}
                >
                  Apply System Sync
                </Button>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Submitting propagates these parameters down to global proxy instances instantly.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
