'use client';

import React, { useState } from 'react';
import { QrCode, Printer, Plus } from 'lucide-react';
import { useBarcodesList, useGenerateBarcodeMutation, useStockList } from '../hooks/useInventory';

export function BarcodesView() {
  const { data: barcodes, isLoading } = useBarcodesList();
  const { data: stockItems } = useStockList();
  const generateMutation = useGenerateBarcodeMutation();

  const [sku, setSku] = useState('');
  const [type, setType] = useState<'code128' | 'qr' | 'ean13'>('code128');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku) return;
    await generateMutation.mutateAsync({ sku, type });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Barcode & QR Label Generator</h1>
          <p className="text-sm text-slate-500">Generate Code 128, EAN-13, and QR code sticker labels for bin tagging and scan workflows</p>
        </div>
      </div>

      {/* Generator Tool Card */}
      <form onSubmit={handleGenerate} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Select SKU to Label</label>
          <select
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
          >
            <option value="">Select Item SKU...</option>
            {stockItems?.map((s) => (
              <option key={s.id} value={s.sku}>
                {s.productName} ({s.sku})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Barcode Standard</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
          >
            <option value="code128">Code 128 (Linear)</option>
            <option value="qr">QR Code (2D)</option>
            <option value="ean13">EAN-13 (Standard)</option>
          </select>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Generate Barcode Label
        </button>
      </form>

      {/* Label Print Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {barcodes?.map((bar) => (
          <div key={bar.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                <span className="font-mono font-bold">{bar.sku}</span>
                <span className="uppercase text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-600">{bar.barcodeType}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{bar.productName}</h4>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4 flex flex-col items-center justify-center">
              <QrCode className="h-16 w-16 text-slate-800" />
              <span className="mt-2 text-xs font-mono font-extrabold text-slate-800 tracking-wider">{bar.barcodeValue}</span>
            </div>

            <button
              onClick={() => alert(`Sending label for ${bar.sku} to Zebra Thermal Printer...`)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Printer className="h-3.5 w-3.5" /> Print Thermal Sticker
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
