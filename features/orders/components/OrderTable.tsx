'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { 
  Order, 
  OrderItem, 
  OrderStatus, 
  PaymentStatus, 
  PaymentMethod, 
  ShippingMethod, 
  OrderTimelineEvent 
} from '@/types/order';
import { Customer } from '@/types/customer';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Badge, Button, Input, Textarea } from '@/components/enterprise/BaseInputs';
import { 
  useOrders, 
  useCreateOrder, 
  useUpdateOrder, 
  useHoldOrder, 
  useReleaseOrder, 
  useCancelOrder, 
  useCreateShipment, 
  usePayInvoice 
} from '@/hooks/useOrders';
import { useCustomers } from '@/hooks/useCustomers';
import { 
  Eye, 
  Plus, 
  Wallet, 
  Coins, 
  ShieldAlert, 
  Calendar, 
  User, 
  MapPin, 
  FileText, 
  Clock, 
  Truck, 
  Check, 
  Trash2, 
  AlertCircle,
  XCircle,
  TrendingUp,
  Boxes,
  HelpCircle
} from 'lucide-react';

// Selectable catalog products
const CATALOG_PRODUCTS = [
  { id: 'prod-1', name: 'AeroFlow Turbine X1 (Batch #1000)', sku: 'SKU-AERO-10000', price: 1499.99 },
  { id: 'prod-2', name: 'Quantum Spark Plug (Batch #1001)', sku: 'SKU-AERO-10001', price: 199.98 },
  { id: 'prod-3', name: 'Industrial Hydraulic Fluid (Batch #1002)', sku: 'SKU-AERO-10002', price: 249.99 },
  { id: 'prod-4', name: 'Carbon Fiber Strut (Batch #1003)', sku: 'SKU-AERO-10003', price: 299.99 },
  { id: 'prod-5', name: 'GigaCharge battery pack (Batch #1004)', sku: 'SKU-AERO-10004', price: 1199.99 }
];

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
}

export function OrderTable({ orders, isLoading }: OrderTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<string>('ALL');

  // React Query Mutations
  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder();
  const holdOrderMutation = useHoldOrder();
  const releaseOrderMutation = useReleaseOrder();
  const cancelOrderMutation = useCancelOrder();
  const createShipmentMutation = useCreateShipment();
  const payInvoiceMutation = usePayInvoice();
  
  const { data: customers = [] } = useCustomers();

  // Active view states
  const [viewedOrderId, setViewedOrderId] = React.useState<string | null>(null);
  const viewedOrder = React.useMemo(() => {
    return viewedOrderId ? orders.find(o => o.id === viewedOrderId) || null : null;
  }, [viewedOrderId, orders]);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isHoldOpen, setIsHoldOpen] = React.useState(false);
  const [holdReason, setHoldReason] = React.useState('');
  const [isCancelOpen, setIsCancelOpen] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState('');
  const [isShipOpen, setIsShipOpen] = React.useState(false);

  // Carrier manifest dispatch state
  const [shipForm, setShipForm] = React.useState({
    carrier: 'Blue Dart',
    trackingNumber: '',
    shippingMethod: 'EXPRESS' as ShippingMethod
  });

  // Timeline insertion state
  const [newTimeline, setNewTimeline] = React.useState({
    title: '',
    description: '',
    status: 'PROCESSING' as any
  });

  // Create Order Wizard form state
  const [newOrderForm, setNewOrderForm] = React.useState({
    customerId: '',
    shippingMethod: 'STANDARD' as ShippingMethod,
    paymentMethod: 'WALLET' as PaymentMethod,
    notes: '',
    items: [] as { productId: string; quantity: number }[]
  });

  // Filtered orders by tab
  const filteredOrders = React.useMemo(() => {
    if (activeTab === 'ALL') return orders;
    return orders.filter(o => o.status === activeTab);
  }, [orders, activeTab]);

  // Helper calculation for custom order builder
  const calculatedTotals = React.useMemo(() => {
    let subtotal = 0;
    newOrderForm.items.forEach(it => {
      const prod = CATALOG_PRODUCTS.find(p => p.id === it.productId);
      if (prod) subtotal += prod.price * it.quantity;
    });

    const selectedCust = customers.find(c => c.id === newOrderForm.customerId);
    let discount = 0;
    // Apply discount based on VIP group status if any
    if (selectedCust?.groupName?.includes('VIP')) {
      discount = subtotal * 0.10; // 10% VIP Discount
    } else if (selectedCust?.groupName?.includes('Premium')) {
      discount = subtotal * 0.05; // 5% Premium Discount
    } else if (selectedCust?.groupName?.includes('Wholesale')) {
      discount = subtotal * 0.12; // 12% Wholesale Discount
    }

    const tax = (subtotal - discount) * 0.18; // 18% GST standard
    const shippingCost = newOrderForm.shippingMethod === 'EXPRESS' ? 250 : 
                          newOrderForm.shippingMethod === 'FREIGHT' ? 1200 : 
                          newOrderForm.shippingMethod === 'SAME_DAY' ? 500 : 100;

    const totalAmount = subtotal - discount + tax + shippingCost;

    return { subtotal, discount, tax, shippingCost, totalAmount };
  }, [newOrderForm.items, newOrderForm.customerId, newOrderForm.shippingMethod, customers]);

  // Handle Order Registration
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.customerId || newOrderForm.items.length === 0) return;

    const selectedCust = customers.find(c => c.id === newOrderForm.customerId);
    if (!selectedCust) return;

    const orderItems: OrderItem[] = newOrderForm.items.map((it, idx) => {
      const p = CATALOG_PRODUCTS.find(prod => prod.id === it.productId)!;
      return {
        id: `item-${Date.now()}-${idx}`,
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        price: p.price,
        quantity: it.quantity,
        total: p.price * it.quantity,
        pickingStatus: 'PENDING',
        packingStatus: 'PENDING'
      };
    });

    createOrderMutation.mutate({
      customerId: selectedCust.id,
      customerName: `${selectedCust.firstName} ${selectedCust.lastName}`,
      customerEmail: selectedCust.email,
      customerPhone: selectedCust.phone || '+91 99999 99999',
      items: orderItems,
      subtotal: parseFloat(calculatedTotals.subtotal.toFixed(2)),
      tax: parseFloat(calculatedTotals.tax.toFixed(2)),
      shippingCost: parseFloat(calculatedTotals.shippingCost.toFixed(2)),
      discount: parseFloat(calculatedTotals.discount.toFixed(2)),
      totalAmount: parseFloat(calculatedTotals.totalAmount.toFixed(2)),
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      paymentMethod: newOrderForm.paymentMethod,
      shippingMethod: newOrderForm.shippingMethod,
      shippingAddress: selectedCust.addresses?.[0] || {
        id: 'addr-gen',
        type: 'SHIPPING',
        name: `${selectedCust.firstName} Default`,
        phone: selectedCust.phone || '',
        addressLine1: 'Corporate Park Block A',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        isDefault: true
      },
      billingAddress: selectedCust.addresses?.[0] || {
        id: 'addr-gen',
        type: 'SHIPPING',
        name: `${selectedCust.firstName} Default`,
        phone: selectedCust.phone || '',
        addressLine1: 'Corporate Park Block A',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        isDefault: true
      },
      notes: newOrderForm.notes
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewOrderForm({
          customerId: '',
          shippingMethod: 'STANDARD',
          paymentMethod: 'WALLET',
          notes: '',
          items: []
        });
      }
    });
  };

  // Add customized timeline event
  const handleTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewedOrder || !newTimeline.title) return;

    updateOrderMutation.mutate({
      id: viewedOrder.id,
      data: {
        timeline: [
          ...viewedOrder.timeline,
          {
            id: `ev-add-${Date.now()}`,
            status: newTimeline.status,
            title: newTimeline.title,
            description: newTimeline.description || 'Administrative commentary logged.',
            actor: 'System Operations Controller',
            timestamp: new Date().toISOString()
          }
        ]
      }
    }, {
      onSuccess: () => {
        setNewTimeline({ title: '', description: '', status: 'PROCESSING' });
      }
    });
  };

  const columns = React.useMemo<ColumnDef<Order, any>[]>(() => [
    {
      id: 'OrderNumber',
      accessorKey: 'orderNumber',
      header: 'Order Reference',
      cell: ({ row }) => (
        <button
          onClick={() => setViewedOrderId(row.original.id)}
          className="font-mono text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline text-left"
        >
          {row.getValue('OrderNumber')}
        </button>
      ),
    },
    {
      id: 'Customer',
      accessorKey: 'customerName',
      header: 'Customer Details',
      cell: ({ row }) => {
        const o = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-bold text-slate-850 dark:text-zinc-100 text-xs">{o.customerName}</span>
            <span className="text-[10px] text-slate-400 font-mono">{o.customerEmail}</span>
          </div>
        );
      },
    },
    {
      id: 'Date',
      accessorKey: 'createdAt',
      header: 'Submitted On',
      cell: ({ row }) => (
        <span className="text-slate-400 font-mono text-[10px]">
          {new Date(row.getValue('Date')).toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      ),
    },
    {
      id: 'Total',
      accessorKey: 'totalAmount',
      header: 'Ledger Total',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-zinc-100">
          ₹{row.getValue('Total').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      id: 'PaymentStatus',
      accessorKey: 'paymentStatus',
      header: 'Payment Status',
      cell: ({ row }) => {
        const val = row.getValue('PaymentStatus') as PaymentStatus;
        return (
          <Badge
            variant={
              val === 'PAID' ? 'success' : val === 'REFUNDED' ? 'warning' : 'error'
            }
          >
            {val}
          </Badge>
        );
      },
    },
    {
      id: 'Status',
      accessorKey: 'status',
      header: 'Fulfillment Status',
      cell: ({ row }) => {
        const status = row.getValue('Status') as OrderStatus;
        let bVariant: 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'neutral';
        if (['DELIVERED', 'SHIPPED'].includes(status)) bVariant = 'success';
        if (['PROCESSING', 'PICKING', 'PACKING', 'READY_FOR_SHIPPING'].includes(status)) bVariant = 'info';
        if (['HOLD'].includes(status)) bVariant = 'warning';
        if (['CANCELLED'].includes(status)) bVariant = 'error';

        return <Badge variant={bVariant}>{status.replace(/_/g, ' ')}</Badge>;
      },
    },
    {
      id: 'ShippingMethod',
      accessorKey: 'shippingMethod',
      header: 'Routing Carrier',
      cell: ({ row }) => {
        const o = row.original;
        return (
          <div className="flex flex-col text-[10px]">
            <span className="font-bold text-slate-600 dark:text-zinc-300">{o.shippingMethod}</span>
            {o.carrier && <span className="text-slate-400 font-mono">{o.carrier}</span>}
          </div>
        );
      },
    },
    {
      id: 'Actions',
      header: () => <div className="text-right">Controls</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewedOrderId(row.original.id)}
            title="Open 360° Console"
          >
            <Eye className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
          </Button>
          {row.original.status === 'HOLD' ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                if (confirm(`Release hold for Order #${row.original.orderNumber}?`)) {
                  releaseOrderMutation.mutate(row.original.id);
                }
              }}
              title="Release hold"
            >
              <Check className="w-4 h-4 text-emerald-600" />
            </Button>
          ) : (
            !['DELIVERED', 'CANCELLED', 'RETURNED'].includes(row.original.status) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setViewedOrderId(row.original.id);
                  setIsHoldOpen(true);
                }}
                title="Place Hold"
              >
                <ShieldAlert className="w-4 h-4 text-amber-500" />
              </Button>
            )
          )}
        </div>
      ),
      enableSorting: false,
    },
  ], [orders]);

  return (
    <div className="w-full relative" id="order-table-root">
      {/* Search & Tabs Segmented controller */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-zinc-850 pb-4 mb-4">
        {/* Horizontal Status Filter Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-zinc-850 p-1.5 rounded-xl border border-slate-200/50 dark:border-zinc-800 overflow-x-auto max-w-full">
          {['ALL', 'PENDING', 'APPROVED', 'PROCESSING', 'HOLD', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wide transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300'
              }`}
            >
              {tab.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Create Order Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="self-end sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Register Order
        </Button>
      </div>

      <EnterpriseTable
        data={filteredOrders}
        columns={columns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isLoading={isLoading}
      />

      {/* ==========================================
          360° ORDER DETAILS DRAWER CONSOLE
          ========================================== */}
      {viewedOrder && (
        <div className="fixed inset-0 z-40 bg-slate-900/45 backdrop-blur-xs flex justify-end" id="drawer-container">
          {/* Close Backdrop Click */}
          <div className="absolute inset-0 -z-10" onClick={() => setViewedOrderId(null)} />

          <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 h-full flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="sticky top-0 bg-slate-50 dark:bg-zinc-850 border-b border-slate-200 dark:border-zinc-800 py-4 px-6 flex justify-between items-center z-10">
              <div>
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operational Audit Console</span>
                <h3 className="text-base font-extrabold text-slate-850 dark:text-zinc-50 flex items-center gap-2 mt-0.5">
                  <Boxes className="w-4.5 h-4.5 text-indigo-500" />
                  {viewedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setViewedOrderId(null)}
                className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-250 font-bold text-lg rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              
              {/* Order Status Ribbon */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-zinc-950/40 p-4 border border-slate-200/60 dark:border-zinc-800 rounded-xl">
                <div>
                  <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">Fulfillment</span>
                  <Badge variant="info" className="mt-1 font-mono">{viewedOrder.status}</Badge>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">Payment</span>
                  <Badge variant={viewedOrder.paymentStatus === 'PAID' ? 'success' : 'error'} className="mt-1 font-mono">{viewedOrder.paymentStatus}</Badge>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">Method</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200 mt-1 block">{viewedOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">Submitted On</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200 mt-1 block font-mono">
                    {new Date(viewedOrder.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Administrative hold info */}
              {viewedOrder.status === 'HOLD' && viewedOrder.holdReason && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 p-4 rounded-xl flex gap-3 text-amber-850 dark:text-amber-400">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <div>
                    <h5 className="font-bold">Administrative Lock Engaged</h5>
                    <p className="mt-0.5 text-[11px] font-medium text-amber-800 dark:text-amber-500">{viewedOrder.holdReason}</p>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => releaseOrderMutation.mutate(viewedOrder.id)}
                      className="bg-amber-600 hover:bg-amber-700 text-white mt-2 px-3 py-1 text-[10px] h-7"
                    >
                      Release Lock
                    </Button>
                  </div>
                </div>
              )}

              {/* Customer & Address split cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer card */}
                <div className="border border-slate-200/70 dark:border-zinc-800 p-4 rounded-xl space-y-2.5">
                  <h4 className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider font-mono text-[10px]">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    Customer Dossier
                  </h4>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 dark:text-zinc-100">{viewedOrder.customerName}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{viewedOrder.customerEmail}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{viewedOrder.customerPhone}</p>
                  </div>
                </div>

                {/* Logistics card */}
                <div className="border border-slate-200/70 dark:border-zinc-800 p-4 rounded-xl space-y-2.5">
                  <h4 className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider font-mono text-[10px]">
                    <Truck className="w-3.5 h-3.5 text-emerald-500" />
                    Logistics Routing
                  </h4>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 dark:text-zinc-100">{viewedOrder.shippingMethod} Shipping</p>
                    <p className="text-slate-500">{viewedOrder.shippingAddress.name}</p>
                    <p className="text-slate-400 font-medium text-[11px]">
                      {viewedOrder.shippingAddress.addressLine1}, {viewedOrder.shippingAddress.city}, {viewedOrder.shippingAddress.state} - {viewedOrder.shippingAddress.postalCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table Card */}
              <div className="border border-slate-200/70 dark:border-zinc-800 rounded-xl overflow-hidden">
                <div className="bg-slate-50 dark:bg-zinc-850/60 py-2.5 px-4 border-b border-slate-200 dark:border-zinc-800">
                  <h4 className="font-bold text-slate-850 dark:text-zinc-200 uppercase tracking-wider font-mono text-[10px]">Consigned Cargo Items</h4>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {viewedOrder.items.map((it) => (
                    <div key={it.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 dark:text-zinc-100">{it.productName}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {it.sku} | Unit: ₹{it.price.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right flex items-center gap-6">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block font-mono">QTY: {it.quantity}</span>
                          <span className="font-mono text-slate-900 dark:text-zinc-100 font-bold block">₹{it.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        {/* Picking & Packing visual checklists */}
                        <div className="text-left font-mono text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 uppercase font-bold text-[9px]">Pick:</span>
                            <Badge variant={it.pickingStatus === 'PICKED' ? 'success' : 'neutral'} className="text-[8px] px-1 py-0">{it.pickingStatus}</Badge>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-slate-400 uppercase font-bold text-[9px]">Pack:</span>
                            <Badge variant={it.packingStatus === 'PACKED' ? 'success' : 'neutral'} className="text-[8px] px-1 py-0">{it.packingStatus}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Ledger Breakdown Footer */}
                <div className="bg-slate-50/50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 p-4 space-y-1.5 text-right font-mono text-[11px] text-slate-500">
                  <div className="flex justify-between max-w-xs ml-auto">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-700 dark:text-zinc-300">₹{viewedOrder.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {viewedOrder.discount > 0 && (
                    <div className="flex justify-between max-w-xs ml-auto text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Tier discount:</span>
                      <span>-₹{viewedOrder.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between max-w-xs ml-auto">
                    <span>Tax (GST 18%):</span>
                    <span className="font-bold text-slate-700 dark:text-zinc-300">₹{viewedOrder.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between max-w-xs ml-auto">
                    <span>Shipping Charges:</span>
                    <span className="font-bold text-slate-700 dark:text-zinc-300">₹{viewedOrder.shippingCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between max-w-xs ml-auto text-sm text-slate-900 dark:text-zinc-50 font-extrabold border-t border-slate-200 dark:border-zinc-800 pt-2 mt-2">
                    <span>Grand Total:</span>
                    <span>₹{viewedOrder.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* LIVE TRACKING MODULE DETAILS */}
              {viewedOrder.trackingNumber && (
                <div className="border border-slate-200/70 dark:border-zinc-800 p-4 rounded-xl space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
                    <h4 className="font-bold text-slate-850 dark:text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider font-mono text-[10px]">
                      <Truck className="w-3.5 h-3.5 text-emerald-500" />
                      Carrier Tracking Hub
                    </h4>
                    <span className="font-mono font-bold text-[10px] text-slate-400">{viewedOrder.carrier}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 text-[10px] font-mono block uppercase">WAYBILL CODE</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-zinc-100 text-xs">{viewedOrder.trackingNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] font-mono block uppercase">EXPECTED ARRIVAL</span>
                      <span className="font-bold text-slate-800 dark:text-zinc-100 text-xs font-mono">{viewedOrder.estimatedDeliveryDate || 'TBD'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TIMELINE TRACK SECTION */}
              <div className="border border-slate-200/70 dark:border-zinc-800 rounded-xl p-5 space-y-4">
                <h4 className="font-bold text-slate-850 dark:text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider font-mono text-[10px] border-b border-slate-100 dark:border-zinc-800 pb-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  Chronological Audit Stream
                </h4>
                
                {/* Real interactive timeline points list */}
                <div className="relative border-l border-slate-200 dark:border-zinc-800 pl-4 ml-2 space-y-4">
                  {viewedOrder.timeline.map((ev) => (
                    <div key={ev.id} className="relative">
                      {/* Round timeline circle */}
                      <span className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-zinc-900 ${
                        ev.status === 'DELIVERED' ? 'bg-emerald-500' :
                        ev.status === 'SHIPPED' ? 'bg-indigo-500' :
                        ev.status === 'HOLD' ? 'bg-amber-500' :
                        ev.status === 'CANCELLED' ? 'bg-rose-500' : 'bg-slate-400'
                      }`} />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 justify-between">
                          <span className="font-bold text-slate-800 dark:text-zinc-200">{ev.title}</span>
                          <span className="text-[9px] font-mono text-slate-400">
                            {new Date(ev.timestamp).toLocaleDateString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-500 leading-normal">{ev.description}</p>
                        <span className="text-[9px] font-bold text-slate-400 font-mono uppercase block">BY: {ev.actor}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Timeline comment box form */}
                <form onSubmit={handleTimelineSubmit} className="bg-slate-50 dark:bg-zinc-850 p-4 border border-slate-200/50 dark:border-zinc-800 rounded-lg space-y-3">
                  <span className="font-bold text-slate-700 dark:text-zinc-300 font-mono text-[9px] uppercase tracking-wide block">Inject Audit Timeline Event</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Comment title (e.g. Call logs, address edited)"
                      required
                      value={newTimeline.title}
                      onChange={(e) => setNewTimeline(p => ({ ...p, title: e.target.value }))}
                    />
                    <select
                      value={newTimeline.status}
                      onChange={(e: any) => setNewTimeline(p => ({ ...p, status: e.target.value }))}
                      className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 outline-hidden"
                    >
                      <option value="PROCESSING">Status: Processing</option>
                      <option value="HOLD">Status: Hold</option>
                      <option value="APPROVED">Status: Approved</option>
                    </select>
                  </div>
                  <Textarea
                    placeholder="Enter event commentary or internal staff directions..."
                    value={newTimeline.description}
                    onChange={(e) => setNewTimeline(p => ({ ...p, description: e.target.value }))}
                    className="h-16"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" variant="outline" size="sm" className="h-7 text-[10px] font-mono">
                      Log Event
                    </Button>
                  </div>
                </form>
              </div>

              {/* Core Administrative Action Ribbons */}
              <div className="border border-slate-200/70 dark:border-zinc-800 rounded-xl p-5 space-y-4">
                <h4 className="font-bold text-slate-850 dark:text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider font-mono text-[10px] border-b border-slate-100 dark:border-zinc-800 pb-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  Staff Operations Controls
                </h4>
                
                <div className="flex flex-wrap gap-2.5">
                  {/* Action buttons conditionally rendered */}
                  {viewedOrder.paymentStatus === 'UNPAID' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        if (viewedOrder.invoiceId) {
                          payInvoiceMutation.mutate(viewedOrder.invoiceId);
                        } else {
                          toast.error('Invoice not generated. Please generate invoice inside Invoices tab first.');
                        }
                      }}
                      isLoading={payInvoiceMutation.isPending}
                    >
                      <Wallet className="w-4 h-4 mr-1.5" /> Force Record Payment
                    </Button>
                  )}

                  {viewedOrder.status === 'READY_FOR_SHIPPING' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsShipOpen(true)}
                    >
                      <Truck className="w-4 h-4 mr-1.5" /> Dispatch Shipment (Carrier)
                    </Button>
                  )}

                  {viewedOrder.status !== 'HOLD' && !['DELIVERED', 'CANCELLED', 'RETURNED'].includes(viewedOrder.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsHoldOpen(true)}
                      className="border-amber-300 hover:bg-amber-50 hover:text-amber-800 text-amber-600 font-bold dark:border-amber-800 dark:hover:bg-amber-950/20"
                    >
                      Place Hold
                    </Button>
                  )}

                  {!['DELIVERED', 'CANCELLED', 'RETURNED'].includes(viewedOrder.status) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCancelOpen(true)}
                      className="hover:bg-rose-50 text-rose-600 hover:text-rose-800 font-bold dark:hover:bg-rose-950/20"
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          ADMINISTRATIVE PLACE HOLD PROMPT DIALOG
          ========================================== */}
      {isHoldOpen && viewedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-850 dark:text-zinc-100 flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2 text-amber-500" /> Lock order
            </h4>
            <div className="space-y-4 text-xs">
              <p className="text-slate-500">
                You are placing <b>Order #{viewedOrder.orderNumber}</b> on hold. This freezes warehouse picking and packing sequences until released.
              </p>
              <Textarea
                label="Auditable Hold Reason *"
                placeholder="Describe why this order is locked (e.g. pending manual credit clearance, Address verification failed...)"
                required
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-850">
              <Button variant="outline" size="sm" onClick={() => setIsHoldOpen(false)}>Cancel</Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="bg-amber-600 hover:bg-amber-700"
                onClick={() => {
                  if (!holdReason) {
                    toast.error('Reason is required.');
                    return;
                  }
                  holdOrderMutation.mutate({ id: viewedOrder.id, reason: holdReason }, {
                    onSuccess: () => {
                      setIsHoldOpen(false);
                      setHoldReason('');
                    }
                  });
                }}
              >
                Confirm Hold Lock
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          ADMINISTRATIVE CANCEL PROMPT DIALOG
          ========================================== */}
      {isCancelOpen && viewedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider font-mono text-rose-500 flex items-center">
              <XCircle className="w-4 h-4 mr-2" /> Void / Cancel Order
            </h4>
            <div className="space-y-4 text-xs">
              <p className="text-slate-500">
                Are you sure you want to cancel <b>Order #{viewedOrder.orderNumber}</b>? If paid, this triggers immediate automatic refund ledger entries to the customer CRM wallet balance.
              </p>
              <Textarea
                label="Reason for Voiding *"
                placeholder="Explain why this consignment is voided..."
                required
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-850">
              <Button variant="outline" size="sm" onClick={() => setIsCancelOpen(false)}>Back</Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="bg-rose-600 hover:bg-rose-700"
                onClick={() => {
                  if (!cancelReason) {
                    toast.error('Reason is required.');
                    return;
                  }
                  cancelOrderMutation.mutate({ id: viewedOrder.id, reason: cancelReason }, {
                    onSuccess: () => {
                      setIsCancelOpen(false);
                      setCancelReason('');
                    }
                  });
                }}
              >
                Confirm Cancel Reversal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          DISPATCH CARRIER MANIFEST GENERATION
          ========================================== */}
      {isShipOpen && viewedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider font-mono text-emerald-600 flex items-center">
              <Truck className="w-4 h-4 mr-2" /> Generate Carrier Dispatch Manifest
            </h4>
            <div className="space-y-4 text-xs">
              <p className="text-slate-500">
                Registering carrier manifest details for dispatching <b>Order #{viewedOrder.orderNumber}</b>.
              </p>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Carrier Partner</label>
                <select
                  value={shipForm.carrier}
                  onChange={(e) => setShipForm(p => ({ ...p, carrier: e.target.value }))}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-sm"
                >
                  <option value="Blue Dart">Blue Dart Express</option>
                  <option value="DHL Express">DHL Logistics</option>
                  <option value="FedEx Cargo">FedEx Cargo</option>
                  <option value="Delhivery">Delhivery B2B</option>
                </select>
              </div>

              <Input
                label="Tracking/Airway Bill Number *"
                placeholder="e.g. BD-849302849"
                required
                value={shipForm.trackingNumber}
                onChange={(e) => setShipForm(p => ({ ...p, trackingNumber: e.target.value }))}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Logistics Priority</label>
                <select
                  value={shipForm.shippingMethod}
                  onChange={(e: any) => setShipForm(p => ({ ...p, shippingMethod: e.target.value }))}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-sm"
                >
                  <option value="STANDARD">STANDARD LAND CARRIER</option>
                  <option value="EXPRESS">EXPRESS AIRWAY</option>
                  <option value="FREIGHT">FREIGHT SEA CONSIGNMENT</option>
                  <option value="SAME_DAY">SAME-DAY LOCAL DISPATCH</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-zinc-850">
              <Button variant="outline" size="sm" onClick={() => setIsShipOpen(false)}>Back</Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  if (!shipForm.trackingNumber) {
                    toast.error('Tracking number is required.');
                    return;
                  }
                  createShipmentMutation.mutate({
                    orderId: viewedOrder.id,
                    data: {
                      carrier: shipForm.carrier,
                      trackingNumber: shipForm.trackingNumber,
                      shippingMethod: shipForm.shippingMethod,
                      items: viewedOrder.items.map(it => ({ sku: it.sku, qty: it.quantity }))
                    }
                  }, {
                    onSuccess: () => {
                      setIsShipOpen(false);
                      setShipForm({ carrier: 'Blue Dart', trackingNumber: '', shippingMethod: 'EXPRESS' });
                    }
                  });
                }}
              >
                Generate Bill of Lading
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          REGISTER ENTERPRISE ORDER WIZARD MODAL
          ========================================== */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form 
            onSubmit={handleCreateSubmit}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 max-w-2xl w-full shadow-2xl space-y-5 my-8 text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-850 pb-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-850 dark:text-zinc-50 flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-indigo-500" />
                  Enterprise Checkout Wizard
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">Provision new customer purchase contracts directly into warehouse queues.</p>
              </div>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {/* Step 1: Select Customer & Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Select Customer Profile *</label>
                <select
                  required
                  value={newOrderForm.customerId}
                  onChange={(e) => setNewOrderForm(p => ({ ...p, customerId: e.target.value }))}
                  className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm"
                >
                  <option value="">-- Choose Account --</option>
                  {customers.map((c: Customer) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} ({c.groupName} - Balance: ₹{c.walletBalance.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Shipping Delivery Priority *</label>
                <select
                  required
                  value={newOrderForm.shippingMethod}
                  onChange={(e: any) => setNewOrderForm(p => ({ ...p, shippingMethod: e.target.value }))}
                  className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm"
                >
                  <option value="STANDARD">STANDARD CARRIER (₹100)</option>
                  <option value="EXPRESS">EXPRESS SPEED (₹250)</option>
                  <option value="FREIGHT">FREIGHT CONTAINER (₹1,200)</option>
                  <option value="SAME_DAY">SAME-DAY LOCAL (₹500)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Payment Clearance Channel *</label>
                <select
                  required
                  value={newOrderForm.paymentMethod}
                  onChange={(e: any) => setNewOrderForm(p => ({ ...p, paymentMethod: e.target.value }))}
                  className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm"
                >
                  <option value="WALLET">CRM WALLET LEDGER</option>
                  <option value="BANK_TRANSFER">BANK TRANSFER (NET-30)</option>
                  <option value="CREDIT_CARD">CREDIT CARD TRANSIT</option>
                  <option value="CASH_ON_DELIVERY">CASH ON DELIVERY (COD)</option>
                </select>
              </div>

              <Input
                label="Purchase Reference Notes"
                placeholder="e.g. Customer PO number, instructions..."
                value={newOrderForm.notes}
                onChange={(e) => setNewOrderForm(p => ({ ...p, notes: e.target.value }))}
              />
            </div>

            {/* Step 2: Selected Products Items Builder */}
            <div className="border border-slate-200/60 dark:border-zinc-800 rounded-xl p-4 space-y-3 bg-slate-50/50 dark:bg-zinc-900/40">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-2">
                <span className="font-bold text-slate-800 dark:text-zinc-200 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                  <Boxes className="w-4 h-4 text-emerald-500" />
                  Cargo Item Builder
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-[10px] font-mono"
                  onClick={() => setNewOrderForm(p => ({
                    ...p,
                    items: [...p.items, { productId: CATALOG_PRODUCTS[0].id, quantity: 1 }]
                  }))}
                >
                  + Add Line Item
                </Button>
              </div>

              {newOrderForm.items.length === 0 ? (
                <div className="py-6 text-center text-slate-400 flex flex-col items-center justify-center gap-1.5">
                  <Boxes className="w-8 h-8 text-slate-300" />
                  <p className="font-medium">Click &quot;Add Line Item&quot; to compile cargo products.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {newOrderForm.items.map((item, index) => {
                    const matchedProd = CATALOG_PRODUCTS.find(cp => cp.id === item.productId);
                    return (
                      <div key={index} className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 p-2 rounded-lg">
                        <select
                          value={item.productId}
                          onChange={(e) => {
                            const updated = [...newOrderForm.items];
                            updated[index].productId = e.target.value;
                            setNewOrderForm(p => ({ ...p, items: updated }));
                          }}
                          className="flex-1 bg-transparent p-1 border-0 focus:ring-0 text-xs"
                        >
                          {CATALOG_PRODUCTS.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} (₹{p.price.toLocaleString('en-IN')})
                            </option>
                          ))}
                        </select>
                        <Input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...newOrderForm.items];
                            updated[index].quantity = parseInt(e.target.value) || 1;
                            setNewOrderForm(p => ({ ...p, items: updated }));
                          }}
                          className="w-20 py-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = newOrderForm.items.filter((_, i) => i !== index);
                            setNewOrderForm(p => ({ ...p, items: updated }));
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Financial Invoice Breakdown panel */}
            <div className="bg-slate-50 dark:bg-zinc-950/40 p-4 border border-slate-200/60 dark:border-zinc-800 rounded-xl flex justify-between items-center font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Billing Breakdown</span>
                <div className="text-[10px] text-slate-500 space-y-0.5 mt-1.5">
                  <p>Subtotal: ₹{calculatedTotals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  {calculatedTotals.discount > 0 && <p className="text-emerald-600 font-bold">Tier Discount: -₹{calculatedTotals.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>}
                  <p>GST Tax (18%): ₹{calculatedTotals.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  <p>Shipping Cost: ₹{calculatedTotals.shippingCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Grand Total</span>
                <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 block mt-1">
                  ₹{calculatedTotals.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex justify-end gap-2.5 border-t border-slate-100 dark:border-zinc-850 pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="sm" 
                isLoading={createOrderMutation.isPending}
                disabled={newOrderForm.items.length === 0 || !newOrderForm.customerId}
              >
                Confirm Contract Order
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
