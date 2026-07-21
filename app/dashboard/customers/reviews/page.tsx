'use client';

import * as React from 'react';
import { useCustomers, useUpdateCustomer } from '@/hooks/useCustomers';
import { Badge, Button, Textarea } from '@/components/enterprise/BaseInputs';
import { MessageSquare, ThumbsUp, ThumbsDown, CornerDownRight, Check, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ReviewsAuditPage() {
  const { data: customers = [] } = useCustomers();
  const updateCustMutation = useUpdateCustomer();

  const [activeFilter, setActiveFilter] = React.useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [replyForm, setReplyForm] = React.useState<{ reviewId: string; text: string } | null>(null);

  // Compile reviews
  const allReviews = React.useMemo(() => {
    return customers.flatMap(c => 
      c.reviews.map(r => ({
        ...r,
        customerId: c.id,
        customerName: `${c.firstName} ${c.lastName}`,
        customerCode: c.customerCode
      }))
    ).sort((a, b) => b.rating - a.rating); // Sort by highest ratings first
  }, [customers]);

  const handleStatusOverride = (customerId: string, reviewId: string, status: 'APPROVED' | 'REJECTED') => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    const revised = cust.reviews.map(r => r.id === reviewId ? { ...r, status } : r);
    updateCustMutation.mutate({
      id: customerId,
      data: { reviews: revised }
    }, {
      onSuccess: () => {
        toast.success(`Review ${status.toLowerCase()} successfully.`);
      }
    });
  };

  const handleReplySubmit = (e: React.FormEvent, customerId: string, reviewId: string) => {
    e.preventDefault();
    if (!replyForm?.text.trim()) return;

    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    const revised = cust.reviews.map(r => r.id === reviewId ? { ...r, replyText: replyForm.text, status: 'APPROVED' as const } : r);
    updateCustMutation.mutate({
      id: customerId,
      data: { reviews: revised }
    }, {
      onSuccess: () => {
        setReplyForm(null);
        toast.success('Admin response registered successfully.');
      }
    });
  };

  const handleDeleteReview = (customerId: string, reviewId: string) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    if (confirm('Are you sure you want to permanently delete this product review?')) {
      const revised = cust.reviews.filter(r => r.id !== reviewId);
      updateCustMutation.mutate({
        id: customerId,
        data: { reviews: revised }
      });
    }
  };

  const filteredReviews = allReviews.filter(rev => {
    const matchesFilter = activeFilter === 'ALL' || rev.status === activeFilter;
    const matchesSearch = 
      rev.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.reviewText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6" id="reviews-audit-dashboard">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5.5 h-5.5 text-slate-800" />
            Consolidated Product Reviews Audit Desk
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Audit catalog product ratings, approve pending text submissions, and write responses.
          </p>
        </div>
      </div>

      {/* Filter and search controllers */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 p-4 rounded-xl shadow-2xs">
        <div className="flex gap-1 overflow-x-auto w-full md:w-auto">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((fl) => (
            <button
              key={fl}
              onClick={() => setActiveFilter(fl)}
              className={`px-3 py-1.5 text-xs font-bold font-mono tracking-wider uppercase rounded-md transition-all ${activeFilter === fl ? 'bg-slate-900 text-white dark:bg-brand' : 'bg-slate-50 text-slate-400 dark:bg-zinc-850 hover:text-slate-600'}`}
            >
              {fl}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 text-xs">
          <span className="absolute left-2.5 top-2 text-slate-400"><Search className="w-4 h-4" /></span>
          <input
            type="text"
            placeholder="Search SKU, feedback content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-lg py-1.5 pl-8 pr-3 text-xs outline-hidden"
          />
        </div>
      </div>

      {/* Reviews feed */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white border p-12 text-center text-slate-400 italic rounded-xl">
            No feedback matched the query parameters.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div 
              key={rev.id} 
              className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-xl p-5 shadow-2xs space-y-4 text-xs"
            >
              <div className="flex justify-between items-start flex-wrap gap-2 pb-3 border-b border-slate-50 dark:border-zinc-850">
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-slate-900 dark:text-zinc-150">{rev.productName}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">SKU: {rev.sku} | Customer: <b>{rev.customerName}</b> ({rev.customerCode})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-500 font-mono">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                  <Badge variant={rev.status === 'APPROVED' ? 'success' : rev.status === 'PENDING' ? 'warning' : 'error'}>
                    {rev.status}
                  </Badge>
                </div>
              </div>

              <p className="text-slate-600 dark:text-zinc-300 font-medium italic">{"\""}{rev.reviewText}{"\""}</p>

              {rev.replyText && (
                <div className="p-3 bg-slate-50 dark:bg-zinc-850/50 rounded-lg border border-slate-100 dark:border-zinc-800 flex gap-2">
                  <CornerDownRight className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-[9px] text-slate-400 font-mono uppercase">Official response logged</span>
                    <p className="text-slate-500 italic mt-0.5">{"\""}{rev.replyText}{"\""}</p>
                  </div>
                </div>
              )}

              {/* REPLY FORM OVERLAY PANEL */}
              {replyForm?.reviewId === rev.id && (
                <form 
                  onSubmit={(e) => handleReplySubmit(e, rev.customerId, rev.id)}
                  className="space-y-3.5 bg-slate-50 dark:bg-zinc-850/50 p-4 rounded-lg border border-slate-100 dark:border-zinc-800"
                >
                  <Textarea
                    label="Compose response reply *"
                    required
                    placeholder="Write response message..."
                    value={replyForm.text}
                    onChange={(e) => setReplyForm(p => p ? { ...p, text: e.target.value } : null)}
                  />
                  <div className="flex justify-end gap-2 text-xs">
                    <Button type="button" variant="outline" size="sm" onClick={() => setReplyForm(null)}>Cancel</Button>
                    <Button type="submit" variant="primary" size="sm">
                      <Check className="w-4 h-4 mr-1.5" /> Submit Reply
                    </Button>
                  </div>
                </form>
              )}

              {/* CONTROLS BAR */}
              {!replyForm && (
                <div className="flex justify-between items-center pt-3 border-t border-slate-50 dark:border-zinc-850">
                  <div className="flex items-center gap-2">
                    {rev.status === 'PENDING' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 py-1 px-3 text-emerald-600 border-emerald-200 bg-emerald-50/50"
                          onClick={() => handleStatusOverride(rev.customerId, rev.id, 'APPROVED')}
                        >
                          <ThumbsUp className="w-3.5 h-3.5 mr-1" /> Approve review
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 py-1 px-3 text-rose-600 border-rose-250 bg-rose-50/50"
                          onClick={() => handleStatusOverride(rev.customerId, rev.id, 'REJECTED')}
                        >
                          <ThumbsDown className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                    {!rev.replyText && (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="h-8 py-1 px-3"
                        onClick={() => setReplyForm({ reviewId: rev.id, text: '' })}
                      >
                        Reply to review
                      </Button>
                    )}
                  </div>

                  <button 
                    onClick={() => handleDeleteReview(rev.customerId, rev.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Purge review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
