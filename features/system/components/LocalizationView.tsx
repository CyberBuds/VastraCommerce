'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card, Alert } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Switch, Badge } from '@/components/enterprise/BaseInputs';
import { TagInput } from '@/components/enterprise/ComplexInputs';
import { Languages, DollarSign, Clock, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function LocalizationView() {
  const { localization, updateLocalization } = useSystemStore();

  const [defaultLanguage, setDefaultLanguage] = React.useState(localization.defaultLanguage);
  const [supportedLanguages, setSupportedLanguages] = React.useState(localization.supportedLanguages);
  const [defaultCurrency, setDefaultCurrency] = React.useState(localization.defaultCurrency);
  const [supportedCurrencies, setSupportedCurrencies] = React.useState(localization.supportedCurrencies);
  const [autoSyncExchangeRates, setAutoSyncExchangeRates] = React.useState(localization.autoSyncExchangeRates);
  const [exchangeRateApiProvider, setExchangeRateApiProvider] = React.useState(localization.exchangeRateApiProvider);
  const [dateFormat, setDateFormat] = React.useState(localization.dateFormat);
  const [timeFormat, setTimeFormat] = React.useState(localization.timeFormat);

  const handleSave = () => {
    updateLocalization({
      defaultLanguage,
      supportedLanguages,
      defaultCurrency,
      supportedCurrencies,
      autoSyncExchangeRates,
      exchangeRateApiProvider,
      dateFormat,
      timeFormat,
    });
    toast.success('Localization Parameters Updated', {
      description: 'Regional currency formats, language packs & date representations saved.',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
          Localization, Language Packs & Currency Formatting
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-semibold">
          Configure multi-language packs, exchange rate provider APIs, and global date-time representation patterns
        </p>
      </div>

      <div className="space-y-6">
        {/* Language Configuration */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <Languages className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Language Packs & Default Locale</span>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Default Platform Locale</label>
                <select
                  className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold"
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                >
                  <option value="en-US">English (United States) - en-US</option>
                  <option value="es-ES">Spanish (Spain) - es-ES</option>
                  <option value="de-DE">German (Germany) - de-DE</option>
                  <option value="fr-FR">French (France) - fr-FR</option>
                  <option value="ja-JP">Japanese (Japan) - ja-JP</option>
                </select>
              </div>

              <Input label="Active Language Pack Count" value={`${supportedLanguages.length} Active Packs`} disabled />
            </div>

            <TagInput
              label="Supported Language Codes (e.g. en-US, es-ES, de-DE)"
              tags={supportedLanguages}
              onChange={setSupportedLanguages}
              placeholder="Add language code..."
            />
          </div>
        </Card>

        {/* Currency & Exchange Rates */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <DollarSign className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Multi-Currency & Exchange Rate Provider</span>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Base Platform Currency</label>
                <select
                  className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold"
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="SGD">SGD ($) - Singapore Dollar</option>
                </select>
              </div>

              <Input
                label="Exchange Rate Provider API"
                value={exchangeRateApiProvider}
                onChange={(e) => setExchangeRateApiProvider(e.target.value)}
              />
            </div>

            <TagInput
              label="Supported Settlement Currencies"
              tags={supportedCurrencies}
              onChange={setSupportedCurrencies}
              placeholder="Add currency code (e.g. CAD, JPY)..."
            />

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-850 rounded-xl border border-slate-200 dark:border-zinc-800">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">Automated Hourly Exchange Sync</span>
                <span className="text-[11px] text-slate-500">Fetches live spot exchange rates for checkout conversion</span>
              </div>
              <Switch checked={autoSyncExchangeRates} onChange={(e) => setAutoSyncExchangeRates(e.target.checked)} />
            </div>
          </div>
        </Card>

        {/* Date & Time Formatting */}
        <Card
          header={
            <div className="flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Date & Time Representation Formats</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Date Format Representation</label>
              <select
                className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
              >
                <option value="MMM dd, yyyy">MMM dd, yyyy (e.g. Jul 22, 2026)</option>
                <option value="yyyy-MM-dd">yyyy-MM-dd (ISO Standard: 2026-07-22)</option>
                <option value="dd/MM/yyyy">dd/MM/yyyy (EU: 22/07/2026)</option>
                <option value="MM/dd/yyyy">MM/dd/yyyy (US: 07/22/2026)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Time Format</label>
              <select
                className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold"
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
              >
                <option value="HH:mm:ss">24-Hour Clock (14:30:00)</option>
                <option value="hh:mm:ss a">12-Hour Clock (02:30:00 PM)</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" icon={Save} onClick={handleSave}>
            Save Localization Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
