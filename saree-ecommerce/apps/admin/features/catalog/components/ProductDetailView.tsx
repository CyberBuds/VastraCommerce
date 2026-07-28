'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useCatalogStore } from '@/store/catalogStore';
import {
  Package,
  DollarSign,
  Tag,
  Globe,
  Settings2,
  ShieldCheck,
  Star,
  ArrowLeft,
  Truck,
  Copy,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ProductDetailViewProps {
  id: string;
}

export function ProductDetailView({ id }: ProductDetailViewProps) {
  const { reviews, questions, auditLogs } = useCatalogStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'questions' | 'audit'>('overview');

  const { data: product, isLoading } = useQuery({
    queryKey: ['catalogProduct', id],
    queryFn: async () => {
      try {
        const res = await api.get(`/api/catalog/products/${id}`);
        return res.data?.data;
      } catch (err) {
        // Fallback default mock
        return {
          id: id || 'prod-101',
          name: 'AeroFlow Heavy Industrial Turbine X1',
          sku: 'SKU-AERO-10000',
          category: 'Turbines & Gas Propulsion',
          brand: 'AeroSpace Inc',
          price: 1499.99,
          costPrice: 850.0,
          msrp: 1800.0,
          stock: 120,
          status: 'ACTIVE',
          description:
            'Premium custom-balanced heavy industrial turbine assembly engineered for high temperature gas loops and aerodynamic efficiency.',
          weight: '12.5 kg',
          dimensions: '45 x 45 x 60 cm',
          seoTitle: 'AeroFlow Turbine X1 | High Performance Aerospace Parts',
          seoDescription: 'Aerospace structural turbine crafted for maximum thermal endurance.',
        };
      }
    },
  });

  const productReviews = reviews.filter((r) => r.productSku === product?.sku || r.productName === product?.name);
  const productQuestions = questions.filter((q) => q.productSku === product?.sku || q.productName === product?.name);
  const productAudits = auditLogs.filter((a) => a.sku === product?.sku || a.productName === product?.name);

  if (isLoading) {
    return <div className="py-12 text-center text-xs font-bold text-slate-400">Loading SKU details...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/catalog/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Product Registry
        </Link>
        <span className="font-mono text-xs font-black text-slate-500">{product?.sku}</span>
      </div>

      {/* Main Info Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
              {product?.status || 'ACTIVE'}
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{product?.category}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
            {product?.name}
          </h1>
          <p className="text-xs text-slate-500">{product?.description}</p>
        </div>

        <div className="text-right border-t md:border-t-0 md:border-l border-slate-100 dark:border-zinc-800 pt-4 md:pt-0 md:pl-6 shrink-0">
          <span className="text-xs text-slate-400 font-bold uppercase">Commercial Selling Price</span>
          <div className="text-3xl font-mono font-black text-slate-900 dark:text-zinc-100">
            ${product?.price ? Number(product.price).toFixed(2) : '1,499.99'}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">In Stock: {product?.stock || 120} units</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold text-slate-500 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 border-b-2 transition ${
            activeTab === 'overview' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent'
          }`}
        >
          Product Specs & Logistics
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-2.5 border-b-2 transition ${
            activeTab === 'reviews' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent'
          }`}
        >
          Customer Reviews ({productReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-2.5 border-b-2 transition ${
            activeTab === 'questions' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent'
          }`}
        >
          Product Q&A ({productQuestions.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-2.5 border-b-2 transition ${
            activeTab === 'audit' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent'
          }`}
        >
          Audit History ({productAudits.length})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" /> Commercial Pricing Structure
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl dark:bg-zinc-950">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Manufacturing Cost (COGS)</span>
                <p className="font-mono font-bold text-slate-900 dark:text-zinc-100">${product?.costPrice || 850.0}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl dark:bg-zinc-950">
                <span className="text-[10px] text-slate-400 font-bold uppercase">MSRP List Price</span>
                <p className="font-mono font-bold text-slate-900 dark:text-zinc-100">${product?.msrp || 1800.0}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <Truck className="h-4 w-4 text-indigo-500" /> Freight & Physical Footprint
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl dark:bg-zinc-950">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Unit Weight</span>
                <p className="font-bold text-slate-900 dark:text-zinc-100">{product?.weight || '12.5 kg'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl dark:bg-zinc-950">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Dimensions</span>
                <p className="font-bold text-slate-900 dark:text-zinc-100">{product?.dimensions || '45x45x60 cm'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {productReviews.length > 0 ? (
            productReviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 text-xs space-y-2 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-900 dark:text-zinc-100">{r.reviewer}</span>
                  <div className="flex text-amber-400">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-zinc-300">{r.comment}</p>
                {r.reply && (
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
                    <strong>Seller Reply:</strong> {r.reply}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">No customer reviews submitted yet.</div>
          )}
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-3">
          {productQuestions.length > 0 ? (
            productQuestions.map((q) => (
              <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-4 text-xs space-y-2 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="font-bold text-slate-900 dark:text-zinc-100">{q.customerName} asked:</div>
                <p className="text-slate-700 dark:text-zinc-300">{q.question}</p>
                {q.answer ? (
                  <div className="p-2 bg-emerald-50 text-emerald-900 rounded-lg dark:bg-emerald-950/40 dark:text-emerald-300">
                    <strong>Official Answer:</strong> {q.answer}
                  </div>
                ) : (
                  <span className="text-[10px] text-amber-600 font-bold">Awaiting Answer</span>
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">No public questions asked for this product.</div>
          )}
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-2">
          {productAudits.length > 0 ? (
            productAudits.map((a) => (
              <div key={a.id} className="p-3 bg-slate-50 rounded-xl border text-xs space-y-1 dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900 dark:text-zinc-100">{a.action}</span>
                  <span className="text-slate-400">{a.timestamp}</span>
                </div>
                <p className="text-slate-500">By {a.updatedBy}: Changed from "{a.changedFrom}" to "{a.changedTo}"</p>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">No audit log records found for this SKU.</div>
          )}
        </div>
      )}
    </div>
  );
}
