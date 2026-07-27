'use client';

import * as React from 'react';
import { Customer, Address, WalletTransaction, RewardPointHistory, WishlistItem, CustomerReview, SupportTicket, CustomerNote, ActivityLog } from '@/types/customer';
import { 
  useUpdateCustomer, 
  useWalletAdjustment, 
  usePointsAdjustment, 
  useAddCustomerNote, 
  useDeleteCustomerNote, 
  useTogglePinCustomerNote,
  useCreateTicket,
  useCustomerGroups
} from '@/hooks/useCustomers';
import { Badge, Button, Input, Textarea } from '@/components/enterprise/BaseInputs';
import { 
  User, Wallet, Coins, Heart, MessageSquare, AlertCircle, FileText, Activity, 
  MapPin, Check, Plus, Pin, PinOff, Trash2, ShieldAlert, CornerDownRight, Clock, Eye 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

interface CustomerProfile360Props {
  customer: Customer;
}

export function CustomerProfile360({ customer }: CustomerProfile360Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'addresses' | 'wallet' | 'loyalty' | 'wishlist' | 'reviews' | 'tickets' | 'notes' | 'activity'>('overview');
  
  // Hooks
  const updateCustMutation = useUpdateCustomer();
  const adjustWalletMutation = useWalletAdjustment();
  const adjustPointsMutation = usePointsAdjustment();
  const addNoteMutation = useAddCustomerNote();
  const deleteNoteMutation = useDeleteCustomerNote();
  const togglePinNoteMutation = useTogglePinCustomerNote();
  const createTicketMutation = useCreateTicket();
  const { data: groups = [] } = useCustomerGroups();

  // Form states
  const [walletForm, setWalletForm] = React.useState({ type: 'CREDIT' as 'CREDIT' | 'DEBIT', amount: '', purpose: 'DEPOSIT' as any, notes: '' });
  const [pointsForm, setPointsForm] = React.useState({ type: 'EARNED' as 'EARNED' | 'REDEEMED', points: '', reason: '' });
  const [noteForm, setNoteForm] = React.useState({ content: '', type: 'PRIVATE' as 'PRIVATE' | 'PUBLIC' });
  const [ticketForm, setTicketForm] = React.useState({ title: '', dept: 'GENERAL' as any, priority: 'MEDIUM' as any, category: '', message: '' });

  // Address add placeholder
  const [showAddressForm, setShowAddressForm] = React.useState(false);
  const [addressForm, setAddressForm] = React.useState<Omit<Address, 'id'>>({
    type: 'SHIPPING', isDefault: false, name: '', phone: '', addressLine1: '', city: '', state: '', postalCode: '', country: 'India'
  });

  const handleStatusChange = (status: Customer['status']) => {
    updateCustMutation.mutate({ id: customer.id, data: { status } });
  };

  const handleGroupChange = (groupId: string) => {
    const grp = groups.find(g => g.id === groupId);
    if (grp) {
      updateCustMutation.mutate({ id: customer.id, data: { groupId, groupName: grp.name } });
    }
  };

  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(walletForm.amount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    adjustWalletMutation.mutate({
      customerId: customer.id,
      data: {
        type: walletForm.type,
        amount: amountVal,
        purpose: walletForm.purpose,
        notes: walletForm.notes,
        approvedBy: 'CRM System Lead'
      }
    }, {
      onSuccess: () => setWalletForm({ type: 'CREDIT', amount: '', purpose: 'DEPOSIT', notes: '' })
    });
  };

  const handlePointsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pointsVal = parseInt(pointsForm.points);
    if (isNaN(pointsVal) || pointsVal <= 0) return;

    adjustPointsMutation.mutate({
      customerId: customer.id,
      data: {
        type: pointsForm.type === 'REDEEMED' ? 'REDEEMED' : 'EARNED',
        points: pointsVal,
        reason: pointsForm.reason
      }
    }, {
      onSuccess: () => setPointsForm({ type: 'EARNED', points: '', reason: '' })
    });
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.content.trim()) return;

    addNoteMutation.mutate({
      customerId: customer.id,
      data: {
        content: noteForm.content,
        type: noteForm.type,
        author: 'Current Staff Operator'
      }
    }, {
      onSuccess: () => setNoteForm(p => ({ ...p, content: '' }))
    });
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.title.trim() || !ticketForm.message.trim()) return;

    createTicketMutation.mutate({
      customerId: customer.id,
      data: {
        title: ticketForm.title,
        department: ticketForm.dept,
        priority: ticketForm.priority,
        category: ticketForm.category || 'CRM General',
        initialMessage: ticketForm.message
      }
    }, {
      onSuccess: () => setTicketForm({ title: '', dept: 'GENERAL', priority: 'MEDIUM', category: '', message: '' })
    });
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress: Address = {
      ...addressForm,
      id: `addr-${Date.now()}`
    };

    // Replace or add addresses
    const updatedAddresses = addressForm.isDefault
      ? customer.addresses.map(a => a.type === addressForm.type ? { ...a, isDefault: false } : a).concat(newAddress)
      : customer.addresses.concat(newAddress);

    updateCustMutation.mutate({
      id: customer.id,
      data: { addresses: updatedAddresses }
    }, {
      onSuccess: () => {
        setShowAddressForm(false);
        setAddressForm({ type: 'SHIPPING', isDefault: false, name: '', phone: '', addressLine1: '', city: '', state: '', postalCode: '', country: 'India' });
      }
    });
  };

  const handleDeleteAddress = (addrId: string) => {
    const updated = customer.addresses.filter(a => a.id !== addrId);
    updateCustMutation.mutate({ id: customer.id, data: { addresses: updated } });
  };

  return (
    <div className="space-y-6" id="customer-profile-360">
      {/* 1. Header Hero Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-8 -translate-y-8">
          <User className="w-80 h-80" />
        </div>
        <div className="flex items-center gap-4 z-10">
          <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-zinc-850 flex items-center justify-center font-bold text-2xl text-slate-800 dark:text-zinc-200 border-2 border-slate-200 dark:border-zinc-750 overflow-hidden shadow-md">
            {customer.avatarUrl ? (
              <img src={customer.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              `${customer.firstName[0]}${customer.lastName[0]}`
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight leading-none">
                {customer.firstName} {customer.lastName}
              </h1>
              <Badge variant={customer.status === 'ACTIVE' ? 'success' : customer.status === 'INACTIVE' ? 'neutral' : 'error'}>
                {customer.status}
              </Badge>
              <Badge variant="neutral" className="font-mono">{customer.customerCode}</Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Registered via {customer.source} Onboarding SLA | Active member since {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">operational override</label>
            <div className="flex items-center gap-1.5">
              <select
                value={customer.status}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className="p-1.5 text-xs font-bold bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-850 rounded-md text-slate-700 dark:text-zinc-300"
              >
                <option value="ACTIVE">ACTIVE (Active status)</option>
                <option value="INACTIVE">INACTIVE (Dormant profile)</option>
                <option value="BLOCKED">BLOCKED (Locked account)</option>
              </select>
              
              <select
                value={customer.groupId}
                onChange={(e) => handleGroupChange(e.target.value)}
                className="p-1.5 text-xs font-bold bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-850 rounded-md text-slate-700 dark:text-zinc-300"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>Tier: {g.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mini KPI Bento cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">wallet asset</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">
              ₹{customer.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-lg"><Wallet className="w-4 h-4" /></div>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">loyalty credit</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">
              {customer.rewardPoints.toLocaleString()} pts
            </span>
          </div>
          <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-lg"><Coins className="w-4 h-4" /></div>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">support requests</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">
              {customer.tickets.length} Opened
            </span>
          </div>
          <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-lg"><AlertCircle className="w-4 h-4" /></div>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">wishlist items</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-zinc-50 font-mono mt-0.5 block">
              {customer.wishlist.length} Items
            </span>
          </div>
          <div className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-lg"><Heart className="w-4 h-4" /></div>
        </div>
      </div>

      {/* 3. Main Dashboard Navigation tab bar */}
      <div className="border-b border-slate-200 dark:border-zinc-850 flex gap-1 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: '360° Overview', icon: User },
          { id: 'addresses', label: 'Addresses', icon: MapPin },
          { id: 'wallet', label: 'Wallet ledger', icon: Wallet },
          { id: 'loyalty', label: 'Reward Points', icon: Coins },
          { id: 'wishlist', label: 'Wishlist', icon: Heart },
          { id: 'reviews', label: 'Catalog Reviews', icon: MessageSquare },
          { id: 'tickets', label: 'Support Helpdesk', icon: AlertCircle },
          { id: 'notes', label: 'CRM Notes', icon: FileText },
          { id: 'activity', label: 'Audit Timeline', icon: Activity },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 font-mono uppercase tracking-wider ${
                isActive 
                  ? 'border-slate-800 text-slate-900 dark:border-brand dark:text-zinc-50' 
                  : 'border-transparent text-slate-400 dark:text-zinc-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-zinc-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Panels */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {/* 360 OVERVIEW PANEL */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left 2: demographic details */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-6 space-y-4 shadow-xs">
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">Demographic registry parameters</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                      <div className="space-y-1 p-3 bg-slate-50 dark:bg-zinc-850/50 rounded-lg border border-slate-100 dark:border-zinc-800">
                        <span className="text-slate-400 block font-mono text-[10px] uppercase">Registered Email</span>
                        <span className="text-slate-800 dark:text-zinc-100 font-bold">{customer.email}</span>
                        <span className="text-[9px] text-emerald-600 block font-bold">{customer.emailVerified ? 'SMTP verified' : 'unverified'}</span>
                      </div>

                      <div className="space-y-1 p-3 bg-slate-50 dark:bg-zinc-850/50 rounded-lg border border-slate-100 dark:border-zinc-800">
                        <span className="text-slate-400 block font-mono text-[10px] uppercase">Mobile Phone</span>
                        <span className="text-slate-800 dark:text-zinc-100 font-bold">{customer.phone}</span>
                        <span className="text-[9px] text-emerald-600 block font-bold">{customer.phoneVerified ? 'OTP verified' : 'unverified'}</span>
                      </div>

                      <div className="space-y-1 p-3 bg-slate-50 dark:bg-zinc-850/50 rounded-lg border border-slate-100 dark:border-zinc-800">
                        <span className="text-slate-400 block font-mono text-[10px] uppercase">Date Of Birth</span>
                        <span className="text-slate-800 dark:text-zinc-100 font-bold">{customer.dob || 'Not Provided'}</span>
                      </div>

                      <div className="space-y-1 p-3 bg-slate-50 dark:bg-zinc-850/50 rounded-lg border border-slate-100 dark:border-zinc-800">
                        <span className="text-slate-400 block font-mono text-[10px] uppercase">Gender identification</span>
                        <span className="text-slate-800 dark:text-zinc-100 font-bold">{customer.gender || 'Not Provided'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 font-mono uppercase">Active Tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {customer.tags.map(t => (
                          <Badge key={t} variant="neutral" className="text-[10px] py-0.5 px-2 font-mono">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Mini log */}
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-6 space-y-4 shadow-xs">
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">recent crm occurrences</h3>
                    <div className="space-y-3">
                      {customer.activityLogs.slice(0, 3).map((log) => (
                        <div key={log.id} className="flex gap-3 items-start border-b border-slate-100/50 dark:border-zinc-850 pb-2 text-xs">
                          <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 dark:text-zinc-200 block">{log.title}</span>
                            <p className="text-slate-500">{log.description}</p>
                            <span className="text-[9px] text-slate-400 block font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 1: system notes & settings summary */}
                <div className="space-y-6">
                  {/* Pinned notes card */}
                  <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/40 rounded-xl p-5 shadow-xs space-y-3.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-amber-800 dark:text-amber-500 flex items-center">
                      <Pin className="w-4 h-4 mr-2" /> Pinned CRM Directives
                    </h4>
                    {customer.notes.filter(n => n.isPinned).length === 0 ? (
                      <p className="text-xs text-amber-700 dark:text-amber-600/80 italic">No pinned directives recorded. Pin notes to keep them visible.</p>
                    ) : (
                      customer.notes.filter(n => n.isPinned).map(note => (
                        <div key={note.id} className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-amber-100 dark:border-amber-900/30 text-xs shadow-2xs space-y-2">
                          <p className="text-slate-700 dark:text-zinc-300 italic">&ldquo;{note.content}&rdquo;</p>
                          <div className="flex justify-between items-center text-[9px] font-semibold text-slate-400 font-mono">
                            <span>BY {note.author.toUpperCase()}</span>
                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pricing group tier description */}
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">Pricing and SLA Tier</h4>
                    <div className="p-3 bg-slate-50 dark:bg-zinc-850/50 rounded-lg border border-slate-100 dark:border-zinc-800 text-xs">
                      <span className="font-bold text-slate-800 dark:text-zinc-100">{customer.groupName}</span>
                      <p className="text-slate-500 mt-1">Special pre-configured rules apply automatically during checkout on checkout node workflows.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADDRESSES TAB PANEL */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">Customer Location Registry</h3>
                  <Button size="sm" variant="outline" onClick={() => setShowAddressForm(!showAddressForm)}>
                    <Plus className="w-4 h-4 mr-1.5" /> Register New Address
                  </Button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddressSubmit} className="bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="sm:col-span-3 pb-2 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center">
                      <h4 className="font-bold text-slate-800 dark:text-zinc-200">Register Location</h4>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="text-slate-400">✕</button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-700">Classification</label>
                      <select
                        value={addressForm.type}
                        onChange={(e: any) => setAddressForm(p => ({ ...p, type: e.target.value }))}
                        className="p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg"
                      >
                        <option value="BILLING">BILLING (Invoice target)</option>
                        <option value="SHIPPING">SHIPPING (Consignment target)</option>
                      </select>
                    </div>

                    <Input
                      label="Contact Name *"
                      required
                      placeholder="e.g. Yash Gupta Office"
                      value={addressForm.name}
                      onChange={(e) => setAddressForm(p => ({ ...p, name: e.target.value }))}
                    />

                    <Input
                      label="Mobile Phone *"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm(p => ({ ...p, phone: e.target.value }))}
                    />

                    <div className="sm:col-span-2">
                      <Input
                        label="Address Line 1 *"
                        required
                        placeholder="Suite #, Building, Complex..."
                        value={addressForm.addressLine1}
                        onChange={(e) => setAddressForm(p => ({ ...p, addressLine1: e.target.value }))}
                      />
                    </div>

                    <Input
                      label="City *"
                      required
                      placeholder="e.g. Mumbai"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm(p => ({ ...p, city: e.target.value }))}
                    />

                    <Input
                      label="State *"
                      required
                      placeholder="e.g. Maharashtra"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm(p => ({ ...p, state: e.target.value }))}
                    />

                    <Input
                      label="Postal Code *"
                      required
                      placeholder="e.g. 400050"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm(p => ({ ...p, postalCode: e.target.value }))}
                    />

                    <Input
                      label="Country *"
                      required
                      placeholder="e.g. India"
                      value={addressForm.country}
                      onChange={(e) => setAddressForm(p => ({ ...p, country: e.target.value }))}
                    />

                    <div className="sm:col-span-3 flex items-center gap-2 py-2">
                      <input
                        type="checkbox"
                        id="isDefaultAddr"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm(p => ({ ...p, isDefault: e.target.checked }))}
                        className="rounded-sm border-slate-300 text-slate-800"
                      />
                      <label htmlFor="isDefaultAddr" className="font-semibold text-slate-700 dark:text-zinc-300">Set as default address for this type</label>
                    </div>

                    <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-zinc-850">
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                      <Button type="submit" variant="primary" size="sm">Add Address</Button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customer.addresses.length === 0 ? (
                    <div className="md:col-span-2 py-8 text-center text-slate-400 font-semibold text-xs border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/20">
                      No addresses logged for this client profile.
                    </div>
                  ) : (
                    customer.addresses.map((addr) => (
                      <div key={addr.id} className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-xl space-y-3 shadow-2xs relative">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Badge variant={addr.type === 'BILLING' ? 'info' : 'success'}>
                              {addr.type}
                            </Badge>
                            {addr.isDefault && <Badge variant="neutral">DEFAULT</Badge>}
                          </div>
                          <button 
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-slate-400 hover:text-rose-500"
                            title="Delete location"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-xs space-y-1 text-slate-600 dark:text-zinc-300">
                          <h4 className="font-extrabold text-slate-800 dark:text-zinc-150">{addr.name}</h4>
                          <p>{addr.phone}</p>
                          <p>{addr.addressLine1}</p>
                          {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                          <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                          <p className="font-bold text-slate-400">{addr.country}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* WALLET LEDGER TAB PANEL */}
            {activeTab === 'wallet' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 1: Balance correction form */}
                <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4 h-fit">
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center">
                    <Wallet className="w-4 h-4 mr-2 text-emerald-500" />
                    Ledger Correction Entry
                  </h3>
                  <form onSubmit={handleWalletSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setWalletForm(p => ({ ...p, type: 'CREDIT' }))}
                        className={`p-2 rounded-lg border text-xs font-bold transition-colors ${walletForm.type === 'CREDIT' ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400' : 'bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-500'}`}
                      >
                        Credit (+)
                      </button>
                      <button
                        type="button"
                        onClick={() => setWalletForm(p => ({ ...p, type: 'DEBIT' }))}
                        className={`p-2 rounded-lg border text-xs font-bold transition-colors ${walletForm.type === 'DEBIT' ? 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-400' : 'bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-500'}`}
                      >
                        Debit (-)
                      </button>
                    </div>

                    <Input
                      label="Adjustment Amount (INR) *"
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 1000.00"
                      value={walletForm.amount}
                      onChange={(e) => setWalletForm(p => ({ ...p, amount: e.target.value }))}
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Transaction Purpose</label>
                      <select
                        value={walletForm.purpose}
                        onChange={(e: any) => setWalletForm(p => ({ ...p, purpose: e.target.value }))}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm transition-all outline-hidden text-slate-900 dark:text-zinc-100"
                      >
                        <option value="DEPOSIT">Customer Fund Deposit</option>
                        <option value="REFUND">Order Cancellation Refund</option>
                        <option value="ADJUSTMENT">SLA / Admin Correction</option>
                        <option value="ORDER_PAYMENT">Order Purchase Payment</option>
                      </select>
                    </div>

                    <Textarea
                      label="Ledger Remarks *"
                      placeholder="Provide reasoning..."
                      required
                      value={walletForm.notes}
                      onChange={(e) => setWalletForm(p => ({ ...p, notes: e.target.value }))}
                    />

                    <Button type="submit" variant="primary" size="sm" className="w-full" isLoading={adjustWalletMutation.isPending}>
                      Commit Entry
                    </Button>
                  </form>
                </div>

                {/* Right 2: transactions table */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 mb-4">Financial ledger transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-zinc-850 text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Type</th>
                          <th className="py-2 px-3">Purpose</th>
                          <th className="py-2 px-3 text-right">Delta</th>
                          <th className="py-2 px-3">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
                        {customer.walletTransactions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-slate-400 font-semibold italic">No financial ledger lines found.</td>
                          </tr>
                        ) : (
                          customer.walletTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/45 transition-colors">
                              <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                                {new Date(tx.timestamp).toLocaleString()}
                              </td>
                              <td className="py-3 px-3">
                                <Badge variant={tx.type === 'CREDIT' ? 'success' : 'error'}>
                                  {tx.type}
                                </Badge>
                              </td>
                              <td className="py-3 px-3 font-bold font-mono text-[10px]">
                                {tx.purpose}
                              </td>
                              <td className={`py-3 px-3 text-right font-bold font-mono ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-slate-500">
                                {tx.notes || 'None'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* REWARDS TAB PANEL */}
            {activeTab === 'loyalty' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 1: Points form */}
                <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4 h-fit">
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center">
                    <Coins className="w-4 h-4 mr-2 text-amber-500" />
                    Loyalty Score Adjustment
                  </h3>
                  <form onSubmit={handlePointsSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPointsForm(p => ({ ...p, type: 'EARNED' }))}
                        className={`p-2 rounded-lg border text-xs font-bold transition-colors ${pointsForm.type === 'EARNED' ? 'bg-amber-50 border-amber-300 text-amber-850 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-400' : 'bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-500'}`}
                      >
                        Earn Points (+)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPointsForm(p => ({ ...p, type: 'REDEEMED' }))}
                        className={`p-2 rounded-lg border text-xs font-bold transition-colors ${pointsForm.type === 'REDEEMED' ? 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-400' : 'bg-slate-50 dark:bg-zinc-850 border-slate-200 dark:border-zinc-800 text-slate-500'}`}
                      >
                        Redeem Points (-)
                      </button>
                    </div>

                    <Input
                      label="Loyalty Points Delta *"
                      type="number"
                      required
                      placeholder="e.g. 200"
                      value={pointsForm.points}
                      onChange={(e) => setPointsForm(p => ({ ...p, points: e.target.value }))}
                    />

                    <Input
                      label="Adjustment Reason *"
                      placeholder="e.g. Promo Campaign points bonus..."
                      required
                      value={pointsForm.reason}
                      onChange={(e) => setPointsForm(p => ({ ...p, reason: e.target.value }))}
                    />

                    <Button type="submit" variant="primary" size="sm" className="w-full" isLoading={adjustPointsMutation.isPending}>
                      Adjust Points Balance
                    </Button>
                  </form>
                </div>

                {/* Right 2: History table */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 mb-4">Loyalty Ledger history</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-zinc-850 text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Type</th>
                          <th className="py-2 px-3">Points Action</th>
                          <th className="py-2 px-3 text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
                        {customer.rewardPointsHistory.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-slate-400 font-semibold italic">No loyalty records logged yet.</td>
                          </tr>
                        ) : (
                          customer.rewardPointsHistory.map((rw) => (
                            <tr key={rw.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/45 transition-colors">
                              <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                                {new Date(rw.timestamp).toLocaleString()}
                              </td>
                              <td className="py-3 px-3">
                                <Badge variant={rw.type === 'EARNED' ? 'success' : 'error'}>
                                  {rw.type}
                                </Badge>
                              </td>
                              <td className="py-3 px-3 text-slate-600 dark:text-zinc-200">
                                {rw.reason}
                              </td>
                              <td className={`py-3 px-3 text-right font-bold font-mono ${rw.type === 'EARNED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {rw.type === 'EARNED' ? '+' : '-'}{rw.points}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* WISHLIST TAB PANEL */}
            {activeTab === 'wishlist' && (
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-6 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 mb-4">Customer shopping wishlist</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  {customer.wishlist.length === 0 ? (
                    <div className="sm:col-span-3 py-10 text-center text-slate-400 font-semibold italic border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
                      Wishlist is empty. Add products to represent preferences.
                    </div>
                  ) : (
                    customer.wishlist.map((item) => (
                      <div key={item.sku} className="p-4 bg-slate-50 dark:bg-zinc-850/50 rounded-xl border border-slate-100 dark:border-zinc-800 flex flex-col justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-slate-800 dark:text-zinc-200">{item.productName}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{item.sku}</span>
                          <span className="block font-mono font-bold text-slate-900 dark:text-zinc-50 mt-1">₹{item.price.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="w-full py-1 text-[10px]"
                            onClick={() => {
                              alert(`Simulating adding ${item.productName} to orders basket queue.`);
                            }}
                          >
                            Add To Order
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            className="p-1 h-7 w-7 text-white"
                            onClick={() => {
                              alert(`Item removed.`);
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* REVIEWS TAB PANEL */}
            {activeTab === 'reviews' && (
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-6 shadow-xs space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">Published product ratings & feedback</h3>
                <div className="space-y-4">
                  {customer.reviews.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 font-semibold italic border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
                      No review logs recorded for this account.
                    </div>
                  ) : (
                    customer.reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-850/50 border border-slate-100 dark:border-zinc-800 text-xs space-y-3">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h4 className="font-extrabold text-slate-800 dark:text-zinc-200">{rev.productName}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">{rev.sku}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-amber-500 font-mono">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                            <Badge variant={rev.status === 'APPROVED' ? 'success' : rev.status === 'PENDING' ? 'warning' : 'error'}>
                              {rev.status}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-slate-600 dark:text-zinc-300 italic">&ldquo;{rev.reviewText}&rdquo;</p>

                        {rev.replyText && (
                          <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/60 dark:border-zinc-800 flex gap-2">
                            <CornerDownRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[10px] text-slate-400 font-mono uppercase block">SLA Reply Response</span>
                              <p className="text-slate-500 italic mt-0.5">&ldquo;{rev.replyText}&rdquo;</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* SUPPORT HELPDESK TAB PANEL */}
            {activeTab === 'tickets' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 1: File Support Request */}
                <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4 h-fit">
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-rose-500" />
                    Open Support Request
                  </h3>
                  <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
                    <Input
                      label="Ticket Title *"
                      required
                      placeholder="Summary of issue..."
                      value={ticketForm.title}
                      onChange={(e) => setTicketForm(p => ({ ...p, title: e.target.value }))}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Department</label>
                        <select
                          value={ticketForm.dept}
                          onChange={(e: any) => setTicketForm(p => ({ ...p, dept: e.target.value }))}
                          className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-lg py-2 px-3 text-sm outline-hidden text-slate-900 dark:text-zinc-100"
                        >
                          <option value="GENERAL">General Support</option>
                          <option value="BILLING">Billing & Accounts</option>
                          <option value="TECHNICAL">Technical Logistics</option>
                          <option value="SALES">B2B Procurement</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Priority SLA</label>
                        <select
                          value={ticketForm.priority}
                          onChange={(e: any) => setTicketForm(p => ({ ...p, priority: e.target.value }))}
                          className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-lg py-2 px-3 text-sm outline-hidden text-slate-900 dark:text-zinc-100"
                        >
                          <option value="LOW">LOW Tier</option>
                          <option value="MEDIUM">MEDIUM Tier</option>
                          <option value="HIGH">HIGH Tier</option>
                          <option value="URGENT">URGENT Priority</option>
                        </select>
                      </div>
                    </div>

                    <Input
                      label="Ticket Category"
                      placeholder="e.g. Customs, Invoice, Shipping delay..."
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm(p => ({ ...p, category: e.target.value }))}
                    />

                    <Textarea
                      label="Describe Issue *"
                      required
                      placeholder="Write your explanation message..."
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm(p => ({ ...p, message: e.target.value }))}
                    />

                    <Button type="submit" variant="primary" size="sm" className="w-full" isLoading={createTicketMutation.isPending}>
                      Log Request Ticket
                    </Button>
                  </form>
                </div>

                {/* Right 2: ticket registry table */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 mb-4">Opened support cases</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-zinc-850 text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                          <th className="py-2 px-3">Ticket ID</th>
                          <th className="py-2 px-3">Summary</th>
                          <th className="py-2 px-3">Dept</th>
                          <th className="py-2 px-3">Priority</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3 text-right">Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
                        {customer.tickets.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-slate-400 font-semibold italic">No opened support tickets.</td>
                          </tr>
                        ) : (
                          customer.tickets.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/45 transition-colors">
                              <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                                {t.ticketNumber}
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-extrabold text-slate-800 dark:text-zinc-200 max-w-[150px] truncate">{t.title}</div>
                                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{t.category}</span>
                              </td>
                              <td className="py-3 px-3 font-mono text-[10px]">{t.department}</td>
                              <td className="py-3 px-3">
                                <Badge variant={t.priority === 'URGENT' || t.priority === 'HIGH' ? 'error' : 'neutral'}>
                                  {t.priority}
                                </Badge>
                              </td>
                              <td className="py-3 px-3">
                                <Badge variant={t.status === 'RESOLVED' || t.status === 'CLOSED' ? 'success' : 'warning'}>
                                  {t.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 p-0"
                                  onClick={() => router.push(`/dashboard/customers/support-tickets/${t.id}`)}
                                >
                                  <Eye className="w-4 h-4 text-slate-500" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* CRM NOTES TAB PANEL */}
            {activeTab === 'notes' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 1: Add note */}
                <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4 h-fit">
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Log CRM Private Note
                  </h3>
                  <form onSubmit={handleNoteSubmit} className="space-y-4 text-xs">
                    <Textarea
                      label="CRM Note Content *"
                      required
                      placeholder="Write internal account notes or instructions..."
                      value={noteForm.content}
                      onChange={(e) => setNoteForm(p => ({ ...p, content: e.target.value }))}
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Visibility Type</label>
                      <select
                        value={noteForm.type}
                        onChange={(e: any) => setNoteForm(p => ({ ...p, type: e.target.value }))}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-lg py-2 px-3 text-sm outline-hidden text-slate-900 dark:text-zinc-100"
                      >
                        <option value="PRIVATE">PRIVATE (Staff view only)</option>
                        <option value="PUBLIC">PUBLIC (Customer can view)</option>
                      </select>
                    </div>

                    <Button type="submit" variant="primary" size="sm" className="w-full" isLoading={addNoteMutation.isPending}>
                      Log Note Line
                    </Button>
                  </form>
                </div>

                {/* Right 2: Notes listing */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 mb-4">Internal CRM logging lines</h3>
                  <div className="space-y-4">
                    {customer.notes.length === 0 ? (
                      <div className="py-6 text-center text-slate-400 italic">No notes logged yet. Use the form to write instructions.</div>
                    ) : (
                      customer.notes.map((n) => (
                        <div key={n.id} className="p-4 bg-slate-50 dark:bg-zinc-850/50 rounded-xl border border-slate-100 dark:border-zinc-800 flex gap-4 items-start justify-between">
                          <div className="space-y-2">
                            <p className="text-slate-700 dark:text-zinc-300 font-medium italic">&ldquo;{n.content}&rdquo;</p>
                            <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400 font-mono">
                              <span>BY {n.author.toUpperCase()}</span>
                              <span>•</span>
                              <span>{new Date(n.createdAt).toLocaleString()}</span>
                              <span>•</span>
                              <Badge variant={n.type === 'PRIVATE' ? 'neutral' : 'info'}>{n.type}</Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => togglePinNoteMutation.mutate({ customerId: customer.id, noteId: n.id })}
                              className="p-1 text-slate-400 hover:text-amber-500"
                              title={n.isPinned ? 'Unpin directive' : 'Pin directive to top'}
                            >
                              {n.isPinned ? <Pin className="w-4 h-4 text-amber-500 fill-amber-500" /> : <PinOff className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => deleteNoteMutation.mutate({ customerId: customer.id, noteId: n.id })}
                              className="p-1 text-slate-400 hover:text-rose-500"
                              title="Delete note"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVITY TIMELINE PANEL */}
            {activeTab === 'activity' && (
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-6 shadow-xs space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">Account audit stream timeline</h3>
                <div className="relative border-l border-slate-200 dark:border-zinc-800 pl-6 ml-4 space-y-8">
                  {customer.activityLogs.length === 0 ? (
                    <p className="text-slate-400 italic text-center py-6">Timeline is clear.</p>
                  ) : (
                    customer.activityLogs.map((log) => (
                      <div key={log.id} className="relative">
                        {/* Timeline node */}
                        <span className="absolute -left-10 top-0.5 bg-slate-900 dark:bg-brand text-white p-1 rounded-full border border-white dark:border-zinc-950 flex items-center justify-center">
                          <Activity className="w-3 h-3" />
                        </span>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-slate-900 dark:text-zinc-100 text-xs">
                              {log.title}
                            </h4>
                            <Badge variant="neutral" className="text-[9px] py-0 px-1 font-mono">{log.action}</Badge>
                          </div>
                          <p className="text-xs text-slate-500">{log.description}</p>
                          <span className="text-[10px] text-slate-400 block font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
