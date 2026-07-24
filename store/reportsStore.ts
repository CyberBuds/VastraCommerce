import { create } from 'zustand';
import {
  ReportFilterState,
  CustomReportTemplate,
  ScheduledReportItem,
  ExportHistoryRecord,
} from '@/features/reports/types/reportsTypes';

interface ReportsStoreState {
  // Global Filters
  filters: ReportFilterState;
  setFilters: (filters: Partial<ReportFilterState>) => void;
  resetFilters: () => void;

  // Custom Report Builder Templates
  customTemplates: CustomReportTemplate[];
  addTemplate: (template: Omit<CustomReportTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, updates: Partial<CustomReportTemplate>) => void;
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => void;

  // Scheduled Reports
  scheduledReports: ScheduledReportItem[];
  addScheduledReport: (report: Omit<ScheduledReportItem, 'id' | 'lastRunAt'>) => void;
  toggleScheduledReportStatus: (id: string) => void;
  deleteScheduledReport: (id: string) => void;

  // Export History
  exportHistory: ExportHistoryRecord[];
  addExportRecord: (record: Omit<ExportHistoryRecord, 'id' | 'exportedAt' | 'status'>) => void;
  clearExportHistory: () => void;

  // Global Export Modal Controls
  isExportModalOpen: boolean;
  exportModalReportTitle: string;
  openExportModal: (title: string) => void;
  closeExportModal: () => void;
}

const initialFilters: ReportFilterState = {
  dateRange: 'last_30_days',
  storeId: 'ALL',
  warehouseId: 'ALL',
  categoryId: 'ALL',
  brandId: 'ALL',
  customerGroupId: 'ALL',
  paymentMethod: 'ALL',
  orderStatus: 'ALL',
};

const initialTemplates: CustomReportTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'High-Margin Product Sales Breakdown',
    description: 'Product sales aggregated by profit margin and category',
    module: 'SALES',
    selectedFields: ['productName', 'sku', 'quantitySold', 'grossRevenue', 'profitMargin'],
    groupBy: 'category',
    sortBy: 'grossRevenue',
    sortOrder: 'desc',
    aggregation: 'SUM',
    createdAt: '2026-06-15T09:00:00Z',
    updatedAt: '2026-07-10T14:20:00Z',
  },
  {
    id: 'tmpl-2',
    title: 'Customer LTV & Churn Exposure',
    description: 'Cohort analysis of repeat buyers and inactive accounts (>90 days)',
    module: 'CUSTOMERS',
    selectedFields: ['customerName', 'email', 'orderCount', 'totalSpent', 'daysSinceLastOrder'],
    groupBy: 'customerGroup',
    sortBy: 'totalSpent',
    sortOrder: 'desc',
    aggregation: 'AVG',
    createdAt: '2026-06-20T11:30:00Z',
    updatedAt: '2026-07-01T10:00:00Z',
  },
];

const initialScheduled: ScheduledReportItem[] = [
  {
    id: 'sched-1',
    name: 'Executive Daily Sales Briefing',
    templateName: 'High-Margin Product Sales Breakdown',
    frequency: 'DAILY',
    format: 'PDF',
    recipients: ['cfo@enterprise-aero.com', 'analytics@enterprise-aero.com'],
    nextRunAt: '2026-07-23T06:00:00Z',
    lastRunAt: '2026-07-22T06:00:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'sched-2',
    name: 'Weekly Warehouse Valuation & Low Stock Digest',
    templateName: 'Inventory Valuation Report',
    frequency: 'WEEKLY',
    format: 'EXCEL',
    recipients: ['supplychain@enterprise-aero.com', 'warehouse.mgr@enterprise-aero.com'],
    nextRunAt: '2026-07-27T08:00:00Z',
    lastRunAt: '2026-07-20T08:00:00Z',
    status: 'ACTIVE',
  },
];

const initialExports: ExportHistoryRecord[] = [
  {
    id: 'exp-101',
    fileName: 'executive_sales_summary_q2_2026.xlsx',
    reportType: 'Sales Analytics',
    format: 'EXCEL',
    rowCount: 1420,
    fileSizeBytes: 245800,
    exportedBy: 'Admin User',
    exportedAt: '2026-07-22T10:15:00Z',
    downloadUrl: '#',
    status: 'COMPLETED',
  },
  {
    id: 'exp-102',
    fileName: 'gst_tax_audit_june_2026.pdf',
    reportType: 'Tax & Compliance',
    format: 'PDF',
    rowCount: 380,
    fileSizeBytes: 1845000,
    exportedBy: 'Finance Lead',
    exportedAt: '2026-07-21T16:30:00Z',
    downloadUrl: '#',
    status: 'COMPLETED',
  },
  {
    id: 'exp-103',
    fileName: 'inventory_aging_report.csv',
    reportType: 'Inventory Valuation',
    format: 'CSV',
    rowCount: 850,
    fileSizeBytes: 98200,
    exportedBy: 'Warehouse Sup',
    exportedAt: '2026-07-20T11:45:00Z',
    downloadUrl: '#',
    status: 'COMPLETED',
  },
];

export const useReportsStore = create<ReportsStoreState>((set) => ({
  filters: initialFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: initialFilters }),

  customTemplates: initialTemplates,
  addTemplate: (template) =>
    set((state) => {
      const now = new Date().toISOString();
      const newTmpl: CustomReportTemplate = {
        ...template,
        id: `tmpl-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      return { customTemplates: [newTmpl, ...state.customTemplates] };
    }),
  updateTemplate: (id, updates) =>
    set((state) => ({
      customTemplates: state.customTemplates.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    })),
  deleteTemplate: (id) =>
    set((state) => ({
      customTemplates: state.customTemplates.filter((t) => t.id !== id),
    })),
  duplicateTemplate: (id) =>
    set((state) => {
      const target = state.customTemplates.find((t) => t.id === id);
      if (!target) return state;
      const now = new Date().toISOString();
      const copy: CustomReportTemplate = {
        ...target,
        id: `tmpl-${Date.now()}`,
        title: `${target.title} (Copy)`,
        createdAt: now,
        updatedAt: now,
      };
      return { customTemplates: [copy, ...state.customTemplates] };
    }),

  scheduledReports: initialScheduled,
  addScheduledReport: (report) =>
    set((state) => {
      const newSched: ScheduledReportItem = {
        ...report,
        id: `sched-${Date.now()}`,
        lastRunAt: 'Never',
      };
      return { scheduledReports: [newSched, ...state.scheduledReports] };
    }),
  toggleScheduledReportStatus: (id) =>
    set((state) => ({
      scheduledReports: state.scheduledReports.map((s) =>
        s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : s
      ),
    })),
  deleteScheduledReport: (id) =>
    set((state) => ({
      scheduledReports: state.scheduledReports.filter((s) => s.id !== id),
    })),

  exportHistory: initialExports,
  addExportRecord: (record) =>
    set((state) => {
      const newExp: ExportHistoryRecord = {
        ...record,
        id: `exp-${Date.now()}`,
        exportedAt: new Date().toISOString(),
        status: 'COMPLETED',
      };
      return { exportHistory: [newExp, ...state.exportHistory] };
    }),
  clearExportHistory: () => set({ exportHistory: [] }),

  isExportModalOpen: false,
  exportModalReportTitle: 'Executive Summary',
  openExportModal: (title) =>
    set({ isExportModalOpen: true, exportModalReportTitle: title }),
  closeExportModal: () => set({ isExportModalOpen: false }),
}));
