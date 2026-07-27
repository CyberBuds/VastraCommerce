'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Button, Input, Select, Label } from '@/components/enterprise/BaseInputs';
import { HelpCircle, Plus, Trash2, Edit2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

export function CmsFaqsView() {
  const { faqs, addFaq, deleteFaq } = useCmsStore();
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [category, setCategory] = React.useState('General & Licensing');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    addFaq({
      question,
      answer,
      category,
      order: faqs.length + 1,
      isPublished: true,
    });

    setQuestion('');
    setAnswer('');
    toast.success('Added FAQ question!');
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title="Knowledge Base & Frequently Asked Questions"
        description="Manage customer questions, platform support guides, and procurement FAQs."
        breadcrumbs={[{ label: 'FAQs' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 pb-2 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" /> Add FAQ Entry
          </h3>

          <div>
            <Label htmlFor="category" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Category</Label>
            <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 text-xs">
              <option value="General & Licensing">General & Licensing</option>
              <option value="Security & Compliance">Security & Compliance</option>
              <option value="Billing & Support">Billing & Support</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="question" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Question *</Label>
            <Input id="question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. Is SOC2 Type II compliance supported?" className="mt-1 text-xs font-bold" required />
          </div>

          <div>
            <Label htmlFor="answer" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Detailed Answer *</Label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder="Provide a clear answer..."
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none"
              required
            />
          </div>

          <Button type="submit" size="sm" className="w-full font-bold gap-1.5">
            <Plus className="w-4 h-4" /> Save FAQ
          </Button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  {faq.category}
                </span>
                <button
                  onClick={() => {
                    deleteFaq(faq.id);
                    toast.success('Deleted FAQ entry');
                  }}
                  className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">{faq.question}</p>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
