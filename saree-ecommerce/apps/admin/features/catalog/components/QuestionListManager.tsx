'use client';

import * as React from 'react';
import { HelpCircle, MessageSquare, Trash2, CheckCircle, CornerDownRight } from 'lucide-react';
import { useCatalogStore, ProductQuestion } from '@/store/catalogStore';
import { Button, Badge } from '@/components/enterprise/BaseInputs';
import { useDialog } from '@/hooks/useDialog';
import { toast } from 'sonner';

export function QuestionListManager() {
  const { questions, approveQuestion, answerQuestion, deleteQuestion } = useCatalogStore();
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'PENDING' | 'APPROVED'>('all');

  const answerDialog = useDialog<ProductQuestion>();

  const filteredQuestions = questions.filter(q => {
    if (filterStatus === 'all') return true;
    return q.status === filterStatus;
  });

  const handleAnswerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const answerText = fd.get('answer') as string;
    if (!answerText.trim()) return;

    if (answerDialog.data) {
      answerQuestion(answerDialog.data.id, answerText);
      toast.success('Official answer registered successfully!');
      answerDialog.close();
    }
  };

  return (
    <div className="space-y-4" id="question-list-manager">
      {/* Filters */}
      <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-950/20 border border-slate-200/60 dark:border-zinc-850 p-4 rounded-xl">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <span>Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md py-1 px-1.5 focus:outline-none cursor-pointer text-slate-750 dark:text-zinc-300"
          >
            <option value="all">All Questions</option>
            <option value="PENDING">Pending Answers</option>
            <option value="APPROVED">Answered & Approved</option>
          </select>
        </div>

        <Badge variant="info" className="font-extrabold text-[10px]">
          {filteredQuestions.length} Questions
        </Badge>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-white dark:bg-zinc-900 border border-slate-250/50 dark:border-zinc-850 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row gap-4 justify-between"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-bold text-sm text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                    <HelpCircle className="w-4 h-4 text-brand" />
                    {q.customerName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </span>
                  <Badge
                    variant={q.status === 'APPROVED' ? 'success' : 'neutral'}
                    className="text-[9px]"
                  >
                    {q.status === 'APPROVED' ? 'ANSWERED' : 'PENDING RESPONSE'}
                  </Badge>
                </div>

                {/* Sku Info */}
                <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                  <span>Product SKU:</span>
                  <span className="font-mono bg-slate-50 dark:bg-zinc-950 px-1.5 py-0.5 rounded-md text-slate-700 dark:text-zinc-300 font-bold">
                    {q.productSku}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span>{q.productName}</span>
                </div>

                {/* Question body */}
                <p className="text-xs text-slate-700 dark:text-zinc-300 font-bold leading-relaxed">
                  Q: {q.question}
                </p>

                {/* Answer display */}
                {q.answer && (
                  <div className="bg-slate-50 dark:bg-zinc-950/40 p-3 rounded-lg border border-slate-100 dark:border-zinc-850 flex gap-2.5 items-start mt-2 ml-4">
                    <CornerDownRight className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-slate-850 dark:text-zinc-250">Official Engineering response</p>
                      <p className="text-slate-500 mt-1 dark:text-zinc-400 leading-normal font-medium">&quot;{q.answer}&quot;</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions columns */}
              <div className="flex sm:flex-col gap-2 items-end justify-center pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50 dark:border-zinc-850">
                {q.status === 'PENDING' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-1 h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                    onClick={() => {
                      approveQuestion(q.id);
                      toast.success('Question approved.');
                    }}
                    title="Quick Approve"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                )}
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-bold text-xs"
                    onClick={() => answerDialog.open(q)}
                    icon={MessageSquare}
                  >
                    {q.answer ? 'Edit Answer' : 'Submit Answer'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-1 h-8 w-8 text-red-500 hover:bg-red-50 cursor-pointer border-transparent"
                    onClick={() => {
                      if (confirm('Delete this user question?')) {
                        deleteQuestion(q.id);
                        toast.info('Question removed.');
                      }
                    }}
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-150 rounded-2xl text-slate-400 font-semibold text-xs">
            No questions logged for this SKU branch.
          </div>
        )}
      </div>

      {/* Answer Modal Dialog */}
      {answerDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleAnswerSubmit}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-850 pb-3">
              <h3 className="text-sm font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                Support Team Answering Gate
              </h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                onClick={answerDialog.close}
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 bg-slate-50 dark:bg-zinc-950 p-3 rounded-lg text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Logged Question</span>
              <p className="font-bold text-slate-850 dark:text-zinc-250 mt-1">{answerDialog.data?.customerName}</p>
              <p className="text-slate-500 mt-1 leading-normal font-medium">Q: &quot;{answerDialog.data?.question}&quot;</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Official Verification Response</label>
              <textarea
                name="answer"
                rows={4}
                defaultValue={answerDialog.data?.answer || ''}
                placeholder="The standard industrial package is compliant with sub-zero temperatures up to -55C under static sealing rules."
                required
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-slate-900 dark:text-zinc-100 outline-none focus:border-slate-500"
              />
            </div>

            <div className="flex gap-2.5 justify-end pt-4 border-t border-slate-100 dark:border-zinc-850">
              <Button type="button" variant="outline" onClick={answerDialog.close}>
                Discard
              </Button>
              <Button type="submit" variant="primary">
                Register Verified Answer
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
