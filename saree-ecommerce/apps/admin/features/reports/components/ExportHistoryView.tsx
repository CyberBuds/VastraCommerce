'use client';

import * as React from 'react';
import { useReportsStore } from '@/store/reportsStore';
import { ReportsHeader } from './ReportsHeader';
import { ReportExportModal } from './ReportExportModal';
import { ReportDataTable } from './ReportDataTable';
import { Button } from '@/components/enterprise/BaseInputs';
import { Download, Trash2, FileSpreadsheet, FileText, Code, Printer } from 'lucide-react';
import { toast } from 'sonner';

export function ExportHistoryView() {
  const { exportHistory, clearExportHistory } = useReportsStore();

  const handleDownloadFile = (fileName: string) => {
    toast.success(`Initiating download for cached archive "${fileName}".`);
  };

  return (
    <div className="space-y-6">
      <ReportsHeader
        title="Export File History & Archive Logs"
        description="Audit log of generated CSV, Excel, PDF, and JSON reporting exports available for instantaneous re-download."
        breadcrumbs={[{ label: 'Export History' }]}
        showFiltersToggle={false}
      />

      <div className="flex justify-between items-center">
        <p className="text-xs text-slate-500">
          Showing {exportHistory.length} generated report files stored in secure object archives.
        </p>
        {exportHistory.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearExportHistory} className="text-xs gap-1.5 text-rose-600 hover:text-rose-700">
            <Trash2 className="w-3.5 h-3.5" /> Clear Export History
          </Button>
        )}
      </div>

      <ReportDataTable
        title="Generated Export Archive Ledger"
        data={exportHistory}
        columns={[
          {
            header: 'File Name',
            accessorKey: (r) => (
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
                <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">{r.fileName}</span>
              </div>
            ),
          },
          { header: 'Report Module', accessorKey: 'reportType' },
          {
            header: 'Format',
            accessorKey: (r) => (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 uppercase">
                {r.format}
              </span>
            ),
          },
          { header: 'Row Count', accessorKey: (r) => `${r.rowCount.toLocaleString()} rows` },
          { header: 'Archive Size', accessorKey: (r) => `${(r.fileSizeBytes / 1024).toFixed(1)} KB` },
          { header: 'Exported By', accessorKey: 'exportedBy' },
          { header: 'Timestamp', accessorKey: (r) => new Date(r.exportedAt).toLocaleString() },
          {
            header: 'Action',
            accessorKey: (r) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadFile(r.fileName)}
                className="p-1.5 h-7 gap-1 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </Button>
            ),
          },
        ]}
      />

      <ReportExportModal />
    </div>
  );
}
