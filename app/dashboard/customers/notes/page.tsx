'use client';

import * as React from 'react';
import { useCustomers, useTogglePinCustomerNote, useDeleteCustomerNote } from '@/hooks/useCustomers';
import { Badge, Button } from '@/components/enterprise/BaseInputs';
import { FileText, Pin, PinOff, Trash2, Search, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConsolidatedNotesPage() {
  const router = useRouter();
  const { data: customers = [] } = useCustomers();
  const togglePinMutation = useTogglePinCustomerNote();
  const deleteNoteMutation = useDeleteCustomerNote();
  const [searchQuery, setSearchQuery] = React.useState('');

  const allNotes = React.useMemo(() => {
    return customers.flatMap(c => 
      c.notes.map(n => ({
        ...n,
        customerId: c.id,
        customerName: `${c.firstName} ${c.lastName}`,
        customerCode: c.customerCode
      }))
    ).sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [customers]);

  const filteredNotes = allNotes.filter(n => 
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="crm-notes-dashboard">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <FileText className="w-5.5 h-5.5 text-slate-850" />
            Consolidated CRM Directives & Private Notes
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Review special delivery instructions, accounts override flags, and internal management comments written across all user accounts.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 p-4 rounded-xl shadow-2xs text-xs">
        <h3 className="font-bold uppercase tracking-wider font-mono text-slate-400">directives search</h3>
        
        <div className="relative w-full sm:w-64 text-xs">
          <span className="absolute left-2.5 top-2 text-slate-400"><Search className="w-4 h-4" /></span>
          <input
            type="text"
            placeholder="Search content, author, user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-lg py-1.5 pl-8 pr-3 text-xs outline-hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotes.length === 0 ? (
          <div className="md:col-span-2 bg-white border p-12 text-center text-slate-400 font-semibold italic rounded-xl">
            No crm logging lines found.
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 shadow-2xs relative transition-all ${
                note.isPinned 
                  ? 'bg-amber-50/40 border-amber-250 dark:bg-amber-950/10 dark:border-amber-900/40' 
                  : 'bg-white border-slate-200 dark:bg-zinc-900 dark:border-zinc-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-mono block uppercase">Relates to customer</span>
                    <button 
                      onClick={() => router.push(`/dashboard/customers/view/${note.customerId}`)}
                      className="font-extrabold text-slate-900 dark:text-zinc-50 hover:underline text-xs text-left"
                    >
                      {note.customerName}
                    </button>
                    <span className="text-[9px] text-slate-400 font-mono block">{note.customerCode}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <Badge variant={note.type === 'PRIVATE' ? 'neutral' : 'info'}>{note.type}</Badge>
                    {note.isPinned && <Badge variant="warning" className="font-mono text-[9px] flex items-center gap-1"><Pin className="w-3 h-3 fill-amber-700" /> PINNED</Badge>}
                  </div>
                </div>

                <p className="text-slate-700 dark:text-zinc-300 italic text-xs leading-relaxed font-medium">{"\""}{note.content}{"\""}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-850 flex justify-between items-center text-xs">
                <div className="text-[10px] font-semibold text-slate-400 font-mono uppercase">
                  By {note.author} • {new Date(note.createdAt).toLocaleDateString()}
                </div>

                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => togglePinMutation.mutate({ customerId: note.customerId, noteId: note.id })}
                    title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
                  >
                    {note.isPinned ? <PinOff className="w-4 h-4 text-amber-600" /> : <Pin className="w-4 h-4 text-slate-400" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600"
                    onClick={() => deleteNoteMutation.mutate({ customerId: note.customerId, noteId: note.id })}
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
