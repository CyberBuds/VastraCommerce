'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Package,
  DollarSign,
  Truck,
  Tags,
  Image as ImageIcon,
  Globe,
  Settings2,
  FileCheck2,
  GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input, Badge } from '@/components/enterprise/BaseInputs';
import { Select } from '@/components/enterprise/InteractiveComponents';
import { MediaGalleryManager } from '../components/MediaGalleryManager';
import { SEOPreviewCard } from '../components/SEOPreviewCard';
import { useCatalogStore } from '@/store/catalogStore';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface ProductWizardProps {
  productId?: string; // If editing an existing product
  onComplete: () => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, label: 'Identity', desc: 'SKU & Names', icon: Package },
  { id: 2, label: 'Taxonomy', desc: 'Brands & Tags', icon: Tags },
  { id: 3, label: 'Pricing', desc: 'Costs & Taxes', icon: DollarSign },
  { id: 4, label: 'Inventory', desc: 'Warehousing', icon: Settings2 },
  { id: 5, label: 'Logistics', desc: 'Shipping Specs', icon: Truck },
  { id: 6, label: 'Variants', desc: 'SKU Attributes', icon: GitBranch },
  { id: 7, label: 'Media', desc: 'SKU Galleries', icon: ImageIcon },
  { id: 8, label: 'SEO', desc: 'Social Snippets', icon: Globe },
  { id: 9, label: 'Cross-Sell', desc: 'Related Linkages', icon: Sparkles },
  { id: 10, label: 'Validate', desc: 'Compliance Review', icon: FileCheck2 },
];

export function ProductWizard({ productId, onComplete, onCancel }: ProductWizardProps) {
  const [activeStep, setActiveStep] = React.useState(1);
  const { brands, tags, attributes, addAuditLog } = useCatalogStore();

  // Wizard State
  const [form, setForm] = React.useState({
    name: '',
    sku: '',
    slug: '',
    shortDesc: '',
    description: '',
    categoryId: '',
    brandId: 'b-1',
    productTags: [] as string[],
    costPrice: '',
    sellingPrice: '',
    msrp: '',
    taxRate: '18',
    initialStock: '100',
    minStock: '10',
    warehouseBin: 'A-12-B',
    backorderLimit: '0',
    weight: '1.2',
    width: '10',
    height: '10',
    depth: '10',
    fragile: false,
    shippingClass: 'STANDARD',
    selectedAttrIds: [] as string[],
    media: [] as any[],
    seoTitle: '',
    seoDescription: '',
    seoSlug: '',
    seoKeywords: '',
    seoCanonical: '',
    seoOgImage: '',
    relatedSkus: [] as string[],
    bundleDiscount: '10',
  });

  const [loading, setLoading] = React.useState(false);
  const [categoryOptions, setCategoryOptions] = React.useState<Array<{ value: string; label: string }>>([]);

  React.useEffect(() => {
    api.get('/master/categories', { params: { pageSize: 100 } })
      .then((response) => setCategoryOptions((response.data?.data?.items ?? []).map((category: any) => ({
        value: String(category.id),
        label: category.name,
      }))))
      .catch(() => setCategoryOptions([]));
  }, []);

  // Fetch product data if in edit mode
  React.useEffect(() => {
    if (!productId) return;

    let isSubscribed = true;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        if (isSubscribed && res.data?.success && res.data.data) {
          const prod = res.data.data;
          setForm((prev) => ({
            ...prev,
            name: prod.productName || '',
            sku: prod.sku || '',
            sellingPrice: String(prod.sellingPrice || ''),
            categoryId: String(prod.categoryId || ''),
          }));
        }
      } catch (err) {
        if (isSubscribed) {
          toast.error('Failed to resolve SKU parameters.');
        }
      }
    };

    fetchProduct();

    return () => {
      isSubscribed = false;
    };
  }, [productId]);

  const handleFieldChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Basic validation before changing steps
    if (activeStep === 1 && (!form.name || !form.sku)) {
      toast.error('Required parameters missing', { description: 'Identify product Name and SKU to proceed.' });
      return;
    }
    if (activeStep === 3 && (!form.costPrice || !form.sellingPrice)) {
      toast.error('Pricing models unconfigured', { description: 'Cost price and selling price are mandatory fields.' });
      return;
    }

    if (activeStep < 10) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  // Automated SKU validation
  const getValidationReport = () => {
    const reports = [];
    let isCompliant = true;

    if (!form.name) {
      reports.push({ item: 'Product Name', status: 'error', desc: 'Missing core descriptive label.' });
      isCompliant = false;
    } else {
      reports.push({ item: 'Product Name', status: 'ok', desc: 'Configured.' });
    }

    if (!form.sku.startsWith('SKU-')) {
      reports.push({ item: 'SKU Barcode', status: 'error', desc: 'SKU must begin with standard enterprise format (e.g. SKU-AERO-).' });
      isCompliant = false;
    } else {
      reports.push({ item: 'SKU Barcode', status: 'ok', desc: 'Compliant code prefix.' });
    }

    if (Number(form.sellingPrice) <= Number(form.costPrice)) {
      reports.push({ item: 'Gross Margin', status: 'warning', desc: 'Selling price is equal to or lower than initial cost. Negative margin danger.' });
    } else {
      reports.push({ item: 'Gross Margin', status: 'ok', desc: 'Positive net profit margin confirmed.' });
    }

    if (form.media.length === 0) {
      reports.push({ item: 'Media Attachments', status: 'warning', desc: 'Storefront displays will be blank without high-res coverage assets.' });
    } else {
      reports.push({ item: 'Media Attachments', status: 'ok', desc: `${form.media.length} media assets bound.` });
    }

    if (form.seoTitle.length < 30) {
      reports.push({ item: 'Search Index SEO', status: 'warning', desc: 'Meta title is too brief for Google webcrawler optimization.' });
    } else {
      reports.push({ item: 'Search Index SEO', status: 'ok', desc: 'Meta parameters optimized.' });
    }

    return { isCompliant, reports };
  };

  const { isCompliant, reports: complianceList } = getValidationReport();

  // Save/Submit Product Action
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        productCode: form.sku,
        productName: form.name,
        sku: form.sku,
        slug: form.slug || undefined,
        shortDescription: form.shortDesc || undefined,
        description: form.description || undefined,
        categoryId: /^\d+$/.test(form.categoryId) ? Number(form.categoryId) : undefined,
        brandId: form.brandId && !form.brandId.startsWith('b-') ? Number(form.brandId) : undefined,
        costPrice: parseFloat(form.costPrice) || undefined,
        sellingPrice: parseFloat(form.sellingPrice) || undefined,
        mrp: parseFloat(form.msrp) || undefined,
        images: form.media.filter((item) => item.type === 'image').map((item, index) => ({
          imageUrl: item.url,
          altText: item.altText,
          displayOrder: index,
          isPrimary: index === 0,
        })),
        status: parseInt(form.initialStock) > 0 ? 'ACTIVE' : 'DRAFT',
      };

      if (productId) {
        // Edit
        await api.put(`/products/${productId}`, payload);
        addAuditLog({
          productName: payload.name,
          sku: payload.sku,
          action: 'Product Edited',
          changedFrom: 'Previous state',
          changedTo: 'Updated properties',
          updatedBy: 'Yash Gupta',
        });
        toast.success('Product portfolio synchronized successfully!');
      } else {
        // Create
        await api.post('/products', payload);
        addAuditLog({
          productName: payload.name,
          sku: payload.sku,
          action: 'Product Created',
          changedFrom: 'None',
          changedTo: 'Initial SKU Publish',
          updatedBy: 'Yash Gupta',
        });
        toast.success('New product catalog SKU registered!');
      }
      onComplete();
    } catch (e) {
      toast.error('Critical database sync rejection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh]" id="product-wizard-root">
      {/* Top Banner: Navigation Trail */}
      <div className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-850 p-4 px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-brand" />
          <div>
            <h1 className="text-sm font-black text-slate-800 dark:text-zinc-100 uppercase tracking-wider">
              {productId ? `Modify SKU Code: ${form.sku}` : 'Register Enterprise Product SKU'}
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              10-Step Interactive Wizard Taxonomy Registry
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="font-bold text-xs" onClick={onCancel}>
            Cancel Entry
          </Button>
          <Button variant="outline" size="sm" className="font-bold text-xs" onClick={() => setActiveStep(10)}>
            Jump to Review
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Steps Guide, Right Active Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Steps Map */}
        <div className="w-64 border-r border-slate-100 dark:border-zinc-850 bg-slate-50/50 dark:bg-zinc-950/20 overflow-y-auto hidden md:block p-4 space-y-1">
          {STEPS.map((st) => {
            const IconComp = st.icon;
            const isCompleted = st.id < activeStep;
            const isActive = st.id === activeStep;

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStep(st.id)}
                className={cn(
                  "w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all border cursor-pointer",
                  isActive
                    ? "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-xs"
                    : "border-transparent text-slate-400 dark:text-zinc-500 hover:bg-slate-100/50 dark:hover:bg-zinc-900/50"
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs border transition-colors",
                    isActive
                      ? "bg-slate-900 text-white border-transparent dark:bg-brand dark:text-white"
                      : isCompleted
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400"
                      : "bg-slate-100 border-slate-200 text-slate-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                  )}
                >
                  {isCompleted ? '✓' : st.id}
                </div>
                <div>
                  <p className={cn("text-xs font-bold leading-none", isActive ? "text-slate-800 dark:text-zinc-250" : "text-slate-500 dark:text-zinc-400")}>
                    {st.label}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5 truncate max-w-[130px]">
                    {st.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active View Panel */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white dark:bg-zinc-900/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.15 }}
              className="space-y-6 h-full"
            >
              {/* Step 1: Basic Identity */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-black text-slate-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-5 h-5 text-brand" /> Product Core Identity
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Define core naming taxonomy and SKU barcode prefixes.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Product Commercial Label"
                      value={form.name}
                      onChange={(e) => {
                        handleFieldChange('name', e.target.value);
                        // Auto SEO title & slug
                        handleFieldChange('seoTitle', e.target.value + ' | Aero Parts');
                      }}
                      required
                      placeholder="e.g. AeroFlow Turbine X1"
                      id="wiz-prod-name"
                    />
                    <Input
                      label="Corporate SKU Code"
                      value={form.sku}
                      onChange={(e) => handleFieldChange('sku', e.target.value)}
                      required
                      placeholder="e.g. SKU-AERO-10000"
                      id="wiz-prod-sku"
                    />
                  </div>

                  <Input
                    label="Commercial Product Slug"
                    value={form.slug}
                    onChange={(e) => handleFieldChange('slug', e.target.value)}
                    placeholder="e.g. aeroflow-turbine-x1"
                    id="wiz-prod-slug"
                  />

                  <Input
                    label="Catalog Highlight Tagline"
                    value={form.shortDesc}
                    onChange={(e) => handleFieldChange('shortDesc', e.target.value)}
                    placeholder="Premium custom-balanced heavy industrial turbine assembly built for extreme gas loops."
                    id="wiz-prod-short-desc"
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Technical Datasheet Specifications</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      placeholder="Input complete metallurgical, fluid dynamic, and certification standards..."
                      rows={5}
                      className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-zinc-100 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Category & Brand */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-black text-slate-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Tags className="w-5 h-5 text-brand" /> Taxonomic Categorization
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Map SKU nodes to taxonomic categories, brands, and search tags.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Taxonomic Category Tree"
                      value={form.categoryId}
                      onChange={(e) => handleFieldChange('categoryId', e.target.value)}
                      options={categoryOptions}
                      id="wiz-prod-cat"
                    />

                    <Select
                      label="Corporate Brand Registry"
                      value={form.brandId}
                      onChange={(e) => handleFieldChange('brandId', e.target.value)}
                      options={brands.map((b) => ({ value: b.id, label: b.name }))}
                      id="wiz-prod-brand"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Keywords Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tg) => {
                        const isSelected = form.productTags.includes(tg.name);
                        return (
                          <button
                            key={tg.id}
                            type="button"
                            onClick={() => {
                              const updated = isSelected
                                ? form.productTags.filter((t) => t !== tg.name)
                                : [...form.productTags, tg.name];
                              handleFieldChange('productTags', updated);
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer",
                              isSelected
                                ? "bg-slate-900 text-white dark:bg-brand dark:text-white border-transparent"
                                : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                            )}
                          >
                            {tg.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Pricing */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-black text-slate-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-5 h-5 text-brand" /> Pricing Matrix
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Establish manufacturing costs, commercial sale values, and tax matrices.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Cost Price (COGS)"
                      value={form.costPrice}
                      onChange={(e) => handleFieldChange('costPrice', e.target.value)}
                      required
                      placeholder="850.00"
                      id="wiz-prod-cost"
                    />
                    <Input
                      label="Selling Price"
                      value={form.sellingPrice}
                      onChange={(e) => handleFieldChange('sellingPrice', e.target.value)}
                      required
                      placeholder="1499.00"
                      id="wiz-prod-price"
                    />
                    <Input
                      label="MSRP (Comparison price)"
                      value={form.msrp}
                      onChange={(e) => handleFieldChange('msrp', e.target.value)}
                      placeholder="1800.00"
                      id="wiz-prod-msrp"
                    />
                  </div>

                  <Select
                    label="VAT & Sales Tax Bracket"
                    value={form.taxRate}
                    onChange={(e) => handleFieldChange('taxRate', e.target.value)}
                    options={[
                      { value: '0', label: '0% Exempt (Medical/Diplomatic)' },
                      { value: '5', label: '5% Standard Food/Chemical Services' },
                      { value: '18', label: '18% Standard Heavy Machinery Bracket' },
                      { value: '25', label: '25% Luxury & Carbon Overcharge' },
                    ]}
                    id="wiz-prod-tax"
                  />
                </div>
              )}

              {/* Step 4: Inventory & Warehousing */}
              {activeStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-black text-slate-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Settings2 className="w-5 h-5 text-brand" /> Inventory Controls
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Control safety stock margins, barcode bins, and backorder capacities.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Initial Stock Quantity"
                      value={form.initialStock}
                      onChange={(e) => handleFieldChange('initialStock', e.target.value)}
                      required
                      id="wiz-prod-stock"
                    />
                    <Input
                      label="Safety Buffer Stock Level"
                      value={form.minStock}
                      onChange={(e) => handleFieldChange('minStock', e.target.value)}
                      id="wiz-prod-min-stock"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Warehouse Bin Identifier (Coded)"
                      value={form.warehouseBin}
                      onChange={(e) => handleFieldChange('warehouseBin', e.target.value)}
                      placeholder="C-4-F"
                      id="wiz-prod-bin"
                    />
                    <Input
                      label="Maximum Backorder Allowances"
                      value={form.backorderLimit}
                      onChange={(e) => handleFieldChange('backorderLimit', e.target.value)}
                      id="wiz-prod-backorder"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Logistics & Shipping */}
              {activeStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-black text-slate-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Truck className="w-5 h-5 text-brand" /> Logistics Parameters
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Record weight matrices, physical dimensional footprints, and freight hazard flags.</p>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <Input
                      label="Weight (kg)"
                      value={form.weight}
                      onChange={(e) => handleFieldChange('weight', e.target.value)}
                      id="wiz-prod-weight"
                    />
                    <Input
                      label="Width (cm)"
                      value={form.width}
                      onChange={(e) => handleFieldChange('width', e.target.value)}
                      id="wiz-prod-width"
                    />
                    <Input
                      label="Height (cm)"
                      value={form.height}
                      onChange={(e) => handleFieldChange('height', e.target.value)}
                      id="wiz-prod-height"
                    />
                    <Input
                      label="Depth (cm)"
                      value={form.depth}
                      onChange={(e) => handleFieldChange('depth', e.target.value)}
                      id="wiz-prod-depth"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-850">
                    <input
                      type="checkbox"
                      checked={form.fragile}
                      onChange={(e) => handleFieldChange('fragile', e.target.checked)}
                      className="w-4 h-4 text-brand bg-transparent"
                      id="wiz-prod-fragile"
                    />
                    <label htmlFor="wiz-prod-fragile" className="text-xs font-bold text-slate-700 dark:text-zinc-300 cursor-pointer">
                      Fragile / High-Tolerance Calibration Asset (Requires custom shipping cases)
                    </label>
                  </div>
                </div>
              )}

              {/* Step 6: Variants Config */}
              {activeStep === 6 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-black text-slate-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <GitBranch className="w-5 h-5 text-brand" /> Multi-SKU Variants Setup
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Select attributes to generate multiple child options under this SKU family.</p>
                  </div>

                  <div className="space-y-3">
                    {attributes.map((attr) => {
                      const isChecked = form.selectedAttrIds.includes(attr.id);
                      return (
                        <div
                          key={attr.id}
                          className="p-4 border border-slate-200 dark:border-zinc-850 bg-slate-50/40 dark:bg-zinc-950/20 rounded-xl space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                const updated = isChecked
                                  ? form.selectedAttrIds.filter((id) => id !== attr.id)
                                  : [...form.selectedAttrIds, attr.id];
                                handleFieldChange('selectedAttrIds', updated);
                              }}
                              className="w-4 h-4 text-brand"
                              id={`attr-check-${attr.id}`}
                            />
                            <label htmlFor={`attr-check-${attr.id}`} className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider cursor-pointer">
                              {attr.name} ({attr.type.toUpperCase()})
                            </label>
                          </div>

                          {isChecked && (
                            <div className="pl-6 flex flex-wrap gap-2">
                              {attr.values.map((v) => (
                                <span
                                  key={v.id}
                                  className="inline-flex items-center gap-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md py-1 px-2.5 text-[11px] font-bold text-slate-700 dark:text-zinc-300"
                                >
                                  {attr.type === 'color' && (
                                    <span
                                      className="w-3 h-3 rounded-full border border-slate-200 inline-block"
                                      style={{ backgroundColor: v.extra }}
                                    />
                                  )}
                                  <span>{v.label}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 7: Media Gallery */}
              {activeStep === 7 && (
                <div className="space-y-4 h-full">
                  <div>
                    <h2 className="text-base font-black text-slate-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-5 h-5 text-brand" /> Visual Media Registry
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Bind imagery, videos, and CAD technical specification drafts.</p>
                  </div>

                  <MediaGalleryManager
                    mediaList={form.media}
                    onChange={(list) => handleFieldChange('media', list)}
                  />
                </div>
              )}

              {/* Step 8: SEO Meta */}
              {activeStep === 8 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-black text-slate-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-5 h-5 text-brand" /> SEO Meta Tuning
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Design search engine result snippets and social graphs parameters.</p>
                  </div>

                  <SEOPreviewCard
                    title={form.seoTitle}
                    description={form.seoDescription}
                    slug={form.seoSlug || form.slug}
                    keywords={form.seoKeywords}
                    canonicalUrl={form.seoCanonical}
                    ogImage={form.seoOgImage}
                    onChange={(field, val) => handleFieldChange(`seo${field.charAt(0).toUpperCase()}${field.slice(1)}`, val)}
                  />
                </div>
              )}

              {/* Step 9: Cross-Sell & Upsell */}
              {activeStep === 9 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-black text-slate-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-5 h-5 text-brand" /> Related Products linkages
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Setup related products to display on storefronts, and discount bundling policies.</p>
                  </div>

                  <div className="space-y-4 max-w-xl">
                    <Input
                      label="Related SKUs (comma-separated codes)"
                      value={form.relatedSkus.join(', ')}
                      onChange={(e) => {
                        const vals = e.target.value.split(',').map((s) => s.trim());
                        handleFieldChange('relatedSkus', vals);
                      }}
                      placeholder="SKU-AERO-10001, SKU-AERO-10005"
                      id="wiz-prod-related"
                    />

                    <Input
                      label="Discount Bundled Package Rebate (%)"
                      value={form.bundleDiscount}
                      onChange={(e) => handleFieldChange('bundleDiscount', e.target.value)}
                      placeholder="15"
                      id="wiz-prod-bundle"
                    />
                  </div>
                </div>
              )}

              {/* Step 10: Validation Audit */}
              {activeStep === 10 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-black text-slate-850 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <FileCheck2 className="w-5 h-5 text-brand" /> Corporate Registry Validation
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Verify that all metadata is in perfect compliance before publishing.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Compliance list */}
                    <div className="lg:col-span-8 bg-slate-50 dark:bg-zinc-950/20 border border-slate-200/60 dark:border-zinc-850 rounded-2xl p-5 space-y-3">
                      <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                        Compliance Checklist
                      </h3>

                      <div className="space-y-2">
                        {complianceList.map((item, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "p-3 rounded-xl border flex items-start gap-2.5 text-xs",
                              item.status === 'error'
                                ? "bg-red-50/20 border-red-100 text-red-750 dark:bg-red-950/10 dark:border-red-950/30 dark:text-red-400"
                                : item.status === 'warning'
                                ? "bg-amber-50/20 border-amber-100 text-amber-750 dark:bg-amber-950/10 dark:border-amber-950/30 dark:text-amber-400"
                                : "bg-emerald-50/25 border-emerald-100 text-emerald-750 dark:bg-emerald-950/10 dark:border-emerald-950/30 dark:text-emerald-400"
                            )}
                          >
                            {item.status === 'error' && <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-500" />}
                            {item.status === 'warning' && <AlertCircle className="w-4.5 h-4.5 shrink-0 text-amber-500" />}
                            {item.status === 'ok' && <CheckCircle className="w-4.5 h-4.5 shrink-0 text-emerald-500" />}
                            <div>
                              <p className="font-extrabold uppercase text-[10px] tracking-wider">{item.item}</p>
                              <p className="mt-0.5 font-medium opacity-85 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary Publish */}
                    <div className="lg:col-span-4 bg-slate-50 dark:bg-zinc-950/30 border border-slate-200/60 dark:border-zinc-850 rounded-2xl p-5 flex flex-col justify-between">
                      <div className="space-y-3">
                        <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                          Ready to Publish?
                        </h3>
                        <p className="text-xs text-slate-500 leading-normal">
                          All products undergo a system synchronization protocol. Once published, the SKU is immediately dispatched to global inventory indexes.
                        </p>

                        <div className="space-y-1 pt-2">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Registry Status</p>
                          <div className="flex items-center gap-1.5">
                            <span className={cn("w-2 h-2 rounded-full", isCompliant ? "bg-emerald-500" : "bg-red-500")} />
                            <span className="text-xs font-extrabold text-slate-700 dark:text-zinc-300">
                              {isCompliant ? 'Fully Compliant' : 'Issues Block publication'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6">
                        <Button
                          variant="primary"
                          className="w-full font-bold text-xs py-2.5"
                          disabled={!isCompliant || loading}
                          onClick={handleSubmit}
                        >
                          {loading ? 'Synchronizing...' : productId ? 'Publish taxonomic edits' : 'Publish Product to Catalog'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </ AnimatePresence>
        </div>
      </div>

      {/* Footer controls */}
      <div className="bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-850 p-4 px-6 flex justify-between items-center shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="font-bold text-xs"
          onClick={handleBack}
          disabled={activeStep === 1}
          icon={ArrowLeft}
        >
          Previous Step
        </Button>

        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Step {activeStep} of 10
        </div>

        {activeStep < 10 ? (
          <Button
            variant="primary"
            size="sm"
            className="font-brand font-bold text-xs"
            onClick={handleNext}
            icon={ArrowRight}
            iconPosition="right"
          >
            Next Step
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="font-brand font-bold text-xs"
            onClick={handleSubmit}
            disabled={!isCompliant || loading}
          >
            {loading ? 'Working...' : 'Finalize & Publish'}
          </Button>
        )}
      </div>
    </div>
  );
}
