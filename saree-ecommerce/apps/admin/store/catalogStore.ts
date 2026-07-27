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

export interface CatalogCollection {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface ProductType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface CatalogTag {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface AttributeGroup {
  id: string;
  name: string;
  description: string;
}

export interface Attribute {
  id: string;
  groupId: string;
  name: string;
  type: 'text' | 'color' | 'image';
  values: { id: string; value: string; label: string; extra?: string }[]; // extra can be color hex or image URL
  createdAt: string;
}

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
  addBrand: (brand: Omit<CatalogBrand, 'id' | 'createdAt'>) => void;
  updateBrand: (id: string, brand: Partial<CatalogBrand>) => void;
  deleteBrand: (id: string) => void;

  // Collections CRUD
  addCollection: (collection: Omit<CatalogCollection, 'id' | 'createdAt'>) => void;
  updateCollection: (id: string, collection: Partial<CatalogCollection>) => void;
  deleteCollection: (id: string) => void;

  // Product Types CRUD
  addProductType: (type: Omit<ProductType, 'id' | 'createdAt'>) => void;
  updateProductType: (id: string, type: Partial<ProductType>) => void;
  deleteProductType: (id: string) => void;

  // Tags CRUD
  addTag: (tag: Omit<CatalogTag, 'id' | 'createdAt'>) => void;
  updateTag: (id: string, tag: Partial<CatalogTag>) => void;
  deleteTag: (id: string) => void;

  // Attributes CRUD
  addAttributeGroup: (group: Omit<AttributeGroup, 'id'>) => void;
  addAttribute: (attr: Omit<Attribute, 'id' | 'createdAt'>) => void;
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

const DEFAULT_BRANDS: CatalogBrand[] = [
  {
    id: 'b-1',
    name: 'AeroSpace Inc',
    logo: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=80&h=80&fit=crop',
    banner: 'https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?w=800&h=300&fit=crop',
    description: 'High-performance turbine and aerospace components provider.',
    featured: true,
    seoTitle: 'AeroSpace Inc - Premium Heavy Industrial Parts',
    seoDescription: 'The finest aerospace structural and fluid elements engineered for high tolerances.',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'b-2',
    name: 'GigaCore Technologies',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&h=80&fit=crop',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=300&fit=crop',
    description: 'Next-generation semiconductor and smart battery core components.',
    featured: true,
    seoTitle: 'GigaCore Electronics - Industrial Silicon & Battery Pack',
    seoDescription: 'Powering advanced electrical grids with durable battery packs.',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'b-3',
    name: 'Precision Tooling Co.',
    logo: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=80&h=80&fit=crop',
    description: 'Calibrated measurement equipment and precision tooling units.',
    featured: false,
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
];

const DEFAULT_COLLECTIONS: CatalogCollection[] = [
  {
    id: 'col-1',
    name: 'Q3 High-Output Turbines',
    description: 'A curated set of extreme-reliability fuel turbines.',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'col-2',
    name: 'EcoEnergy Materials',
    description: 'Solar panels, carbon framing, and green fuel component supplies.',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
  },
];

const DEFAULT_PRODUCT_TYPES: ProductType[] = [
  { id: 'pt-1', name: 'Heavy Industrial Assembly', description: 'Requires physical freight shipping and certification.', createdAt: new Date().toISOString() },
  { id: 'pt-2', name: 'Precision Calibrator Item', description: 'Calibrated instruments subject to regular thermal testing.', createdAt: new Date().toISOString() },
  { id: 'pt-3', name: 'Bulk Fluid Chemistry', description: 'Packaged chemical fluids with hazard warnings.', createdAt: new Date().toISOString() },
];

const DEFAULT_TAGS: CatalogTag[] = [
  { id: 't-1', name: 'aerospace', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { id: 't-2', name: 'turbine', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { id: 't-3', name: 'semiconductor', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { id: 't-4', name: 'chemical', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { id: 't-5', name: 'calibrated', status: 'ACTIVE', createdAt: new Date().toISOString() },
];

const DEFAULT_ATTRIBUTE_GROUPS: AttributeGroup[] = [
  { id: 'g-1', name: 'Physical Specs', description: 'Standard dimensions and build characteristics' },
  { id: 'g-2', name: 'Electrical Output', description: 'Voltage, resistance, and capacitance levels' },
];

const DEFAULT_ATTRIBUTES: Attribute[] = [
  {
    id: 'attr-1',
    groupId: 'g-1',
    name: 'Build Size',
    type: 'text',
    values: [
      { id: 'v-1', value: 'compact', label: 'Compact Frame (12cm)' },
      { id: 'v-2', value: 'standard', label: 'Standard Base (45cm)' },
      { id: 'v-3', value: 'industrial', label: 'Extended Industrial (120cm)' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'attr-2',
    groupId: 'g-1',
    name: 'Thermal Coating',
    type: 'color',
    values: [
      { id: 'v-4', value: '#e6355b', label: 'Aero-Red Barrier', extra: '#e6355b' },
      { id: 'v-5', value: '#475569', label: 'Slate Thermal Guard', extra: '#475569' },
      { id: 'v-6', value: '#1e3a8a', label: 'Cryo-Blue Shield', extra: '#1e3a8a' },
    ],
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productName: 'AeroFlow Turbine X1',
    productSku: 'SKU-AERO-10000',
    reviewer: 'Dr. Arthur Pendelton (SpaceX)',
    rating: 5,
    comment: 'Exceptional blade balance. Handled 950C thermal loops without any micro-fracturing or drag increases.',
    status: 'APPROVED',
    reply: 'Thank you Dr. Arthur! Our metallurgy division takes immense pride in these specs.',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'rev-2',
    productName: 'Quantum Spark Plug',
    productSku: 'SKU-AERO-10001',
    reviewer: 'Jack Vance (Tesla Tech)',
    rating: 3,
    comment: 'Ignition efficiency is superb, but the thread size had a 0.04mm discrepancy. Please calibrate machine heads.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
];

const DEFAULT_QUESTIONS: ProductQuestion[] = [
  {
    id: 'q-1',
    productName: 'AeroFlow Turbine X1',
    productSku: 'SKU-AERO-10000',
    customerName: 'Marcus Aurelius (Apex Aero)',
    question: 'Is this shipment eligible for the hazardous materials class 9 packaging?',
    answer: 'Yes, all turbine assembly components are shipped with shock-absorption casing matching HazMat Class 9 standard.',
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'q-2',
    productName: 'Industrial Hydraulic Fluid',
    productSku: 'SKU-AERO-10002',
    customerName: 'Ellen Ripley (Nostromo Mining)',
    question: 'What is the viscosity index at sub-zero temperatures (specifically around -40C)?',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
];

const DEFAULT_AUDIT_LOGS: AuditHistoryLog[] = [
  {
    id: 'log-1',
    productName: 'AeroFlow Turbine X1',
    sku: 'SKU-AERO-10000',
    action: 'Price Updated',
    changedFrom: '$1200.00',
    changedTo: '$1499.99',
    updatedBy: 'Yash Gupta',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'log-2',
    productName: 'AeroFlow Turbine X1',
    sku: 'SKU-AERO-10000',
    action: 'Inventory Audit',
    changedFrom: '40 units',
    changedTo: '120 units',
    updatedBy: 'Sarah Connor',
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
];

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
      id: `b-${Date.now()}`,
      createdAt: new Date().toISOString(),
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
      id: `col-${Date.now()}`,
      createdAt: new Date().toISOString(),
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
      id: `pt-${Date.now()}`,
      createdAt: new Date().toISOString(),
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
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString(),
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
      id: `g-${Date.now()}`,
    };
    const updated = [...state.attributeGroups, newGroup];
    saveToStorage('ent_cat_attr_groups', updated);
    return { attributeGroups: updated };
  }),

  addAttribute: (attr) => set((state) => {
    const newAttr: Attribute = {
      ...attr,
      id: `attr-${Date.now()}`,
      createdAt: new Date().toISOString(),
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
