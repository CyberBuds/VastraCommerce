import { api } from '@/services/api';
import {
  Warehouse,
  StockItem,
  StockMovement,
  PurchaseOrder,
  GRN,
  StockTransfer,
  StockAdjustment,
  Supplier,
  BarcodeItem,
  BatchItem,
  SerialNumberItem,
  ExpiryAlert,
  CycleCount,
  InventoryValuation,
  InventoryStats,
} from '../types/inventoryTypes';

const unwrapData = <T>(payload: any): T => {
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) {
    return payload.data as T;
  }
  return payload as T;
};

const normalizeList = <T>(payload: any): T[] => {
  const data = unwrapData<T | { items?: T[]; data?: T[] }>(payload);
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const items = (data as any).items ?? (data as any).data ?? [];
    return Array.isArray(items) ? items : [];
  }
  return [];
};

const normalizeWarehouseStatus = (status?: string): 'active' | 'inactive' => {
  return String(status ?? 'active').toLowerCase() === 'inactive' ? 'inactive' : 'active';
};

const toWarehouseModel = (warehouse: any): Warehouse => {
  const id = String(warehouse?.id ?? warehouse?.warehouseId ?? '');
  return {
    id,
    code: warehouse?.warehouseCode ?? warehouse?.code ?? `WH-${id || 'NEW'}`,
    name: warehouse?.warehouseName ?? warehouse?.name ?? 'Warehouse',
    manager: warehouse?.manager ?? warehouse?.contactPerson ?? 'Unassigned',
    contactPerson: warehouse?.contactPerson ?? warehouse?.manager ?? 'Unassigned',
    email: warehouse?.email ?? '',
    phone: warehouse?.phone ?? '',
    country: warehouse?.country ?? '',
    state: warehouse?.state ?? '',
    city: warehouse?.city ?? '',
    address: warehouse?.address ?? '',
    capacity: Number(warehouse?.capacity ?? warehouse?.totalCapacity ?? 50000),
    status: normalizeWarehouseStatus(warehouse?.status),
    isDefault: Boolean(warehouse?.isDefault ?? false),
    totalSKUs: Number(warehouse?.totalSKUs ?? warehouse?.totalStock ?? 0),
    currentCapacityPercent: Number(warehouse?.currentCapacityPercent ?? 0),
    createdAt: warehouse?.createdAt ?? new Date().toISOString(),
  };
};

const warehousePayload = (data: Partial<Warehouse> & Record<string, any>) => {
  const normalizedStatus = String(data?.status ?? 'ACTIVE').toUpperCase();

  return {
    warehouseCode: data?.code ?? data?.warehouseCode ?? '',
    warehouseName: data?.name ?? data?.warehouseName ?? '',
    contactPerson: data?.manager ?? data?.contactPerson ?? '',
    phone: data?.phone ?? '',
    email: data?.email ?? '',
    address: data?.address ?? '',
    city: data?.city ?? '',
    state: data?.state ?? '',
    country: data?.country ?? '',
    pincode: data?.pincode ?? '',
    status: normalizedStatus === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
  };
};

const fromInventoryItem = (item: any): StockItem => {
  const availableQty = Number(item?.availableStock ?? item?.availableQty ?? 0);
  const unitCost = Number(item?.unitCost ?? item?.product?.costPrice ?? item?.costPrice ?? 0);
  const totalValuation = Number(item?.totalValuation ?? ((availableQty * unitCost) || 0));

  return {
    id: String(item?.id ?? item?.inventoryId ?? item?.productId ?? ''),
    sku: item?.product?.sku ?? item?.sku ?? '',
    productName: item?.product?.productName ?? item?.productName ?? 'Product',
    barcode: item?.barcode ?? '',
    category: item?.product?.category?.name ?? item?.category ?? 'General',
    brand: item?.product?.brand?.name ?? item?.brand ?? 'General',
    warehouseId: String(item?.warehouseId ?? item?.warehouse?.id ?? ''),
    warehouseName: item?.warehouse?.warehouseName ?? item?.warehouseName ?? 'Main Warehouse',
    availableQty,
    reservedQty: Number(item?.reservedStock ?? item?.reservedQty ?? 0),
    damagedQty: Number(item?.damagedStock ?? item?.damagedQty ?? 0),
    incomingQty: Number(item?.incomingStock ?? item?.incomingQty ?? 0),
    outgoingQty: Number(item?.outgoingStock ?? item?.outgoingQty ?? 0),
    unitCost,
    totalValuation,
    reorderLevel: Number(item?.minimumStock ?? item?.reorderLevel ?? 0),
    status: (() => {
      if (availableQty <= 0) return 'out_of_stock';
      if (Number(item?.minimumStock ?? 0) >= availableQty) return 'low_stock';
      return 'in_stock';
    })(),
    lastRestocked: item?.updatedAt ?? item?.lastRestocked ?? new Date().toISOString(),
  };
};

export const inventoryApi = {
  getStats: async (): Promise<InventoryStats> => {
    try {
      const [warehousesRes, stockRes] = await Promise.all([
        api.get('/inventory/warehouses', { params: { pageSize: 100 } }),
        api.get('/inventory/inventory', { params: { pageSize: 100 } }),
      ]);

      const warehouses = normalizeList<any>(warehousesRes.data);
      const stockItems = normalizeList<any>(stockRes.data);

      const totalStock = stockItems.reduce((sum, item) => sum + Number(item?.currentStock ?? item?.availableStock ?? 0), 0);
      const availableStock = stockItems.reduce((sum, item) => sum + Number(item?.availableStock ?? 0), 0);
      const reservedStock = stockItems.reduce((sum, item) => sum + Number(item?.reservedStock ?? 0), 0);
      const lowStockCount = stockItems.filter((item) => Number(item?.availableStock ?? 0) <= Number(item?.minimumStock ?? 0)).length;
      const outOfStockCount = stockItems.filter((item) => Number(item?.availableStock ?? 0) <= 0).length;

      return {
        totalStock,
        availableStock,
        reservedStock,
        lowStockCount,
        outOfStockCount,
        damagedStock: stockItems.reduce((sum, item) => sum + Number(item?.damagedStock ?? 0), 0),
        incomingStock: stockItems.reduce((sum, item) => sum + Number(item?.incomingStock ?? 0), 0),
        outgoingStock: stockItems.reduce((sum, item) => sum + Number(item?.outgoingStock ?? 0), 0),
        warehouseCount: warehouses.length,
        supplierCount: 0,
        inventoryValue: stockItems.reduce((sum, item) => sum + Number(item?.totalValuation ?? 0), 0),
        todaysStockMovements: 0,
      };
    } catch {
      return {
        totalStock: 0,
        availableStock: 0,
        reservedStock: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        damagedStock: 0,
        incomingStock: 0,
        outgoingStock: 0,
        warehouseCount: 0,
        supplierCount: 0,
        inventoryValue: 0,
        todaysStockMovements: 0,
      };
    }
  },

  getWarehouses: async (): Promise<Warehouse[]> => {
    const response = await api.get('/inventory/warehouses', { params: { pageSize: 100 } });
    return normalizeList<any>(response.data).map(toWarehouseModel);
  },

  getWarehouseById: async (id: string): Promise<Warehouse | undefined> => {
    const response = await api.get(`/inventory/warehouses/${id}`);
    const warehouse = unwrapData<any>(response.data);
    return warehouse ? toWarehouseModel(warehouse) : undefined;
  },

  createWarehouse: async (data: Omit<Warehouse, 'id' | 'totalSKUs' | 'currentCapacityPercent' | 'createdAt'>): Promise<Warehouse> => {
    const response = await api.post('/inventory/warehouses', warehousePayload(data as any));
    return toWarehouseModel(unwrapData<any>(response.data));
  },

  updateWarehouse: async (id: string, data: Partial<Warehouse>): Promise<Warehouse> => {
    const response = await api.put(`/inventory/warehouses/${id}`, warehousePayload(data as any));
    return toWarehouseModel(unwrapData<any>(response.data));
  },

  deleteWarehouse: async (id: string): Promise<boolean> => {
    const response = await api.delete(`/inventory/warehouses/${id}`);
    return response.data?.success !== false;
  },

  getStockItems: async (filters?: { warehouseId?: string; status?: string }): Promise<StockItem[]> => {
    const params: Record<string, string> = {};
    if (filters?.warehouseId) params.warehouseId = filters.warehouseId;
    if (filters?.status) params.status = filters.status;

    const response = await api.get('/inventory/inventory', { params });
    return normalizeList<any>(response.data).map(fromInventoryItem);
  },

  getStockItemById: async (id: string): Promise<StockItem | undefined> => {
    const response = await api.get(`/inventory/inventory/${id}`);
    const item = unwrapData<any>(response.data);
    return item ? fromInventoryItem(item) : undefined;
  },

  getStockMovements: async (): Promise<StockMovement[]> => [],

  createStockMovement: async (data: Omit<StockMovement, 'id' | 'timestamp'>): Promise<StockMovement> => {
    const response = await api.post('/inventory/stock-movements', data);
    return unwrapData<StockMovement>(response.data);
  },

  getPurchaseOrders: async (): Promise<PurchaseOrder[]> => [],

  createPurchaseOrder: async (data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>): Promise<PurchaseOrder> => {
    const response = await api.post('/inventory/purchase-orders', data);
    return unwrapData<PurchaseOrder>(response.data);
  },

  updatePOStatus: async (id: string, status: PurchaseOrder['status']): Promise<PurchaseOrder> => {
    const response = await api.patch(`/inventory/purchase-orders/${id}/status`, { status });
    return unwrapData<PurchaseOrder>(response.data);
  },

  getGRNs: async (): Promise<GRN[]> => [],

  createGRN: async (data: Omit<GRN, 'id' | 'grnNumber'>): Promise<GRN> => {
    const response = await api.post('/inventory/grns', data);
    return unwrapData<GRN>(response.data);
  },

  getTransfers: async (): Promise<StockTransfer[]> => [],

  createTransfer: async (data: Omit<StockTransfer, 'id' | 'transferNumber' | 'createdAt'>): Promise<StockTransfer> => {
    const response = await api.post('/inventory/stock-transfers', data);
    return unwrapData<StockTransfer>(response.data);
  },

  updateTransferStatus: async (id: string, status: StockTransfer['status']): Promise<StockTransfer> => {
    const response = await api.patch(`/inventory/stock-transfers/${id}/status`, { status });
    return unwrapData<StockTransfer>(response.data);
  },

  getAdjustments: async (): Promise<StockAdjustment[]> => [],

  createAdjustment: async (data: Omit<StockAdjustment, 'id' | 'adjustmentNumber' | 'createdAt'>): Promise<StockAdjustment> => {
    const response = await api.post('/inventory/stock-adjustments', data);
    return unwrapData<StockAdjustment>(response.data);
  },

  getSuppliers: async (): Promise<Supplier[]> => [],

  createSupplier: async (data: Omit<Supplier, 'id' | 'totalOrdersCount' | 'totalSpent'>): Promise<Supplier> => {
    const response = await api.post('/inventory/suppliers', data);
    return unwrapData<Supplier>(response.data);
  },

  getBarcodes: async (): Promise<BarcodeItem[]> => [],

  generateBarcode: async (sku: string, type: 'code128' | 'qr' | 'ean13'): Promise<BarcodeItem> => {
    const response = await api.post('/inventory/barcodes/generate', { sku, type });
    return unwrapData<BarcodeItem>(response.data);
  },

  getBatches: async (): Promise<BatchItem[]> => [],

  getSerialNumbers: async (): Promise<SerialNumberItem[]> => [],

  getExpiryAlerts: async (): Promise<ExpiryAlert[]> => [],

  getCycleCounts: async (): Promise<CycleCount[]> => [],

  createCycleCount: async (data: Omit<CycleCount, 'id' | 'countNumber' | 'createdAt'>): Promise<CycleCount> => {
    const response = await api.post('/inventory/cycle-counts', data);
    return unwrapData<CycleCount>(response.data);
  },

  getValuation: async (_method: 'FIFO' | 'LIFO' | 'Weighted Average'): Promise<InventoryValuation> => ({
    valuationMethod: _method,
    totalStockValue: 0,
    totalUnits: 0,
    inventoryCost: 0,
    estimatedProfit: 0,
    categoryBreakdown: [],
  }),
};