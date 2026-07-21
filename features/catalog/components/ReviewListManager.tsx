'use client';

import * as React from 'react';
import { Star, MessageSquare, Trash2, CheckCircle, XCircle, CornerDownRight } from 'lucide-react';
import { useCatalogStore, ProductReview } from '@/store/catalogStore';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { useDialog } from '@/hooks/useDialog';
import { toast } from 'sonner';

export function ReviewListManager() {
  const { reviews, approveReview, rejectReview, deleteReview, replyToReview } = useCatalogStore();
  const [filterRating, setFilterRating] = React.useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all');

  const replyDialog = useDialog<ProductReview>();

  const filteredReviews = reviews.filter(rev => {
    const matchRating = filterRating === 'all' || rev.rating === filterRating;
    const matchStatus = filterStatus === 'all' || rev.status === filterStatus;
    return matchRating && matchStatus;
  });

  const handleReplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const replyText = fd.get('reply') as string;
    if (!replyText.trim()) return;

    if (replyDialog.data) {
      replyToReview(replyDialog.data.id, replyText);
      toast.success('Reply submitted and review approved.');
      replyDialog.close();
    }
  };

  return (
    <div className="space-y-4" id="review-list-manager">
      {/* Filtering Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-zinc-950/20 border border-slate-200/60 dark:border-zinc-850 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span>Filter Rating:</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md py-1 px-1.5 focus:outline-none cursor-pointer text-slate-700 dark:text-zinc-300"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span>Filter Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md py-1 px-1.5 focus:outline-none cursor-pointer text-slate-700 dark:text-zinc-300"
            >
              <option value="all">All States</option>
              <option value="PENDING">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <Badge variant="purple" className="font-extrabold text-[10px]">
          {filteredReviews.length} Catalog Reviews
        </Badge>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-zinc-900 border border-slate-250/50 dark:border-zinc-850 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row gap-4 justify-between"
            >
              <div className="space-y-2 flex-1">
                {/* Header line */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-bold text-sm text-slate-800 dark:text-zinc-200">{rev.reviewer}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                  <Badge
                    variant={
                      rev.status === 'APPROVED' ? 'success' : rev.status === 'REJECTED' ? 'error' : 'neutral'
                    }
                    className="text-[9px]"
                  >
                    {rev.status}
                  </Badge>
                </div>

                {/* Sku line */}
                <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                  <span>Product SKU:</span>
                  <span className="font-mono bg-slate-50 dark:bg-zinc-950 px-1.5 py-0.5 rounded-md text-slate-700 dark:text-zinc-300">
                    {rev.productSku}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span>{rev.productName}</span>
                </div>

                {/* Comment body */}
                <p className="text-xs text-slate-650 dark:text-zinc-300 leading-relaxed font-medium">&quot;{rev.comment}&quot;</p>

                {/* Reply display */}
                {rev.reply && (
                  <div className="bg-slate-50 dark:bg-zinc-950/40 p-3 rounded-lg border border-slate-100 dark:border-zinc-850 flex gap-2.5 items-start mt-2 ml-4">
                    <CornerDownRight className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-slate-800 dark:text-zinc-250">Aero Administration Team</p>
                      <p className="text-slate-500 mt-1 dark:text-zinc-400 leading-normal">&quot;{rev.reply}&quot;</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions columns */}
              <div className="flex sm:flex-col gap-2 items-end justify-center pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50 dark:border-zinc-850">
                {rev.status === 'PENDING' && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-1 h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                      onClick={() => {
                        approveReview(rev.id);
                        toast.success('Review approved successfully!');
                      }}
                      title="Approve Review"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-1 h-8 w-8 text-red-500 hover:bg-red-50"
                      onClick={() => {
                        rejectReview(rev.id);
                        toast.info('Review rejected.');
                      }}
                      title="Reject Review"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-bold text-xs"
                    onClick={() => replyDialog.open(rev)}
                    icon={MessageSquare}
                  >
                    {rev.reply ? 'Edit Reply' : 'Reply'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-1 h-8 w-8 text-red-500 hover:bg-red-50 cursor-pointer border-transparent"
                    onClick={() => {
                      if (confirm('Delete this product review from registry?')) {
                        deleteReview(rev.id);
                        toast.info('Review deleted.');
                      }
                    }}
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-150 rounded-2xl text-slate-400 font-semibold text-xs">
            No reviews matching selected query tags.
          </div>
        )}
      </div>

      {/* Reply Dialog */}
      {replyDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleReplySubmit}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-850 pb-3">
              <h3 className="text-sm font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                Review Response Portal
              </h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                onClick={replyDialog.close}
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 bg-slate-50 dark:bg-zinc-950 p-3 rounded-lg text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Original Review</span>
              <p className="font-bold text-slate-800 dark:text-zinc-250 mt-1">{replyDialog.data?.reviewer}</p>
              <p className="text-slate-500 mt-1 leading-normal">&quot;{replyDialog.data?.comment}&quot;</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Official Reply Content</label>
              <textarea
                name="reply"
                rows={4}
                defaultValue={replyDialog.data?.reply || ''}
                placeholder="We deeply value your support! Our engineering teams have calibrated the thread milling guides to 0.01mm tolerances to resolve this."
                required
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-slate-900 dark:text-zinc-100 outline-none focus:border-slate-500"
              />
            </div>

            <div className="flex gap-2.5 justify-end pt-4 border-t border-slate-100 dark:border-zinc-850">
              <Button type="button" variant="outline" onClick={replyDialog.close}>
                Discard
              </Button>
              <Button type="submit" variant="primary">
                Submit Response
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
