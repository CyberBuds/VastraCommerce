'use client';

import * as React from 'react';
import { useReportsStore } from '@/store/reportsStore';
import { ReportsHeader } from './ReportsHeader';
import { ReportExportModal } from './ReportExportModal';
import { Button, Input, Select, Label } from '@/components/enterprise/BaseInputs';
import { CalendarClock, Mail, Play, Pause, Trash2, Plus, Check, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function ScheduledReportsView() {
  const { scheduledReports, addScheduledReport, toggleScheduledReportStatus, deleteScheduledReport } = useReportsStore();

  const [name, setName] = React.useState('');
  const [templateName, setTemplateName] = React.useState('Executive Daily Sales Briefing');
  const [frequency, setFrequency] = React.useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('DAILY');
  const [format, setFormat] = React.useState<'CSV' | 'EXCEL' | 'PDF' | 'JSON'>('EXCEL');
  const [recipients, setRecipients] = React.useState('cfo@enterprise-aero.com');
  const [isAdding, setIsAdding] = React.useState(false);

  const handleRunNow = (schedName: string) => {
    toast.success(`Triggered execution for scheduled job "${schedName}". Email dispatched!`);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a schedule name.');
      return;
    }

    addScheduledReport({
      name,
      templateName,
      frequency,
      format,
      recipients: recipients.split(',').map((r) => r.trim()),
      nextRunAt: new Date(Date.now() + 86400000).toISOString(),
      status: 'ACTIVE',
    });

    toast.success(`Scheduled report rule "${name}" created.`);
    setName('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Scheduled Automated Report Subscriptions"
        description="Configure cron-like automated email delivery schedules for recurring executive briefings and warehouse digests."
        breadcrumbs={[{ label: 'Scheduled Reports' }]}
        showFiltersToggle={false}
      />

      <div className="flex justify-between items-center pb-2">
        <p className="text-xs text-slate-500">
          Managing {scheduledReports.length} automated recurring report delivery triggers.
        </p>
        <Button size="sm" onClick={() => setIsAdding(!isAdding)} className="font-bold gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Schedule New Report
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-3 flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-indigo-500" />
            New Recurring Delivery Rule
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-bold">Schedule Rule Name</Label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Weekly CFO P&L Briefing" className="mt-1 text-xs" />
            </div>

            <div>
              <Label className="text-xs font-bold">Source Report / Template</Label>
              <Select value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="mt-1 text-xs">
                <option value="Executive Daily Sales Briefing">Executive Daily Sales Briefing</option>
                <option value="Inventory Valuation & Low Stock">Inventory Valuation & Low Stock</option>
                <option value="GST Tax Compliance Audit">GST Tax Compliance Audit</option>
                <option value="P&L Income Statement">P&L Income Statement</option>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-bold">Frequency Schedule</Label>
              <Select value={frequency} onChange={(e) => setFrequency(e.target.value as any)} className="mt-1 text-xs">
                <option value="DAILY">Daily (06:00 AM UTC)</option>
                <option value="WEEKLY">Weekly (Monday 08:00 AM)</option>
                <option value="MONTHLY">Monthly (1st of Month)</option>
                <option value="QUARTERLY">Quarterly (1st of Quarter)</option>
                <option value="YEARLY">Yearly (Jan 1st)</option>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-bold">Export Format</Label>
              <Select value={format} onChange={(e) => setFormat(e.target.value as any)} className="mt-1 text-xs">
                <option value="EXCEL">Excel (.xlsx)</option>
                <option value="CSV">CSV (.csv)</option>
                <option value="PDF">PDF Document</option>
                <option value="JSON">Raw JSON</option>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label className="text-xs font-bold">Recipient Emails (Comma separated)</Label>
              <Input type="text" value={recipients} onChange={(e) => setRecipients(e.target.value)} placeholder="cfo@enterprise-aero.com, audit@enterprise-aero.com" className="mt-1 text-xs" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button type="submit" size="sm" className="font-bold gap-1">Create Schedule Rule</Button>
          </div>
        </form>
      )}

      {/* Scheduled List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scheduledReports.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4 relative"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                  {item.frequency} • {item.format}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-2">{item.name}</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Template: {item.templateName}</p>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  item.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{item.recipients.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Last Run: {item.lastRunAt === 'Never' ? 'Never' : new Date(item.lastRunAt).toLocaleDateString()}</span>
                <span>Next: {new Date(item.nextRunAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-zinc-800 text-xs">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRunNow(item.name)}
                className="gap-1 text-xs font-bold"
              >
                <Play className="w-3 h-3 text-emerald-500 fill-emerald-500" /> Trigger Now
              </Button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleScheduledReportStatus(item.id)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded-lg"
                  title={item.status === 'ACTIVE' ? 'Pause Rule' : 'Activate Rule'}
                >
                  <Pause className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteScheduledReport(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Delete Schedule Rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ReportExportModal />
    </div>
  );
}
