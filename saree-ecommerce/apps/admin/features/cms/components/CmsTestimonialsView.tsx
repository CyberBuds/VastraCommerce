'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Button, Input, Label } from '@/components/enterprise/BaseInputs';
import { Star, Plus, Trash2, Quote, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export function CmsTestimonialsView() {
  const { testimonials, addTestimonial, deleteTestimonial } = useCmsStore();
  const [customerName, setCustomerName] = React.useState('');
  const [designation, setDesignation] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [review, setReview] = React.useState('');
  const [rating, setRating] = React.useState(5);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !review) return;

    addTestimonial({
      customerName,
      designation,
      company,
      review,
      rating,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'APPROVED',
      sortOrder: testimonials.length,
    });

    setCustomerName('');
    setDesignation('');
    setCompany('');
    setReview('');
    toast.success('Added customer testimonial!');
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title="Customer Testimonials & Case Study Quotes"
        description="Manage executive endorsements, social proof cards, and G2/Gartner customer ratings."
        breadcrumbs={[{ label: 'Testimonials' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 pb-2 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" /> Add Testimonial
          </h3>

          <div>
            <Label htmlFor="customerName" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Executive Name *</Label>
            <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Sarah Connor" className="mt-1 text-xs font-bold" required />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="designation" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Title / Role</Label>
              <Input id="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="VP of Logistics" className="mt-1 text-xs" />
            </div>
            <div>
              <Label htmlFor="company" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Company</Label>
              <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Global Dynamics" className="mt-1 text-xs" />
            </div>
          </div>

          <div>
            <Label htmlFor="review" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Quote / Endorsement *</Label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              placeholder="Write customer endorsement..."
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none"
              required
            />
          </div>

          <Button type="submit" size="sm" className="w-full font-bold gap-1.5">
            <Plus className="w-4 h-4" /> Save Endorsement
          </Button>
        </form>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testimonials.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      deleteTestimonial(item.id);
                      toast.success('Deleted testimonial');
                    }}
                    className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-700 dark:text-zinc-300 italic leading-relaxed">&quot;{item.review}&quot;</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center gap-3">
                <img src={item.photo} alt={item.customerName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-zinc-100">{item.customerName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">{item.designation} @ {item.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
