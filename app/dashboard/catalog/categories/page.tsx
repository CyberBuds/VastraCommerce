'use client';

import * as React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import { CategoryTreeView, CategoryNode } from '@/features/catalog/components/CategoryTreeView';
import { ReviewListManager } from '@/features/catalog/components/ReviewListManager';
import { QuestionListManager } from '@/features/catalog/components/QuestionListManager';
import { useCatalogStore } from '@/store/catalogStore';
import { FolderHeart, Star, HelpCircle, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/enterprise/FeedbackComponents';
import { Badge } from '@/components/enterprise/BaseInputs';
import { api } from '@/services/api';

export default function CategoriesPage() {
  const { setBreadcrumbs, setActiveMenuId } = useLayoutStore();
  const { reviews, questions } = useCatalogStore();
  const [activeTab, setActiveTab] = React.useState<'taxonomy' | 'reviews' | 'questions'>('taxonomy');

  const [categories, setCategories] = React.useState<CategoryNode[]>([]);

  React.useEffect(() => {
    setActiveMenuId('catalog');
    setBreadcrumbs([
      { label: 'Catalog', href: '/dashboard/catalog/categories' },
      { label: 'Taxonomy & Moderation' },
    ]);
  }, [setBreadcrumbs, setActiveMenuId]);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const [categoryResponse, subCategoryResponse] = await Promise.all([
          api.get('/master/categories', { params: { pageSize: 100 } }),
          api.get('/master/sub-categories', { params: { pageSize: 100 } }),
        ]);
        const subCategories = subCategoryResponse.data?.data?.items ?? [];
        setCategories((categoryResponse.data?.data?.items ?? []).map((category: any) => ({
          ...category,
          id: String(category.id),
          children: subCategories
            .filter((subCategory: any) => subCategory.categoryId === category.id)
            .map((subCategory: any) => ({ ...subCategory, id: String(subCategory.id), children: [] })),
        })));
      } catch {
        // The tree stays empty and its database error messages explain failed writes.
      }
    };
    loadCategories();
  }, []);

  const pendingReviewsCount = reviews.filter(r => r.status === 'PENDING').length;
  const pendingQuestionsCount = questions.filter(q => q.status === 'PENDING').length;

  return (
    <div className="space-y-6" id="categories-page-root">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
            Taxonomy & Storefront Moderator
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Calibrate recursive category taxonomy and moderate customer-generated reviews and product questions
          </p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 dark:border-zinc-850 gap-1 text-xs shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('taxonomy')}
          className={`pb-2.5 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'taxonomy'
              ? 'border-brand text-brand dark:border-brand dark:text-brand'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <FolderHeart className="w-4 h-4" /> Category Taxonomy Tree
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`pb-2.5 px-4 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'border-brand text-brand dark:border-brand dark:text-brand'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Star className="w-4 h-4" /> Reviews Moderation
          {pendingReviewsCount > 0 && (
            <span className="bg-[#e6355b] text-white text-[9px] font-black h-4 px-1.5 rounded-full flex items-center justify-center">
              {pendingReviewsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`pb-2.5 px-4 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'questions'
              ? 'border-brand text-brand dark:border-brand dark:text-brand'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Customer Q&A Portal
          {pendingQuestionsCount > 0 && (
            <span className="bg-[#e6355b] text-white text-[9px] font-black h-4 px-1.5 rounded-full flex items-center justify-center">
              {pendingQuestionsCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'taxonomy' && (
        <Card className="p-6">
          <CategoryTreeView
            categories={categories}
            onUpdate={(updated) => setCategories(updated)}
          />
        </Card>
      )}

      {activeTab === 'reviews' && (
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-850 pb-2.5">
            <h2 className="text-sm font-black text-slate-850 dark:text-zinc-250 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-brand" />
              Verified Purchases Review Moderator
            </h2>
          </div>
          <ReviewListManager />
        </Card>
      )}

      {activeTab === 'questions' && (
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-850 pb-2.5">
            <h2 className="text-sm font-black text-slate-850 dark:text-zinc-250 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-brand" />
              Storefront Questions Moderator Panel
            </h2>
          </div>
          <QuestionListManager />
        </Card>
      )}
    </div>
  );
}
