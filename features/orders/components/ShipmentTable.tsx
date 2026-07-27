'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Shipment, ShipmentStatus } from '@/types/order';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Badge, Button, Input } from '@/components/enterprise/BaseInputs';
import { 
  useShipments, 
  useUpdateShipmentStatus, 
  useAllTracking 
} from '@/hooks/useOrders';
import { 
  Truck, 
  Eye, 
  Clock, 
  CheckCircle, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle,
  History,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function ShipmentTable() {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const { data: shipments = [], isLoading } = useShipments();
  const { data: trackingDetails = [] } = useAllTracking();
  const updateShipmentMutation = useUpdateShipmentStatus();

  // Active view tracking modal states
  const [selectedShipment, setSelectedShipment] = React.useState<Shipment | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = React.useState(false);
  const [statusForm, setStatusForm] = React.useState({
    status: 'IN_TRANSIT' as ShipmentStatus,
    details: ''
  });

  const matchedTracking = React.useMemo(() => {
    if (!selectedShipment) return null;
    return trackingDetails.find(t => t.trackingNumber === selectedShipment.trackingNumber) || null;
  }, [selectedShipment, trackingDetails]);

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    updateShipmentMutation.mutate({
      id: selectedShipment.id,
      status: statusForm.status,
      details: statusForm.details || `Consignment state altered to ${statusForm.status}.`
    }, {
      onSuccess: () => {
        setIsUpdateOpen(false);
        setSelectedShipment(null);
        setStatusForm({ status: 'IN_TRANSIT', details: '' });
      }
    });
  };

  const columns = React.useMemo<ColumnDef<Shipment, any>[]>(() => [
    {
      id: 'ShipmentNumber',
      accessorKey: 'shipmentNumber',
      header: 'Waybill Reference',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-slate-900 dark:text-zinc-100">
          {row.getValue('ShipmentNumber')}
        </span>
      ),
    },
    {
      id: 'OrderNumber',
      accessorKey: 'orderNumber',
      header: 'Linked Order',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-indigo-600">
          {row.getValue('OrderNumber')}
        </span>
      ),
    },
    {
      id: 'Customer',
      accessorKey: 'customerName',
      header: 'Recipient Consignee',
      cell: ({ row }) => (
        <span className="font-bold text-slate-800 dark:text-zinc-200 text-xs">
          {row.getValue('Customer')}
        </span>
      ),
    },
    {
      id: 'Carrier',
      accessorKey: 'carrier',
      header: 'Courier Partner',
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex flex-col text-[11px]">
            <span className="font-extrabold text-slate-700 dark:text-zinc-200">{s.carrier}</span>
            <span className="text-slate-400 font-mono tracking-wider">{s.trackingNumber}</span>
          </div>
        );
      },
    },
    {
      id: 'ShippedAt',
      accessorKey: 'shippedAt',
      header: 'Date Dispatched',
      cell: ({ row }) => (
        <span className="text-slate-400 font-mono text-[10px]">
          {new Date(row.getValue('ShippedAt')).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      ),
    },
    {
      id: 'EstimatedDelivery',
      accessorKey: 'estimatedDelivery',
      header: 'Target Arrival',
      cell: ({ row }) => (
        <span className="font-mono text-[10px] text-slate-600 dark:text-zinc-300">
          {row.getValue('EstimatedDelivery')}
        </span>
      ),
    },
    {
      id: 'Status',
      accessorKey: 'status',
      header: 'Dispatch State',
      cell: ({ row }) => {
        const val = row.getValue('Status') as ShipmentStatus;
        let bVariant: 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'neutral';
        if (val === 'DELIVERED') bVariant = 'success';
        if (['IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(val)) bVariant = 'info';
        if (val === 'PREPARING') bVariant = 'warning';
        if (val === 'FAILED_ATTEMPT') bVariant = 'error';

        return <Badge variant={bVariant}>{val.replace(/_/g, ' ')}</Badge>;
      },
    },
    {
      id: 'Actions',
      header: () => <div className="text-right">Controls</div>,
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setSelectedShipment(s)}
              title="View Real-Time Tracking"
            >
              <Eye className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
            </Button>
            {s.status !== 'DELIVERED' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setSelectedShipment(s);
                  setIsUpdateOpen(true);
                  setStatusForm({ status: s.status, details: '' });
                }}
                title="Alter Route State"
              >
                <Truck className="w-4 h-4 text-emerald-600" />
              </Button>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
  ], [shipments, trackingDetails]);

  return (
    <div className="w-full relative" id="shipments-table-root">
      <EnterpriseTable
        data={shipments}
        columns={columns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isLoading={isLoading}
      />

      {/* ==========================================
          TRACKING WAYBILL VIEW DIALOG (MODAL)
          ========================================== */}
      {selectedShipment && !isUpdateOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-850 pb-2">
              <h4 className="text-sm font-extrabold uppercase tracking-wider font-mono text-slate-850 dark:text-zinc-50 flex items-center gap-2">
                <Truck className="w-4.5 h-4.5 text-indigo-500" />
                WAYBILL ROUTING TRACKING ({selectedShipment.shipmentNumber})
              </h4>
              <button type="button" onClick={() => setSelectedShipment(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {/* Courier general info card */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-zinc-950/40 p-4 border border-slate-200/50 dark:border-zinc-800 rounded-xl font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Carrier Partner</span>
                <span className="font-bold text-slate-850 dark:text-zinc-200 text-xs">{selectedShipment.carrier}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Airway Tracking Bill</span>
                <span className="font-bold text-slate-850 dark:text-zinc-200 text-xs">{selectedShipment.trackingNumber}</span>
              </div>
            </div>

            {/* Simulated Live route tracking timeline steps */}
            <div className="space-y-4">
              <h5 className="font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider font-mono text-[10px] flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-500" />
                Transit Checkpoint History
              </h5>

              {matchedTracking && matchedTracking.steps.length > 0 ? (
                <div className="relative border-l border-slate-200 dark:border-zinc-800 pl-4 ml-2 space-y-4 font-mono text-[11px]">
                  {matchedTracking.steps.map((st) => (
                    <div key={st.id} className="relative">
                      <span className="absolute -left-[20px] top-1 h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-zinc-900" />
                      <div>
                        <div className="flex justify-between gap-4">
                          <span className="font-bold text-slate-800 dark:text-zinc-100">{st.title}</span>
                          <span className="text-[10px] text-slate-400">{new Date(st.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-500 leading-normal mt-0.5">{st.description}</p>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-emerald-500" /> {st.location}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400 flex flex-col items-center justify-center gap-1">
                  <Clock className="w-6 h-6 text-slate-300" />
                  <p className="font-medium">Waiting for carrier integration scan data...</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-850">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedShipment(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          ALTER ROUTE STATUS STATE DIALOG (MODAL)
          ========================================== */}
      {isUpdateOpen && selectedShipment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleStatusSubmit}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-850 pb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider font-mono text-emerald-600 flex items-center">
                <Truck className="w-4 h-4 mr-2" /> Alter Logistics Route State
              </h4>
              <button type="button" onClick={() => setIsUpdateOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-500">
                Correcting transit location status for waybill <b>{selectedShipment.shipmentNumber}</b>.
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">New Transit Code Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e: any) => setStatusForm(p => ({ ...p, status: e.target.value }))}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-sm"
                >
                  <option value="PREPARING">PREPARING (DEPO HUB)</option>
                  <option value="IN_TRANSIT">IN TRANSIT (COURIER CARRIER)</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY (LOCAL COURIER)</option>
                  <option value="DELIVERED">DELIVERED (SIGNED CONFIRMATION)</option>
                  <option value="FAILED_ATTEMPT">FAILED DELIVERY ATTEMPT</option>
                </select>
              </div>

              <Input
                label="Transit Location / Detailed remarks *"
                placeholder="e.g. Scanned through Bangalore main sorting facility"
                required
                value={statusForm.details}
                onChange={(e) => setStatusForm(p => ({ ...p, details: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-850">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsUpdateOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm" isLoading={updateShipmentMutation.isPending}>
                Commit Status Scan
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
