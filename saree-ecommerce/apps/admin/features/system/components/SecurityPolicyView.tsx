'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card, Alert } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Switch, Badge } from '@/components/enterprise/BaseInputs';
import { TagInput } from '@/components/enterprise/ComplexInputs';
import { ShieldCheck, Lock, Key, KeyRound, Save, Globe, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export function SecurityPolicyView() {
  const { securityPolicy, updateSecurityPolicy } = useSystemStore();

  const [minPasswordLength, setMinPasswordLength] = React.useState(securityPolicy.minPasswordLength);
  const [requireSpecialChar, setRequireSpecialChar] = React.useState(securityPolicy.requireSpecialChar);
  const [requireNumbers, setRequireNumbers] = React.useState(securityPolicy.requireNumbers);
  const [requireUppercase, setRequireUppercase] = React.useState(securityPolicy.requireUppercase);
  const [passwordExpiryDays, setPasswordExpiryDays] = React.useState(securityPolicy.passwordExpiryDays);
  const [mfaEnforcement, setMfaEnforcement] = React.useState(securityPolicy.mfaEnforcement);
  const [maxLoginAttempts, setMaxLoginAttempts] = React.useState(securityPolicy.maxLoginAttempts);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = React.useState(securityPolicy.sessionTimeoutMinutes);
  const [ipWhitelist, setIpWhitelist] = React.useState(securityPolicy.ipWhitelist);
  const [ssoEnabled, setSsoEnabled] = React.useState(securityPolicy.ssoEnabled);
  const [ssoProvider, setSsoProvider] = React.useState(securityPolicy.ssoProvider);

  const handleSave = () => {
    updateSecurityPolicy({
      minPasswordLength,
      requireSpecialChar,
      requireNumbers,
      requireUppercase,
      passwordExpiryDays,
      mfaEnforcement,
      maxLoginAttempts,
      sessionTimeoutMinutes,
      ipWhitelist,
      ssoEnabled,
      ssoProvider,
    });
    toast.success('Security Policy Updated', {
      description: 'Enforcing authentication rules across all auth interceptors.',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
          Security Policy & Multi-Factor Enforcement
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-semibold">
          Configure corporate password complexity, MFA mandatory rules, IP geofencing, session inactivity timeouts, and Okta/Azure SSO
        </p>
      </div>

      <div className="space-y-6">
        {/* Password Policy */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <Lock className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Password Complexity & Expiry Rules</span>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Min Password Length"
                type="number"
                min="8"
                max="32"
                value={minPasswordLength}
                onChange={(e) => setMinPasswordLength(Number(e.target.value))}
              />
              <Input
                label="Password Expiry (Days)"
                type="number"
                value={passwordExpiryDays}
                onChange={(e) => setPasswordExpiryDays(Number(e.target.value))}
              />
              <Input
                label="Max Failed Attempts before Lockout"
                type="number"
                value={maxLoginAttempts}
                onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <Switch label="Require Special Characters (!@#$)" checked={requireSpecialChar} onChange={(e) => setRequireSpecialChar(e.target.checked)} />
              <Switch label="Require Numbers (0-9)" checked={requireNumbers} onChange={(e) => setRequireNumbers(e.target.checked)} />
              <Switch label="Require Uppercase Letters (A-Z)" checked={requireUppercase} onChange={(e) => setRequireUppercase(e.target.checked)} />
            </div>
          </div>
        </Card>

        {/* MFA & Session Inactivity */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <Smartphone className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">MFA & Inactivity Session Control</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">MFA Enforcement Policy</label>
              <select
                className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold"
                value={mfaEnforcement}
                onChange={(e) => setMfaEnforcement(e.target.value as any)}
              >
                <option value="MANDATORY">Mandatory for All Users</option>
                <option value="OPTIONAL">Optional User Preference</option>
                <option value="DISABLED">Disabled (Not Recommended)</option>
              </select>
            </div>

            <Input
              label="Session Inactivity Auto-Logout (Minutes)"
              type="number"
              value={sessionTimeoutMinutes}
              onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
            />
          </div>
        </Card>

        {/* IP Whitelist Geofencing */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <Globe className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">IP Whitelist Geofencing</span>
            </div>
          }
        >
          <TagInput
            label="Allowed IP Subnets / CIDR Blocks"
            tags={ipWhitelist}
            onChange={setIpWhitelist}
            placeholder="Add IP address or CIDR range (e.g. 192.168.1.0/24)..."
          />
        </Card>

        {/* Enterprise SSO / SAML */}
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
                <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Single Sign-On (SSO / SAML 2.0 / OIDC)</span>
              </div>
              <Switch checked={ssoEnabled} onChange={(e) => setSsoEnabled(e.target.checked)} />
            </div>
          }
        >
          {ssoEnabled ? (
            <div className="space-y-4">
              <Input
                label="SSO Identity Provider Title"
                value={ssoProvider}
                onChange={(e) => setSsoProvider(e.target.value)}
              />
              <Alert
                type="info"
                title="SSO Integration Active"
                description="User credential checks route directly through Okta / Azure Active Directory SAML 2.0 endpoint."
              />
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Toggle switch to enable corporate SSO SAML integration.</p>
          )}
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" icon={Save} onClick={handleSave}>
            Save Security Policy
          </Button>
        </div>
      </div>
    </div>
  );
}
