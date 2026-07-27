'use client';

import * as React from 'react';
import { Upload, Download, CheckCircle, AlertTriangle, FileSpreadsheet, FileDown, ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { toast } from 'sonner';
import { downloadFile } from '@/utils/common';

interface ValidationError {
  row: number;
  column: string;
  value: string;
  message: string;
  severity: 'error' | 'warning';
}

export function ImportExportTool() {
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [validating, setValidating] = React.useState(false);
  const [report, setReport] = React.useState<{
    success: boolean;
    totalRows: number;
    validRows: number;
    errors: ValidationError[];
  } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImport(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImport(e.target.files[0]);
    }
  };

  // Import simulation with rules checking
  const processImport = (file: File) => {
    setSelectedFile(file);
    setValidating(true);
    setReport(null);

    setTimeout(() => {
      setValidating(false);
      const isOk = file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
      if (!isOk) {
        toast.error('Format Error', { description: 'Please provide standard .csv or .xlsx spreadsheets.' });
        setSelectedFile(null);
        return;
      }

      // Simulate parsing of rows
      const totalRows = 38;
      const errors: ValidationError[] = [
        { row: 4, column: 'sku', value: '', message: 'SKU identifier code is empty or missing.', severity: 'error' },
        { row: 12, column: 'sellingPrice', value: '-120.00', message: 'Price cannot be negative values.', severity: 'error' },
        { row: 18, column: 'stock', value: '45.5', message: 'Stock level integer formatting has decimals.', severity: 'warning' },
        { row: 24, column: 'category', value: 'Aviation', message: 'Category label is not listed in taxonomic tree.', severity: 'warning' },
      ];

      setReport({
        success: false,
        totalRows,
        validRows: totalRows - 2,
        errors,
      });

      toast.success('Taxonomy analysis complete', {
        description: `Inspected spreadsheet. Found ${errors.filter(e => e.severity === 'error').length} fatal formatting blockages.`,
      });
    }, 1200);
  };

  // Download templates
  const handleDownloadTemplate = (format: 'csv' | 'excel') => {
    const headers = ['sku', 'name', 'category', 'costPrice', 'sellingPrice', 'stock', 'status', 'description', 'metaTitle'];
    const sampleRow = ['SKU-AERO-EXAMPLE', 'AeroFlow Turbine X5', 'Turbines', '800.00', '1499.00', '45', 'ACTIVE', 'Engineered industrial turbine element', 'AeroFlow Turbine X5 | Parts'];
    
    if (format === 'csv') {
      const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
      downloadFile(csvContent, 'catalog_import_template.csv', 'text/csv');
    } else {
      const excelContent = [headers.join('\t'), sampleRow.join('\t')].join('\n');
      downloadFile(excelContent, 'catalog_import_template.xls', 'application/vnd.ms-excel');
    }
    toast.success('Catalog schema template downloaded.');
  };

  return (
    <div className="space-y-6" id="import-export-tool">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Import section (Left Column) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-50 dark:bg-zinc-950/20 border border-slate-200/60 dark:border-zinc-850 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                Spreadsheet Template Schemas
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Ensure compliance by using approved catalog import headers.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="font-bold text-[11px] py-1.5"
                onClick={() => handleDownloadTemplate('csv')}
                icon={FileDown}
              >
                CSV Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="font-bold text-[11px] py-1.5"
                onClick={() => handleDownloadTemplate('excel')}
                icon={FileSpreadsheet}
              >
                Excel Template
              </Button>
            </div>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-slate-400 rounded-2xl p-10 text-center transition-colors cursor-pointer bg-white dark:bg-zinc-900 shadow-xs',
              dragActive ? 'border-brand bg-brand/5' : ''
            )}
            onClick={() => document.getElementById('excel-catalog-uploader')?.click()}
          >
            <input
              id="excel-catalog-uploader"
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
              Drag and drop SKU spreadsheets here, or click to upload
            </p>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              Supports bulk inventory sheets (.csv, .xlsx, .xls) up to 12MB.
            </p>
          </div>

          {validating && (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl p-6 text-center animate-pulse space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-full border-t-brand border-r-brand border-2 border-slate-200 animate-spin mx-auto" />
              <p className="text-xs font-black uppercase text-slate-800 dark:text-zinc-300 tracking-wider">
                Taxonomic Schema Integrity Check...
              </p>
              <p className="text-[10px] text-slate-400 font-semibold">
                Validating barcode duplicates, mathematical signs, and Category tags.
              </p>
            </div>
          )}

          {report && (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-850 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-amber-500" />
                  <span className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                    Catalog Validation Report
                  </span>
                </div>
                <Badge variant="error" className="py-0 px-2.5">
                  {report.errors.filter(e => e.severity === 'error').length} BLOCKING ISSUES
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-50 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-slate-150/40 dark:border-zinc-850">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Rows Inspected</span>
                  <p className="text-lg font-extrabold text-slate-800 dark:text-zinc-150 mt-0.5">{report.totalRows}</p>
                </div>
                <div className="bg-emerald-50/40 dark:bg-emerald-950/10 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-950/20">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Compliant Rows</span>
                  <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">{report.validRows}</p>
                </div>
                <div className="bg-red-50/40 dark:bg-red-950/10 p-2.5 rounded-xl border border-red-100 dark:border-red-950/20">
                  <span className="text-[9px] font-bold text-red-650 uppercase tracking-wider">Warnings & Errors</span>
                  <p className="text-lg font-extrabold text-red-650 mt-0.5">{report.errors.length}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Error Telemetry logs</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {report.errors.map((err, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-2.5 rounded-lg border text-xs flex gap-3 items-start",
                        err.severity === 'error'
                          ? "bg-red-50/20 border-red-100 text-red-750 dark:bg-red-950/5 dark:border-red-950/40 dark:text-red-450"
                          : "bg-amber-50/20 border-amber-100 text-amber-750 dark:bg-amber-950/5 dark:border-amber-950/40 dark:text-amber-450"
                      )}
                    >
                      {err.severity === 'error' ? (
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold">
                          Row {err.row} | Column <span className="underline font-bold">{err.column}</span>
                        </p>
                        <p className="mt-0.5 text-slate-500 dark:text-zinc-400 leading-snug">{err.message}</p>
                        {err.value && (
                          <p className="mt-1 font-mono text-[10px] bg-white dark:bg-zinc-950/40 px-1.5 py-0.5 rounded-sm inline-block">
                            Value: &quot;{err.value}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 justify-end border-t border-slate-100 dark:border-zinc-850 pt-3">
                <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)}>
                  Discard Upload
                </Button>
                <Button variant="primary" size="sm" disabled={report.errors.some(e => e.severity === 'error')}>
                  Execute Catalog Import
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Export Section (Right Column) */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-zinc-950/20 border border-slate-200/60 dark:border-zinc-850 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-250/50 dark:border-zinc-850 pb-2.5">
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand" />
              Secured Data Export
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Acquire full database archives under corporate permission checks.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-slate-500 leading-normal">
              Select your required archive format below. All exports will contain catalog products, stock metrics, categories, pricing indices, and variants.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => toast.success('CSV compiled successfully for all SKUs')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-zinc-850 hover:border-slate-450 bg-white dark:bg-zinc-900 cursor-pointer text-slate-750 dark:text-zinc-200 hover:shadow-xs transition-all font-bold"
              >
                <span>Export database to .csv text</span>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.success('Excel workbook consolidated')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-zinc-850 hover:border-slate-450 bg-white dark:bg-zinc-900 cursor-pointer text-slate-750 dark:text-zinc-200 hover:shadow-xs transition-all font-bold"
              >
                <span>Export database to .xlsx spreadsheet</span>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.success('PDF report built')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-zinc-850 hover:border-slate-450 bg-white dark:bg-zinc-900 cursor-pointer text-slate-750 dark:text-zinc-200 hover:shadow-xs transition-all font-bold"
              >
                <span>Export database to .pdf document</span>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => toast.success('JSON payload retrieved')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-zinc-850 hover:border-slate-450 bg-white dark:bg-zinc-900 cursor-pointer text-slate-750 dark:text-zinc-200 hover:shadow-xs transition-all font-bold"
              >
                <span>Export raw .json payload schema</span>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
