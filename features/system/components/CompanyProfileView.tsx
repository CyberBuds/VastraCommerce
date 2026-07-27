'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSystemStore } from '@/store/systemStore';
import { Card } from '@/components/enterprise/FeedbackComponents';
import { Button, Input } from '@/components/enterprise/BaseInputs';
import { Autocomplete } from '@/components/enterprise/ComplexInputs';
import { Building2, Save, Globe, Mail, Phone, MapPin, Calendar, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const companySchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  legalName: z.string().min(2, 'Legal name is required'),
  taxId: z.string().min(2, 'Tax ID / EIN is required'),
  registrationNumber: z.string().min(2, 'Registration number is required'),
  supportEmail: z.string().email('Valid email is required'),
  supportPhone: z.string().min(5, 'Support phone is required'),
  websiteUrl: z.string().url('Valid website URL is required'),
  addressLine1: z.string().min(2, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State / Region is required'),
  zipCode: z.string().min(2, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  timezone: z.string(),
  fiscalYearStartMonth: z.string(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export function CompanyProfileView() {
  const { companyProfile, updateCompanyProfile } = useSystemStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: companyProfile.companyName,
      legalName: companyProfile.legalName,
      taxId: companyProfile.taxId,
      registrationNumber: companyProfile.registrationNumber,
      supportEmail: companyProfile.supportEmail,
      supportPhone: companyProfile.supportPhone,
      websiteUrl: companyProfile.websiteUrl,
      addressLine1: companyProfile.addressLine1,
      addressLine2: companyProfile.addressLine2 || '',
      city: companyProfile.city,
      state: companyProfile.state,
      zipCode: companyProfile.zipCode,
      country: companyProfile.country,
      timezone: companyProfile.timezone,
      fiscalYearStartMonth: companyProfile.fiscalYearStartMonth,
    },
  });

  const onSubmit = async (values: CompanyFormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    updateCompanyProfile(values);
    toast.success('Company Profile Updated', {
      description: 'Legal entity details and branding metadata synchronized across all clusters.',
    });
    reset(values);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
          Company Profile & Corporate Entity
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-semibold">
          Manage corporate registration details, tax identifiers, headquarter addresses, and fiscal calendars
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card
          header={
            <div className="flex items-center gap-2">
              <Building2 className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Legal Registration & Tax Info</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Brand Display Name"
              placeholder="Aero Enterprise Global Inc."
              error={errors.companyName?.message}
              {...register('companyName')}
            />
            <Input
              label="Legal Registered Name"
              placeholder="Aero Technologies LLC"
              error={errors.legalName?.message}
              {...register('legalName')}
            />
            <Input
              label="Tax Identification / EIN"
              placeholder="US-EIN-894321908"
              error={errors.taxId?.message}
              {...register('taxId')}
            />
            <Input
              label="Corporate Registration Number"
              placeholder="REG-DEL-2024-9988"
              error={errors.registrationNumber?.message}
              {...register('registrationNumber')}
            />
          </div>
        </Card>

        <Card
          header={
            <div className="flex items-center gap-2">
              <Globe className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Contact & Support Operations</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Support Email"
              type="email"
              placeholder="secops@enterprise.aero"
              error={errors.supportEmail?.message}
              {...register('supportEmail')}
            />
            <Input
              label="Support Phone Number"
              placeholder="+1 (800) 555-0199"
              error={errors.supportPhone?.message}
              {...register('supportPhone')}
            />
            <Input
              label="Corporate Website URL"
              placeholder="https://enterprise.aero"
              error={errors.websiteUrl?.message}
              {...register('websiteUrl')}
            />
          </div>
        </Card>

        <Card
          header={
            <div className="flex items-center gap-2">
              <MapPin className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Headquarters Address</span>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Street Address Line 1"
              placeholder="100 Aerospace Blvd, Suite 400"
              error={errors.addressLine1?.message}
              {...register('addressLine1')}
            />
            <Input
              label="Street Address Line 2 (Optional)"
              placeholder="Building B, Floor 4"
              {...register('addressLine2')}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="City"
                placeholder="Seattle"
                error={errors.city?.message}
                {...register('city')}
              />
              <Input
                label="State / Province"
                placeholder="WA"
                error={errors.state?.message}
                {...register('state')}
              />
              <Input
                label="Zip / Postal Code"
                placeholder="98101"
                error={errors.zipCode?.message}
                {...register('zipCode')}
              />
              <Input
                label="Country"
                placeholder="United States"
                error={errors.country?.message}
                {...register('country')}
              />
            </div>
          </div>
        </Card>

        <Card
          header={
            <div className="flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Operational Timezone & Fiscal Year</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  label="Primary Cluster Timezone"
                  options={[
                    { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
                    { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
                    { value: 'Europe/London', label: 'London, UK (GMT/BST)' },
                    { value: 'Europe/Berlin', label: 'Berlin, Germany (CET)' },
                    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
                    { value: 'Asia/Tokyo', label: 'Tokyo, Japan (JST)' },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="fiscalYearStartMonth"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  label="Fiscal Year Start Month"
                  options={[
                    { value: 'January', label: 'January' },
                    { value: 'April', label: 'April' },
                    { value: 'July', label: 'July' },
                    { value: 'October', label: 'October' },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" variant="primary" icon={Save} isLoading={isSubmitting} disabled={!isDirty}>
            Save Corporate Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
