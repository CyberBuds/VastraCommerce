import { create } from 'zustand';

export interface CatalogBrand {
  id: string;
  name: string;
  logo: string;
  banner?: string;
  description: string;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

type NewCatalogBrand = Omit<CatalogBrand, 'id' | 'createdAt'> & Partial<Pick<CatalogBrand, 'id' | 'createdAt'>>;

export interface CatalogCollection {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

type NewCatalogCollection = Omit<CatalogCollection, 'id' | 'createdAt'> & Partial<Pick<CatalogCollection, 'id' | 'createdAt'>>;

export interface ProductType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

type NewProductType = Omit<ProductType, 'id' | 'createdAt'> & Partial<Pick<ProductType, 'id' | 'createdAt'>>;

export interface CatalogTag {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

type NewCatalogTag = Omit<CatalogTag, 'id' | 'createdAt'> & Partial<Pick<CatalogTag, 'id' | 'createdAt'>>;

export interface AttributeGroup {
  id: string;
  name: string;
  description: string;
}

type NewAttributeGroup = Omit<AttributeGroup, 'id'> & Partial<Pick<AttributeGroup, 'id'>>;

export interface Attribute {
  id: string;
  groupId: string;
  name: string;
  type: 'text' | 'color' | 'image';
  values: { id: string; value: string; label: string; extra?: string }[]; // extra can be color hex or image URL
  createdAt: string;
}

type NewAttribute = Omit<Attribute, 'id' | 'createdAt'> & Partial<Pick<Attribute, 'id' | 'createdAt'>>;

export interface ProductReview {
  id: string;
  productName: string;
  productSku: string;
  reviewer: string;
  rating: number;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reply?: string;
  createdAt: string;
}

export interface ProductQuestion {
  id: string;
  productName: string;
  productSku: string;
  customerName: string;
  question: string;
  answer?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface AuditHistoryLog {
  id: string;
  productName: string;
  sku: string;
  action: string; // e.g., "Created", "Price Updated", "Stock Updated", "Approved"
  changedFrom: string;
  changedTo: string;
  updatedBy: string;
  timestamp: string;
}

interface CatalogStoreState {
  brands: CatalogBrand[];
  collections: CatalogCollection[];
  productTypes: ProductType[];
  tags: CatalogTag[];
  attributeGroups: AttributeGroup[];
  attributes: Attribute[];
  reviews: ProductReview[];
  questions: ProductQuestion[];
  auditLogs: AuditHistoryLog[];

  // Brands CRUD
  addBrand: (brand: NewCatalogBrand) => void;
  updateBrand: (id: string, brand: Partial<CatalogBrand>) => void;
  deleteBrand: (id: string) => void;

  // Collections CRUD
  addCollection: (collection: NewCatalogCollection) => void;
  updateCollection: (id: string, collection: Partial<CatalogCollection>) => void;
  deleteCollection: (id: string) => void;

  // Product Types CRUD
  addProductType: (type: NewProductType) => void;
  updateProductType: (id: string, type: Partial<ProductType>) => void;
  deleteProductType: (id: string) => void;

  // Tags CRUD
  addTag: (tag: NewCatalogTag) => void;
  updateTag: (id: string, tag: Partial<CatalogTag>) => void;
  deleteTag: (id: string) => void;

  // Attributes CRUD
  addAttributeGroup: (group: NewAttributeGroup) => void;
  addAttribute: (attr: NewAttribute) => void;
  updateAttribute: (id: string, attr: Partial<Attribute>) => void;
  deleteAttribute: (id: string) => void;

  // Reviews Actions
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  deleteReview: (id: string) => void;
  replyToReview: (id: string, reply: string) => void;

  // Questions Actions
  approveQuestion: (id: string) => void;
  answerQuestion: (id: string, answer: string) => void;
  deleteQuestion: (id: string) => void;

  // Audit Logs Actions
  addAuditLog: (log: Omit<AuditHistoryLog, 'id' | 'timestamp'>) => void;
}

const getInitialData = <T>(key: string, fallback: T[]): T[] => {
  if (typeof window === 'undefined') return fallback;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  return JSON.parse(stored);
};

const saveToStorage = <T>(key: string, data: T[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

const DEFAULT_BRANDS: CatalogBrand[] = [];
const DEFAULT_COLLECTIONS: CatalogCollection[] = [];
const DEFAULT_PRODUCT_TYPES: ProductType[] = [];
const DEFAULT_TAGS: CatalogTag[] = [];
const DEFAULT_ATTRIBUTE_GROUPS: AttributeGroup[] = [];
const DEFAULT_ATTRIBUTES: Attribute[] = [];
const DEFAULT_REVIEWS: ProductReview[] = [];
const DEFAULT_QUESTIONS: ProductQuestion[] = [];
const DEFAULT_AUDIT_LOGS: AuditHistoryLog[] = [];

export const useCatalogStore = create<CatalogStoreState>((set) => ({
  brands: getInitialData('ent_cat_brands', DEFAULT_BRANDS),
  collections: getInitialData('ent_cat_collections', DEFAULT_COLLECTIONS),
  productTypes: getInitialData('ent_cat_types', DEFAULT_PRODUCT_TYPES),
  tags: getInitialData('ent_cat_tags', DEFAULT_TAGS),
  attributeGroups: getInitialData('ent_cat_attr_groups', DEFAULT_ATTRIBUTE_GROUPS),
  attributes: getInitialData('ent_cat_attributes', DEFAULT_ATTRIBUTES),
  reviews: getInitialData('ent_cat_reviews', DEFAULT_REVIEWS),
  questions: getInitialData('ent_cat_questions', DEFAULT_QUESTIONS),
  auditLogs: getInitialData('ent_cat_audit', DEFAULT_AUDIT_LOGS),

  // Brands CRUD
  addBrand: (brand) => set((state) => {
    const newBrand: CatalogBrand = {
      ...brand,
      id: brand.id ?? `b-${Date.now()}`,
      createdAt: brand.createdAt ?? new Date().toISOString(),
    };
    const updated = [...state.brands, newBrand];
    saveToStorage('ent_cat_brands', updated);
    return { brands: updated };
  }),

  updateBrand: (id, updatedFields) => set((state) => {
    const updated = state.brands.map((b) => b.id === id ? { ...b, ...updatedFields } : b);
    saveToStorage('ent_cat_brands', updated);
    return { brands: updated };
  }),

  deleteBrand: (id) => set((state) => {
    const updated = state.brands.filter((b) => b.id !== id);
    saveToStorage('ent_cat_brands', updated);
    return { brands: updated };
  }),

  // Collections CRUD
  addCollection: (col) => set((state) => {
    const newCol: CatalogCollection = {
      ...col,
      id: col.id ?? `col-${Date.now()}`,
      createdAt: col.createdAt ?? new Date().toISOString(),
    };
    const updated = [...state.collections, newCol];
    saveToStorage('ent_cat_collections', updated);
    return { collections: updated };
  }),

  updateCollection: (id, updatedFields) => set((state) => {
    const updated = state.collections.map((c) => c.id === id ? { ...c, ...updatedFields } : c);
    saveToStorage('ent_cat_collections', updated);
    return { collections: updated };
  }),

  deleteCollection: (id) => set((state) => {
    const updated = state.collections.filter((c) => c.id !== id);
    saveToStorage('ent_cat_collections', updated);
    return { collections: updated };
  }),

  // Product Types CRUD
  addProductType: (type) => set((state) => {
    const newType: ProductType = {
      ...type,
      id: type.id ?? `pt-${Date.now()}`,
      createdAt: type.createdAt ?? new Date().toISOString(),
    };
    const updated = [...state.productTypes, newType];
    saveToStorage('ent_cat_types', updated);
    return { productTypes: updated };
  }),

  updateProductType: (id, updatedFields) => set((state) => {
    const updated = state.productTypes.map((pt) => pt.id === id ? { ...pt, ...updatedFields } : pt);
    saveToStorage('ent_cat_types', updated);
    return { productTypes: updated };
  }),

  deleteProductType: (id) => set((state) => {
    const updated = state.productTypes.filter((pt) => pt.id !== id);
    saveToStorage('ent_cat_types', updated);
    return { productTypes: updated };
  }),

  // Tags CRUD
  addTag: (tag) => set((state) => {
    const newTag: CatalogTag = {
      ...tag,
      id: tag.id ?? `t-${Date.now()}`,
      createdAt: tag.createdAt ?? new Date().toISOString(),
    };
    const updated = [...state.tags, newTag];
    saveToStorage('ent_cat_tags', updated);
    return { tags: updated };
  }),

  updateTag: (id, updatedFields) => set((state) => {
    const updated = state.tags.map((t) => t.id === id ? { ...t, ...updatedFields } : t);
    saveToStorage('ent_cat_tags', updated);
    return { tags: updated };
  }),

  deleteTag: (id) => set((state) => {
    const updated = state.tags.filter((t) => t.id !== id);
    saveToStorage('ent_cat_tags', updated);
    return { tags: updated };
  }),

  // Attributes CRUD
  addAttributeGroup: (group) => set((state) => {
    const newGroup: AttributeGroup = {
      ...group,
      id: group.id ?? `g-${Date.now()}`,
    };
    const updated = [...state.attributeGroups, newGroup];
    saveToStorage('ent_cat_attr_groups', updated);
    return { attributeGroups: updated };
  }),

  addAttribute: (attr) => set((state) => {
    const newAttr: Attribute = {
      ...attr,
      id: attr.id ?? `attr-${Date.now()}`,
      createdAt: attr.createdAt ?? new Date().toISOString(),
    };
    const updated = [...state.attributes, newAttr];
    saveToStorage('ent_cat_attributes', updated);
    return { attributes: updated };
  }),

  updateAttribute: (id, updatedFields) => set((state) => {
    const updated = state.attributes.map((a) => a.id === id ? { ...a, ...updatedFields } : a);
    saveToStorage('ent_cat_attributes', updated);
    return { attributes: updated };
  }),

  deleteAttribute: (id) => set((state) => {
    const updated = state.attributes.filter((a) => a.id !== id);
    saveToStorage('ent_cat_attributes', updated);
    return { attributes: updated };
  }),

  // Reviews
  approveReview: (id) => set((state) => {
    const updated = state.reviews.map((r) => r.id === id ? { ...r, status: 'APPROVED' as const } : r);
    saveToStorage('ent_cat_reviews', updated);
    return { reviews: updated };
  }),

  rejectReview: (id) => set((state) => {
    const updated = state.reviews.map((r) => r.id === id ? { ...r, status: 'REJECTED' as const } : r);
    saveToStorage('ent_cat_reviews', updated);
    return { reviews: updated };
  }),

  deleteReview: (id) => set((state) => {
    const updated = state.reviews.filter((r) => r.id !== id);
    saveToStorage('ent_cat_reviews', updated);
    return { reviews: updated };
  }),

  replyToReview: (id, reply) => set((state) => {
    const updated = state.reviews.map((r) => r.id === id ? { ...r, reply, status: 'APPROVED' as const } : r);
    saveToStorage('ent_cat_reviews', updated);
    return { reviews: updated };
  }),

  // Questions
  approveQuestion: (id) => set((state) => {
    const updated = state.questions.map((q) => q.id === id ? { ...q, status: 'APPROVED' as const } : q);
    saveToStorage('ent_cat_questions', updated);
    return { questions: updated };
  }),

  answerQuestion: (id, answer) => set((state) => {
    const updated = state.questions.map((q) => q.id === id ? { ...q, answer, status: 'APPROVED' as const } : q);
    saveToStorage('ent_cat_questions', updated);
    return { questions: updated };
  }),

  deleteQuestion: (id) => set((state) => {
    const updated = state.questions.filter((q) => q.id !== id);
    saveToStorage('ent_cat_questions', updated);
    return { questions: updated };
  }),

  // Audit Logs
  addAuditLog: (log) => set((state) => {
    const newLog: AuditHistoryLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newLog, ...state.auditLogs];
    saveToStorage('ent_cat_audit', updated);
    return { auditLogs: updated };
  }),
}));
