'use client';

import React, { useState } from 'react';
import {
  Warehouse as WarehouseIcon,
  Plus,
  Search,
  Building,
  MapPin,
  User,
  Phone,
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useWarehousesList, useDeleteWarehouseMutation } from '../hooks/useInventory';
import Link from 'next/link';

export function WarehouseListView() {
  const { data: warehouses, isLoading } = useWarehousesList();
  const deleteMutation = useDeleteWarehouseMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = warehouses?.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove warehouse "${name}"?`)) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Warehouses & Storage Facilities</h1>
          <p className="text-sm text-slate-500">Configure fulfillment centers, capacity thresholds, and site managers</p>
        </div>
        <Link
          href="/dashboard/inventory/warehouses/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Add New Warehouse
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by facility name, code, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Warehouses Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading warehouses...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered?.map((wh) => (
            <div key={wh.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-lg">{wh.name}</h3>
                      {wh.isDefault && (
                        <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase">
                          Default Site
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-400">{wh.code}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/dashboard/inventory/warehouses/edit/${wh.id}`}
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(wh.id, wh.name)}
                    className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Facility Details */}
              <div className="mt-5 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {wh.address}, {wh.city}, {wh.state}, {wh.country}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    Facility Manager: <strong className="text-slate-800">{wh.manager}</strong> (Contact: {wh.contactPerson})
                  </span>
                </div>
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{wh.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{wh.phone}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Capacity */}
              <div className="mt-5 rounded-lg bg-slate-50 p-3">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Capacity Utilization</span>
                  <span className="font-bold">{wh.currentCapacityPercent}% ({wh.totalSKUs} SKUs stored)</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${
                      wh.currentCapacityPercent > 80 ? 'bg-rose-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${wh.currentCapacityPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
