'use client';

import * as React from 'react';
import { Customer, SupportTicket } from '@/types/customer';
import { 
  useAddTicketMessage, 
  useUpdateTicketStatus, 
  useAssignTicket 
} from '@/hooks/useCustomers';
import { Badge, Button, Textarea } from '@/components/enterprise/BaseInputs';
import { 
  ArrowLeft, MessageSquare, Send, CheckCircle2, AlertTriangle, UserCheck, 
  ShieldAlert, Clock, User 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

interface TicketDetailViewProps {
  customer: Customer;
  ticket: SupportTicket;
  onBack?: () => void;
}

export function TicketDetailView({ customer, ticket, onBack }: TicketDetailViewProps) {
  const router = useRouter();
  const [replyText, setReplyText] = React.useState('');

  const addMessageMutation = useAddTicketMessage();
  const updateStatusMutation = useUpdateTicketStatus();
  const assignTicketMutation = useAssignTicket();

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addMessageMutation.mutate({
      customerId: customer.id,
      ticketId: ticket.id,
      data: {
        sender: 'STAFF',
        senderName: 'CRM Support Desk',
        content: replyText,
      }
    }, {
      onSuccess: () => setReplyText('')
    });
  };

  const handleStatusChange = (status: SupportTicket['status']) => {
    updateStatusMutation.mutate({
      customerId: customer.id,
      ticketId: ticket.id,
      status
    });
  };

  const handleAssign = (staffName: string) => {
    assignTicketMutation.mutate({
      customerId: customer.id,
      ticketId: ticket.id,
      data: {
        staffId: `staff-${Date.now()}`,
        staffName
      }
    });
  };

  return (
    <div className="space-y-6" id="ticket-detail-view">
      {/* Back Button and Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onBack ? onBack() : router.back()}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-850 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">{ticket.ticketNumber}</span>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
                {ticket.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Customer: <b>{customer.firstName} {customer.lastName}</b> | Opened on {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('RESOLVED')}
              isLoading={updateStatusMutation.isPending}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark Resolved
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('OPEN')}
              isLoading={updateStatusMutation.isPending}
            >
              Reopen Case
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Chat log and Reply box */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chat Bubble Container */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs flex flex-col justify-between h-[500px]">
            <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {/* Initial ticket message */}
              <div className="p-3 bg-slate-50 dark:bg-zinc-850/50 rounded-xl border border-slate-100 dark:border-zinc-800 text-xs">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 font-mono mb-1">
                  <span>SLA INITIATOR</span>
                  <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
                <p className="font-semibold text-slate-800 dark:text-zinc-150">Case category registered: <b>{ticket.category}</b></p>
                <p className="text-slate-600 dark:text-zinc-300 italic mt-1.5 font-medium">&ldquo;{ticket.title}&rdquo; description.</p>
              </div>

              {/* Message log */}
              {ticket.messages.map((msg) => {
                const isStaff = msg.sender === 'STAFF';
                const isSystem = msg.sender === 'SYSTEM';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex gap-3 max-w-[85%] text-xs ${
                      isStaff 
                        ? 'ml-auto flex-row-reverse text-right' 
                        : isSystem 
                        ? 'mx-auto text-center font-semibold text-slate-400 italic' 
                        : 'mr-auto text-left'
                    }`}
                  >
                    {!isSystem && (
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-zinc-800 border flex items-center justify-center font-bold text-slate-600 dark:text-zinc-300 flex-shrink-0">
                        {isStaff ? 'S' : `${customer.firstName[0]}${customer.lastName[0]}`}
                      </div>
                    )}
                    <div className="space-y-1">
                      {!isSystem && (
                        <span className="text-[9px] font-bold text-slate-400 block uppercase font-mono">
                          {msg.senderName} ({msg.sender})
                        </span>
                      )}
                      <div className={`p-3 rounded-2xl ${
                        isSystem 
                          ? 'bg-transparent border-0' 
                          : isStaff 
                          ? 'bg-slate-900 text-white rounded-tr-none text-left' 
                          : 'bg-slate-100 dark:bg-zinc-850 text-slate-800 dark:text-zinc-200 rounded-tl-none'
                      }`}>
                        <p className="leading-relaxed font-medium">{msg.content}</p>
                      </div>
                      <span className="text-[8px] text-slate-400 font-mono block">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Reply form */}
            <form onSubmit={handleReplySubmit} className="mt-4 border-t border-slate-100 dark:border-zinc-850 pt-4 flex gap-3">
              <input
                type="text"
                required
                placeholder="Type your SLA answer response..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm transition-all outline-hidden text-slate-900 dark:text-zinc-100"
              />
              <Button type="submit" variant="primary" size="sm" isLoading={addMessageMutation.isPending}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Case parameters classification */}
        <div className="space-y-6 text-xs font-semibold">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2" />
              SLA Classification
            </h3>

            {/* Department */}
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-zinc-850">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Department</span>
              <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{ticket.department}</span>
            </div>

            {/* Case priority */}
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-zinc-850">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Priority</span>
              <Badge variant={ticket.priority === 'URGENT' || ticket.priority === 'HIGH' ? 'error' : 'neutral'}>
                {ticket.priority}
              </Badge>
            </div>

            {/* Case status */}
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-zinc-850">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Case Status</span>
              <Badge variant={ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'success' : 'warning'}>
                {ticket.status}
              </Badge>
            </div>

            {/* SLA Overrides */}
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Change status</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].filter(s => s !== ticket.status).slice(0, 2).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st as any)}
                    className="p-1.5 border border-slate-200 dark:border-zinc-800 rounded-md text-[10px] font-bold bg-slate-50 dark:bg-zinc-850 hover:bg-slate-100 transition-colors"
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Assignee Card */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-xs space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center">
              <UserCheck className="w-4 h-4 mr-2" /> Assign Support Agent
            </h4>
            
            {ticket.assignedStaffName ? (
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/30 rounded-lg flex gap-2.5 items-center">
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold"><User className="w-4 h-4" /></div>
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 text-xs block">{ticket.assignedStaffName}</span>
                  <span className="text-[9px] text-emerald-600 block font-mono font-bold">CASE HOLDER</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/10 border border-amber-150 dark:border-amber-900/30 rounded-lg text-amber-700">
                Case currently unassigned. Allocate to staff!
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Assign desk representative</label>
              <select
                value={ticket.assignedStaffName || ''}
                onChange={(e) => handleAssign(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-lg py-2 px-3 text-xs outline-hidden text-slate-900 dark:text-zinc-100"
              >
                <option value="">Unassigned</option>
                <option value="Yash Gupta (Sr Associate)">Yash Gupta (Sr Associate)</option>
                <option value="Priya Sharma (Finance SLA)">Priya Sharma (Finance SLA)</option>
                <option value="Rohan Das (Tech Lead)">Rohan Das (Tech Lead)</option>
                <option value="Amit Kumar (B2B Accounts)">Amit Kumar (B2B Accounts)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
