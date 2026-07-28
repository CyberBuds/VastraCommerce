'use client';

import React, { useState } from 'react';
import { RefreshCw, Plus, CheckCircle, Clock } from 'lucide-react';
import { useCycleCountsList, useCreateCycleCountMutation, useWarehousesList } from '../hooks/useInventory';

export function CycleCountView() {
  const { data: counts, isLoading } = useCycleCountsList();
  const { data: warehouses } = useWarehousesList();
  const createMutation = useCreateCycleCountMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [warehouseId, setWarehouseId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const wh = warehouses?.find((w) => w.id === warehouseId);
    if (!wh) return;

    await createMutation.mutateAsync({
      warehouseId,
      warehouseName: wh.name,
      scheduledDate: scheduledDate || '2026-08-10',
      assignedEmployee: assignedEmployee || 'David Miller',
      status: 'scheduled',
      varianceItemsCount: 0,
      varianceValue: 0,
    });

    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cycle Counting & Stock Audits</h1>
          <p className="text-sm text-slate-500">Scheduled perpetual inventory auditing, aisle verification, and stock count reconciliation</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Schedule Cycle Count
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Schedule Physical Audit Count</h2>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Target Facility</label>
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
                <label className="block font-semibold text-slate-600 mb-1">Scheduled Date</label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Assigned Audit Supervisor</label>
                <input
                  type="text"
                  required
                  value={assignedEmployee}
                  onChange={(e) => setAssignedEmployee(e.target.value)}
                  placeholder="e.g. David Miller"
                  className="w-full rounded-lg border border-slate-200 p-2 text-sm text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Schedule Count
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Count Ref #</th>
                <th className="py-3 px-4 font-semibold">Warehouse Site</th>
                <th className="py-3 px-4 font-semibold">Scheduled Date</th>
                <th className="py-3 px-4 font-semibold">Assigned Auditor</th>
                <th className="py-3 px-4 font-semibold">Variances Discovered</th>
                <th className="py-3 px-4 font-semibold text-right">Variance Value</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading cycle count audit records...
                  </td>
                </tr>
              ) : (
                counts?.map((cc) => (
                  <tr key={cc.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{cc.countNumber}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{cc.warehouseName}</td>
                    <td className="py-3.5 px-4 text-slate-500">{cc.scheduledDate}</td>
                    <td className="py-3.5 px-4">{cc.assignedEmployee}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{cc.varianceItemsCount} SKUs</td>
                    <td className={`py-3.5 px-4 text-right font-mono font-bold ${cc.varianceValue < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                      ${cc.varianceValue.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          cc.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {cc.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
