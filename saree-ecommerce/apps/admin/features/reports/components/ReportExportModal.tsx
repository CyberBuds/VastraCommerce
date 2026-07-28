'use client';

import * as React from 'react';
import { useReportsStore } from '@/store/reportsStore';
import { Button, Select, Label, Input } from '@/components/enterprise/BaseInputs';
import { Download, FileText, Table, Code, Printer, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export function ReportExportModal() {
  const { isExportModalOpen, exportModalReportTitle, closeExportModal, addExportRecord } = useReportsStore();

  const [format, setFormat] = React.useState<'EXCEL' | 'CSV' | 'PDF' | 'JSON'>('EXCEL');
  const [includeMetadata, setIncludeMetadata] = React.useState(true);
  const [includeCharts, setIncludeCharts] = React.useState(true);
  const [recipientEmail, setRecipientEmail] = React.useState('');
  const [isExporting, setIsExporting] = React.useState(false);

  if (!isExportModalOpen) return null;

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);

    setTimeout(() => {
      setIsExporting(false);
      const ext = format.toLowerCase();
      const fileName = `${exportModalReportTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.${ext === 'excel' ? 'xlsx' : ext}`;

      addExportRecord({
        fileName,
        reportType: exportModalReportTitle,
        format,
        rowCount: 1250,
        fileSizeBytes: format === 'PDF' ? 1450000 : 220000,
        exportedBy: 'Current User',
        downloadUrl: '#',
      });

      toast.success(`Export file "${fileName}" generated and downloaded successfully!`);
      closeExportModal();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 space-y-5 relative">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
              Export {exportModalReportTitle}
            </h3>
          </div>
          <button
            onClick={closeExportModal}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleExport} className="space-y-4">
          {/* Format Selection Grid */}
          <div>
            <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Select Export Format</Label>
            <div className="grid grid-cols-4 gap-2.5 mt-2">
              {[
                { id: 'EXCEL', label: 'Excel (.xlsx)', icon: Table },
                { id: 'CSV', label: 'CSV (.csv)', icon: FileText },
                { id: 'PDF', label: 'PDF Document', icon: Printer },
                { id: 'JSON', label: 'Raw JSON', icon: Code },
              ].map((item) => {
                const Icon = item.icon;
                const active = format === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormat(item.id as any)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                      active
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                        : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Configuration Checkboxes */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 dark:text-zinc-200">
              <input
                type="checkbox"
                checked={includeMetadata}
                onChange={(e) => setIncludeMetadata(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Include Executive Filter Metadata & Header Stamps</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 dark:text-zinc-200">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Include Embedded Chart Visualizations (PDF/Excel)</span>
            </label>
          </div>

          {/* Email Copy option */}
          <div>
            <Label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Direct Email Dispatch (Optional)
            </Label>
            <Input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="e.g. executive@enterprise-aero.com"
              className="mt-1 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <Button type="button" variant="outline" size="sm" onClick={closeExportModal}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isExporting} className="font-bold gap-1.5">
              {isExporting ? (
                <>Generating Dataset...</>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download {format}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
