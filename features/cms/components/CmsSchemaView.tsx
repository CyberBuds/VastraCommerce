'use client';

import * as React from 'react';
import { useCmsStore } from '@/store/cmsStore';
import { CmsHeader } from './CmsHeader';
import { Button, Input, Select, Label } from '@/components/enterprise/BaseInputs';
import { Code2, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { SchemaMarkup } from '@/types/cms';

export function CmsSchemaView() {
  const { schemas, addSchema, deleteSchema } = useCmsStore();

  const [name, setName] = React.useState('');
  const [schemaType, setSchemaType] = React.useState<"Organization" | "Product" | "BreadcrumbList" | "FAQPage" | "Article" | "Review" | "LocalBusiness">('Organization');
  const [jsonContent, setJsonContent] = React.useState('{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Enterprise Aero"\n}');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      JSON.parse(jsonContent);
    } catch {
      toast.error('Invalid JSON content! Please format correctly.');
      return;
    }

    addSchema({
      name,
      type: schemaType,
      jsonLd: jsonContent,
      pagePattern: 'GLOBAL',
      status: 'ACTIVE',
    });

    setName('');
    toast.success('Schema markup created!');
  };

  return (
    <div className="space-y-6">
      <CmsHeader
        title="Schema Markup & JSON-LD Structured Data"
        description="Inject rich snippet structured data for Google Search rich cards (Organization, Article, FAQ, BreadcrumbList)."
        breadcrumbs={[{ label: 'Schema' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 border-b border-slate-200 dark:border-zinc-800 pb-2 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" /> New Schema Markup
          </h3>

          <div>
            <Label htmlFor="schemaName" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Schema Label *</Label>
            <Input id="schemaName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Corporate Organization" className="mt-1 text-xs" required />
          </div>

          <div>
            <Label htmlFor="schemaType" className="text-xs font-bold text-slate-700 dark:text-zinc-300">Schema Type</Label>
            <Select id="schemaType" value={schemaType} onChange={(e) => setSchemaType(e.target.value as SchemaMarkup['type'])} className="mt-1 text-xs">
              <option value="Organization">Organization</option>
              <option value="Article">Article</option>
              <option value="FAQPage">FAQPage</option>
              <option value="Product">Product</option>
              <option value="BreadcrumbList">BreadcrumbList</option>
              <option value="Review">Review</option>
              <option value="LocalBusiness">LocalBusiness</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="jsonContent" className="text-xs font-bold text-slate-700 dark:text-zinc-300">JSON-LD Structure *</Label>
            <textarea
              id="jsonContent"
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              rows={6}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none"
              required
            />
          </div>

          <Button type="submit" size="sm" className="w-full font-bold gap-1.5">
            <Plus className="w-4 h-4" /> Inject Schema
          </Button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {schemas.map((s) => (
            <div key={s.id} className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-xs">{s.type}</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">{s.name}</h4>
                </div>
                <button
                  onClick={() => {
                    deleteSchema(s.id);
                    toast.success('Deleted schema markup');
                  }}
                  className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed">
                {s.jsonLd}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
