'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useCreatePurchaseOrderMutation, useSuppliersList, useWarehousesList, useStockList } from '../hooks/useInventory';

export function PurchaseOrderFormView() {
  const router = useRouter();
  const createMutation = useCreatePurchaseOrderMutation();
  const { data: suppliers } = useSuppliersList();
  const { data: warehouses } = useWarehousesList();
  const { data: stockItems } = useStockList();

  const [supplierId, setSupplierId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [notes, setNotes] = useState('');

  const [orderItems, setOrderItems] = useState<
    { productId: string; productName: string; sku: string; orderedQty: number; unitPrice: number }[]
  >([
    {
      productId: '',
      productName: '',
      sku: '',
      orderedQty: 10,
      unitPrice: 100,
    },
  ]);

  const handleAddItem = () => {
    setOrderItems([
      ...orderItems,
      { productId: '', productName: '', sku: '', orderedQty: 10, unitPrice: 100 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleStockChange = (index: number, stockId: string) => {
    const item = stockItems?.find((s) => s.id === stockId);
    if (!item) return;

    const updated = [...orderItems];
    updated[index] = {
      ...updated[index],
      productId: item.id,
      productName: item.productName,
      sku: item.sku,
      unitPrice: item.unitCost,
    };
    setOrderItems(updated);
  };

  const totalAmount = orderItems.reduce((acc, curr) => acc + curr.orderedQty * curr.unitPrice, 0);
  const taxAmount = totalAmount * 0.18;
  const grandTotal = totalAmount + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers?.find((s) => s.id === supplierId);
    const wh = warehouses?.find((w) => w.id === warehouseId);

    if (!sup || !wh) return;

    await createMutation.mutateAsync({
      supplierId,
      supplierName: sup.companyName,
      warehouseId,
      warehouseName: wh.name,
      expectedDeliveryDate: expectedDate || '2026-08-15',
      status: 'pending_approval',
      items: orderItems.map((it, idx) => ({
        id: `poi-${idx}`,
        ...it,
        receivedQty: 0,
        totalPrice: it.orderedQty * it.unitPrice,
      })),
      totalAmount,
      taxAmount,
      grandTotal,
      approvalWorkflowStatus: 'pending',
      attachments: [],
      notes,
    });

    router.push('/dashboard/inventory/purchase-orders');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Purchase Order</h1>
          <p className="text-sm text-slate-500">Issue a new procurement order to supplier</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Supplier *</label>
            <select
              required
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
            >
              <option value="">Select Vendor...</option>
              {suppliers?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.companyName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Destination Warehouse *</label>
            <select
              required
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
            >
              <option value="">Select Warehouse...</option>
              {warehouses?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Expected Delivery Date *</label>
            <input
              type="date"
              required
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Ordered Items</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
            >
              <Plus className="h-4 w-4" /> Add Line Item
            </button>
          </div>

          {orderItems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-3 items-end rounded-lg bg-slate-50 p-3">
              <div className="col-span-5">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Item SKU</label>
                <select
                  required
                  value={item.productId}
                  onChange={(e) => handleStockChange(idx, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900"
                >
                  <option value="">Select SKU...</option>
                  {stockItems?.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.productName} ({st.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={item.orderedQty}
                  onChange={(e) => {
                    const updated = [...orderItems];
                    updated[idx].orderedQty = Number(e.target.value);
                    setOrderItems(updated);
                  }}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Unit Price ($)</label>
                <input
                  type="number"
                  required
                  value={item.unitPrice}
                  onChange={(e) => {
                    const updated = [...orderItems];
                    updated[idx].unitPrice = Number(e.target.value);
                    setOrderItems(updated);
                  }}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div className="col-span-2 font-mono font-bold text-xs text-slate-900 self-center">
                Subtotal: ${(item.orderedQty * item.unitPrice).toFixed(2)}
              </div>

              <div className="col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals Summary */}
        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <div className="w-64 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono font-bold">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Est Tax (18% GST):</span>
              <span className="font-mono font-bold">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-sm text-slate-900 font-extrabold">
              <span>Grand Total:</span>
              <span className="font-mono text-indigo-900">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Save className="h-4 w-4" /> Save & Send Purchase Order
          </button>
        </div>
      </form>
    </div>
  );
}
