'use client';

import * as React from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Card, Alert } from '@/components/enterprise/FeedbackComponents';
import { Button, Input, Switch } from '@/components/enterprise/BaseInputs';
import { Palette, Sun, Moon, Monitor, Code, Sparkles, Check, Save } from 'lucide-react';
import { toast } from 'sonner';

export function ThemeSettingsView() {
  const { themeConfig, updateThemeConfig } = useSystemStore();

  const [mode, setMode] = React.useState(themeConfig.mode);
  const [primaryColor, setPrimaryColor] = React.useState(themeConfig.primaryColor);
  const [accentColor, setAccentColor] = React.useState(themeConfig.accentColor);
  const [fontFamily, setFontFamily] = React.useState(themeConfig.fontFamily);
  const [borderRadius, setBorderRadius] = React.useState(themeConfig.borderRadius);
  const [enableCustomCss, setEnableCustomCss] = React.useState(themeConfig.enableCustomCss);
  const [customCss, setCustomCss] = React.useState(themeConfig.customCss);

  const handleSave = () => {
    updateThemeConfig({
      mode,
      primaryColor,
      accentColor,
      fontFamily,
      borderRadius,
      enableCustomCss,
      customCss,
    });
    toast.success('Theme & Branding Styles Updated', {
      description: 'Global stylesheet variables re-compiled across the applet.',
    });
  };

  const presetColors = [
    { name: 'Slate Blue (Default)', primary: '#0f172a', accent: '#2563eb' },
    { name: 'Emerald Enterprise', primary: '#064e3b', accent: '#10b981' },
    { name: 'Corporate Indigo', primary: '#1e1b4b', accent: '#6366f1' },
    { name: 'Aero Midnight Red', primary: '#450a0a', accent: '#ef4444' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
          Theme & UI Customization
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-semibold">
          Tailor enterprise theme palettes, color accents, typography scales, and custom CSS stylesheet overrides
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Settings Form */}
        <div className="md:col-span-8 space-y-6">
          {/* Appearance Mode */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <Palette className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
                <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Default Interface Theme Mode</span>
              </div>
            }
          >
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className={`p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                  mode === 'light'
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-850'
                }`}
                onClick={() => setMode('light')}
              >
                <Sun className="w-5 h-5" />
                <span className="text-xs font-bold">Light Mode</span>
              </button>

              <button
                type="button"
                className={`p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                  mode === 'dark'
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-850'
                }`}
                onClick={() => setMode('dark')}
              >
                <Moon className="w-5 h-5" />
                <span className="text-xs font-bold">Dark Mode</span>
              </button>

              <button
                type="button"
                className={`p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                  mode === 'system'
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-850'
                }`}
                onClick={() => setMode('system')}
              >
                <Monitor className="w-5 h-5" />
                <span className="text-xs font-bold">System Sync</span>
              </button>
            </div>
          </Card>

          {/* Color Palettes & Presets */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
                <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Brand Color Palettes</span>
              </div>
            }
          >
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">Preset Palettes</label>
              <div className="grid grid-cols-2 gap-2">
                {presetColors.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    className="p-3 border border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-850 text-left"
                    onClick={() => {
                      setPrimaryColor(preset.primary);
                      setAccentColor(preset.accent);
                    }}
                  >
                    <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{preset.name}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.accent }} />
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer"
                    />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono text-xs" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Accent Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer"
                    />
                    <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="font-mono text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Typography & Radii */}
          <Card
            header={
              <div className="flex items-center gap-2">
                <Code className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
                <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Typography & Component Geometry</span>
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Font Family</label>
                <select
                  className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Default)</option>
                  <option value="Inter">Inter UI</option>
                  <option value="Roboto">Roboto Enterprise</option>
                  <option value="System">System UI Stack</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-1">Border Radius Scale</label>
                <select
                  className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-semibold"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value)}
                >
                  <option value="0rem">Sharp (0px)</option>
                  <option value="0.375rem">Compact (6px)</option>
                  <option value="0.5rem">Standard (8px)</option>
                  <option value="0.75rem">Rounded (12px)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Custom CSS */}
          <Card
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
                  <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Custom CSS Overrides</span>
                </div>
                <Switch checked={enableCustomCss} onChange={(e) => setEnableCustomCss(e.target.checked)} />
              </div>
            }
          >
            {enableCustomCss ? (
              <div className="space-y-2">
                <textarea
                  className="w-full font-mono text-xs bg-slate-900 text-slate-100 p-3 rounded-lg min-h-[120px] focus:outline-none"
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  placeholder="/* Enter custom enterprise CSS overrides */"
                />
                <p className="text-[10px] text-slate-400">Custom CSS is injected into the head element securely.</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Toggle switch above to enable custom CSS injection.</p>
            )}
          </Card>
        </div>

        {/* Live Component Preview Sandbox */}
        <div className="md:col-span-4 space-y-6">
          <Card
            header={
              <span className="font-bold text-xs uppercase text-slate-400 tracking-wider block">
                Live Theme Preview
              </span>
            }
          >
            <div className="space-y-4">
              <div
                className="p-4 rounded-xl text-white shadow-md transition-all"
                style={{ backgroundColor: primaryColor, borderRadius }}
              >
                <p className="text-xs font-bold uppercase opacity-80">Primary Header Card</p>
                <p className="text-lg font-black mt-1">VastraCommerce UI</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-zinc-850 rounded-xl space-y-2">
                <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Button Variant Preview</p>
                <button
                  className="w-full py-2 px-3 text-xs font-bold text-white rounded-lg transition-all"
                  style={{ backgroundColor: accentColor, borderRadius }}
                >
                  Accent Action Button
                </button>
              </div>
            </div>
          </Card>

          <Button variant="primary" icon={Save} className="w-full font-bold" onClick={handleSave}>
            Apply Theme Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
