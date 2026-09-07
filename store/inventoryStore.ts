import { create } from 'zustand';

// Helper for localStorage syncing
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to sync state to storage:', e);
  }
}

// ==========================================
// SCHEMAS & INTERFACES
// ==========================================

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  manager: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address: string;
  capacity: number; // in cubic meters or total units limit
  status: 'ACTIVE' | 'INACTIVE';
  isDefault: boolean;
  createdAt: string;
}

export interface StockItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  brand: string;
  barcode: string;
  warehouseId: string;
  warehouseName: string;
  available: number;
  reserved: number;
  damaged: number;
  incoming: number;
  outgoing: number;
  batchNumber?: string;
  serialNumbers?: string[];
}

export interface StockMovement {
  id: string;
  sku: string;
  productName: string;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'RETURN' | 'DAMAGE' | 'LOST' | 'EXPIRED' | 'MANUAL';
  warehouseId: string;
  warehouseName: string;
  quantity: number; // positive or negative
  reference: string; // e.g., PO-1002, TR-4001, ADJ-2003
  notes: string;
  timestamp: string;
}

export interface PurchaseOrderItem {
  sku: string;
  productName: string;
  quantity: number;
  price: number;
  receivedQty: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  expectedDeliveryDate: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';
  items: PurchaseOrderItem[];
  approvalWorkflow: {
    approver?: string;
    timestamp?: string;
    notes?: string;
  };
  attachments: string[];
  notes: string;
  createdAt: string;
}

export interface GRNItem {
  sku: string;
  productName: string;
  orderedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  rejectReason?: string;
  batchNumber?: string;
  serialNumbers?: string[];
}

export interface GRN {
  id: string;
  grnNumber: string;
  poId: string;
  poNumber: string;
  supplierName: string;
  warehouseName: string;
  items: GRNItem[];
  checkedBy: string;
  createdAt: string;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  trackingCode: string;
  items: {
    sku: string;
    productName: string;
    quantity: number;
  }[];
  notes: string;
  createdAt: string;
}

export interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  warehouseId: string;
  warehouseName: string;
  sku: string;
  productName: string;
  qtyChange: number; // can be negative or positive
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  attachments?: string[];
  createdAt: string;
}

export interface Supplier {
  id: string;
  company: string;
  gst?: string;
  pan?: string;
  email: string;
  phone: string;
  address?: string;
  contactPerson?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  paymentTerms?: string; // e.g., Net 30, Net 60, Advance
  rating: number; // 1 to 5 stars
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  contactName?: string;
  category?: string;
}

export interface BarcodeRecord {
  id: string;
  sku: string;
  productName: string;
  barcode: string;
  format?: 'CODE128' | 'QR' | 'EAN13';
  type?: 'CODE-128' | 'QR-CODE' | 'EAN-13' | string;
  status?: string;
  createdAt: string;
}

export interface BatchRecord {
  id: string;
  sku: string;
  productName: string;
  batchNumber: string;
  mfgDate: string;
  expiryDate: string;
  quantity: number;
  status: 'ACTIVE' | 'EXPIRED' | 'QUARANTINED';
  createdAt: string;
}

export interface SerialNumberRecord {
  id: string;
  sku: string;
  productName: string;
  serialNumber: string;
  warehouseId: string;
  warehouseName: string;
  status: 'IN_STOCK' | 'SOLD' | 'TRANSFERRED' | 'DAMAGED';
  history: {
    action: string;
    date: string;
    notes?: string;
  }[];
}

export interface CycleCountItem {
  sku: string;
  productName: string;
  expectedQty?: number;
  systemQty?: number;
  countedQty: number;
  variance?: number;
}

export interface CycleCount {
  id: string;
  countNumber: string;
  warehouseId: string;
  warehouseName: string;
  scheduleDate?: string;
  assignedEmployee?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PENDING';
  items: CycleCountItem[];
  isVarianceApproved?: boolean;
  notes?: string;
  createdAt: string;
  accuracyScore?: number;
  approvedBy?: string;
}

// ==========================================
// SEED INITIAL STATE DATA
// ==========================================

const DEFAULT_WAREHOUSES: Warehouse[] = [];
const DEFAULT_STOCK: StockItem[] = [];
const DEFAULT_SUPPLIERS: Supplier[] = [];
const DEFAULT_PURCHASE_ORDERS: PurchaseOrder[] = [];
const DEFAULT_GRNS: GRN[] = [];
const DEFAULT_TRANSFERS: StockTransfer[] = [];
const DEFAULT_ADJUSTMENTS: StockAdjustment[] = [];
const DEFAULT_BARCODES: BarcodeRecord[] = [];
const DEFAULT_BATCHES: BatchRecord[] = [];
const DEFAULT_SERIALS: SerialNumberRecord[] = [];
const DEFAULT_CYCLE_COUNTS: CycleCount[] = [];

// ==========================================
// ZUSTAND STORE IMPLEMENTATION
// ==========================================

interface InventoryStoreState {
  warehouses: Warehouse[];
  stock: StockItem[];
  stockMovements: StockMovement[];
  purchaseOrders: PurchaseOrder[];
  grns: GRN[];
  stockTransfers: StockTransfer[];
  stockAdjustments: StockAdjustment[];
  suppliers: Supplier[];
  barcodes: BarcodeRecord[];
  batches: BatchRecord[];
  serialNumbers: SerialNumberRecord[];
  cycleCounts: CycleCount[];

  // Warehouses Actions
  addWarehouse: (wh: Omit<Warehouse, 'id' | 'createdAt'>) => void;
  updateWarehouse: (id: string, wh: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;

  // Stock Actions
  updateStockLevel: (id: string, updates: Partial<StockItem>) => void;
  adjustStockLevel: (warehouseId: string, sku: string, type: string, change: number, notes?: string, reference?: string) => void;

  // Stock Movements Actions
  addStockMovement: (mov: Omit<StockMovement, 'id' | 'timestamp'>) => void;

  // Purchase Orders Actions
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'createdAt' | 'approvalWorkflow' | 'poNumber'>) => void;
  updatePurchaseOrderStatus: (id: string, status: PurchaseOrder['status'], notes?: string, approver?: string) => void;

  // GRN Actions
  addGRN: (grn: Omit<GRN, 'id' | 'createdAt'>) => void;

  // Transfers Actions
  addStockTransfer: (tr: Omit<StockTransfer, 'id' | 'createdAt' | 'transferNumber'>) => void;
  updateTransferStatus: (id: string, status: StockTransfer['status']) => void;

  // Adjustments Actions
  addStockAdjustment: (adj: Omit<StockAdjustment, 'id' | 'createdAt' | 'adjustmentNumber'>) => void;
  updateAdjustmentStatus: (id: string, status: StockAdjustment['status'], approvedBy?: string) => void;

  // Suppliers Actions
  addSupplier: (sup: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, sup: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Barcodes Actions
  addBarcode: (bc: Omit<BarcodeRecord, 'id' | 'createdAt'>) => void;
  deleteBarcode: (id: string) => void;

  // Batches Actions
  addBatch: (bat: Omit<BatchRecord, 'id' | 'createdAt'>) => void;
  updateBatchStatus: (id: string, status: BatchRecord['status']) => void;

  // Serial Numbers Actions
  addSerialNumber: (sn: Omit<SerialNumberRecord, 'id'>) => void;
  updateSerialStatus: (id: string, status: SerialNumberRecord['status'], notes?: string) => void;

  // Cycle Counts Actions
  addCycleCount: (cc: Omit<CycleCount, 'id' | 'createdAt' | 'countNumber'>) => void;
  updateCycleCountStatus: (id: string, status: CycleCount['status'], items?: CycleCountItem[]) => void;
  approveCycleVariance: (id: string, approvedBy: string) => void;
  completeCycleCount: (id: string, items: CycleCountItem[], accuracy: number, auditedBy: string) => void;
}

export const useInventoryStore = create<InventoryStoreState>((set) => ({
  warehouses: getFromStorage<Warehouse[]>('ent_inv_warehouses', DEFAULT_WAREHOUSES),
  stock: getFromStorage<StockItem[]>('ent_inv_stock', DEFAULT_STOCK),
  stockMovements: getFromStorage<StockMovement[]>('ent_inv_movements', []),
  purchaseOrders: getFromStorage<PurchaseOrder[]>('ent_inv_purchase_orders', DEFAULT_PURCHASE_ORDERS),
  grns: getFromStorage<GRN[]>('ent_inv_grns', DEFAULT_GRNS),
  stockTransfers: getFromStorage<StockTransfer[]>('ent_inv_transfers', DEFAULT_TRANSFERS),
  stockAdjustments: getFromStorage<StockAdjustment[]>('ent_inv_adjustments', DEFAULT_ADJUSTMENTS),
  suppliers: getFromStorage<Supplier[]>('ent_inv_suppliers', DEFAULT_SUPPLIERS),
  barcodes: getFromStorage<BarcodeRecord[]>('ent_inv_barcodes', DEFAULT_BARCODES),
  batches: getFromStorage<BatchRecord[]>('ent_inv_batches', DEFAULT_BATCHES),
  serialNumbers: getFromStorage<SerialNumberRecord[]>('ent_inv_serials', DEFAULT_SERIALS),
  cycleCounts: getFromStorage<CycleCount[]>('ent_inv_cycle_counts', DEFAULT_CYCLE_COUNTS),

  // Warehouses CRUD
  addWarehouse: (wh) => set((state) => {
    const newWh: Warehouse = {
      ...wh,
      id: `wh-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    // Ensure only one default warehouse
    let updatedWhs = [...state.warehouses];
    if (newWh.isDefault) {
      updatedWhs = updatedWhs.map(w => ({ ...w, isDefault: false }));
    }
    updatedWhs.push(newWh);
    saveToStorage('ent_inv_warehouses', updatedWhs);
    return { warehouses: updatedWhs };
  }),

  updateWarehouse: (id, whFields) => set((state) => {
    let updatedWhs = state.warehouses.map((w) => (w.id === id ? { ...w, ...whFields } : w));
    if (whFields.isDefault) {
      updatedWhs = updatedWhs.map((w) => (w.id !== id ? { ...w, isDefault: false } : w));
    }
    saveToStorage('ent_inv_warehouses', updatedWhs);
    return { warehouses: updatedWhs };
  }),

  deleteWarehouse: (id) => set((state) => {
    const updated = state.warehouses.filter((w) => w.id !== id);
    saveToStorage('ent_inv_warehouses', updated);
    return { warehouses: updated };
  }),

  // Stock Actions
  updateStockLevel: (id, updates) => set((state) => {
    const updated = state.stock.map((s) => s.id === id ? { ...s, ...updates } : s);
    saveToStorage('ent_inv_stock', updated);
    return { stock: updated };
  }),

  adjustStockLevel: (warehouseId, sku, type, change, notes = '', reference = '') => set((state) => {
    const movements = [...state.stockMovements];
    const stockItems = state.stock.map((item) => {
      if (item.warehouseId === warehouseId && item.sku === sku) {
        let { available, reserved, damaged, incoming, outgoing } = item;

        if (type === 'STOCK_IN') available += change;
        else if (type === 'STOCK_OUT') available -= change;
        else if (type === 'DAMAGE') {
          available -= change;
          damaged += change;
        } else if (type === 'ADJUSTMENT') available += change; // positive or negative
        else if (type === 'RESERVE') {
          available -= change;
          reserved += change;
        } else if (type === 'RELEASE') {
          available += change;
          reserved -= change;
        }

        // Add to history log
        movements.push({
          id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          sku,
          productName: item.productName,
          type: type as any,
          warehouseId,
          warehouseName: item.warehouseName,
          quantity: change,
          reference,
          notes,
          timestamp: new Date().toISOString(),
        });

        return { ...item, available, reserved, damaged, incoming, outgoing };
      }
      return item;
    });

    saveToStorage('ent_inv_stock', stockItems);
    saveToStorage('ent_inv_movements', movements);
    return { stock: stockItems, stockMovements: movements };
  }),

  // Movements Actions
  addStockMovement: (mov) => set((state) => {
    const newMov: StockMovement = {
      ...mov,
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newMov, ...state.stockMovements];
    saveToStorage('ent_inv_movements', updated);
    return { stockMovements: updated };
  }),

  // Purchase Orders Actions
  addPurchaseOrder: (po) => set((state) => {
    const newPo: PurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${String(state.purchaseOrders.length + 1).padStart(4, '0')}`,
      approvalWorkflow: {},
      createdAt: new Date().toISOString(),
    };
    const updated = [newPo, ...state.purchaseOrders];
    saveToStorage('ent_inv_purchase_orders', updated);
    return { purchaseOrders: updated };
  }),

  updatePurchaseOrderStatus: (id, status, notes = '', approver = '') => set((state) => {
    const updated = state.purchaseOrders.map((po) => {
      if (po.id === id) {
        const workflow = { ...po.approvalWorkflow };
        if (status === 'APPROVED' || status === 'CANCELLED') {
          workflow.approver = approver;
          workflow.timestamp = new Date().toISOString();
          workflow.notes = notes;
        }
        return { ...po, status, approvalWorkflow: workflow };
      }
      return po;
    });
    saveToStorage('ent_inv_purchase_orders', updated);
    return { purchaseOrders: updated };
  }),

  // GRN Actions
  addGRN: (grn) => set((state) => {
    const newGrn: GRN = {
      ...grn,
      id: `grn-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Auto update the purchase order items' received quantity
    const updatedPos = state.purchaseOrders.map((po) => {
      if (po.id === grn.poId) {
        const updatedItems = po.items.map((poItem) => {
          const grnMatched = grn.items.find(gi => gi.sku === poItem.sku);
          if (grnMatched) {
            return {
              ...poItem,
              receivedQty: poItem.receivedQty + grnMatched.acceptedQty,
            };
          }
          return poItem;
        });

        // Determine PO final status
        const isFullyReceived = updatedItems.every(item => item.receivedQty >= item.quantity);
        const hasReceivedSome = updatedItems.some(item => item.receivedQty > 0);
        const nextStatus = isFullyReceived ? ('RECEIVED' as const) : hasReceivedSome ? ('PARTIALLY_RECEIVED' as const) : po.status;

        return { ...po, items: updatedItems, status: nextStatus };
      }
      return po;
    });

    // Auto-credit/update Stock Level quantities based on GRN accepted quantities!
    const updatedStock = [...state.stock];
    const movements = [...state.stockMovements];

    grn.items.forEach((gItem) => {
      const whObj = state.warehouses.find(w => w.name === grn.warehouseName);
      const whId = whObj?.id || 'wh-1';

      const matchIndex = updatedStock.findIndex(s => s.sku === gItem.sku && s.warehouseId === whId);
      if (matchIndex !== -1) {
        updatedStock[matchIndex].available += gItem.acceptedQty;
        if (gItem.batchNumber) {
          updatedStock[matchIndex].batchNumber = gItem.batchNumber;
        }
        // Save serials if present
        if (gItem.serialNumbers && gItem.serialNumbers.length > 0) {
          updatedStock[matchIndex].serialNumbers = [
            ...(updatedStock[matchIndex].serialNumbers || []),
            ...gItem.serialNumbers,
          ];
        }
      } else {
        // Create new SKU node inside this warehouse
        updatedStock.push({
          id: `st-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          sku: gItem.sku,
          productName: gItem.productName,
          category: 'Unclassified',
          brand: 'General',
          barcode: gItem.sku.replace('SKU-', ''),
          warehouseId: whId,
          warehouseName: grn.warehouseName,
          available: gItem.acceptedQty,
          reserved: 0,
          damaged: gItem.rejectedQty,
          incoming: 0,
          outgoing: 0,
          batchNumber: gItem.batchNumber,
          serialNumbers: gItem.serialNumbers,
        });
      }

      // Record inward movement history
      movements.push({
        id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sku: gItem.sku,
        productName: gItem.productName,
        type: 'STOCK_IN',
        warehouseId: whId,
        warehouseName: grn.warehouseName,
        quantity: gItem.acceptedQty,
        reference: grn.grnNumber,
        notes: `PO items check-in. Rejected forklift damage: ${gItem.rejectedQty}.`,
        timestamp: new Date().toISOString(),
      });
    });

    const updatedGrns = [newGrn, ...state.grns];
    saveToStorage('ent_inv_grns', updatedGrns);
    saveToStorage('ent_inv_purchase_orders', updatedPos);
    saveToStorage('ent_inv_stock', updatedStock);
    saveToStorage('ent_inv_movements', movements);

    return {
      grns: updatedGrns,
      purchaseOrders: updatedPos,
      stock: updatedStock,
      stockMovements: movements,
    };
  }),

  // Transfers CRUD
  addStockTransfer: (tr) => set((state) => {
    const num = `TR-2026-${String(state.stockTransfers.length + 1).padStart(4, '0')}`;
    const newTr: StockTransfer = {
      ...tr,
      id: `tr-${Date.now()}`,
      transferNumber: num,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTr, ...state.stockTransfers];
    saveToStorage('ent_inv_transfers', updated);
    return { stockTransfers: updated };
  }),

  updateTransferStatus: (id, status) => set((state) => {
    const updatedStock = [...state.stock];
    const movements = [...state.stockMovements];

    const updatedTransfers = state.stockTransfers.map((tr) => {
      if (tr.id === id) {
        // If completing, actually perform the stock deduct and add
        if (status === 'COMPLETED' && tr.status !== 'COMPLETED') {
          tr.items.forEach((item) => {
            // Deduct from origin warehouse
            const originIndex = updatedStock.findIndex(s => s.sku === item.sku && s.warehouseId === tr.fromWarehouseId);
            if (originIndex !== -1) {
              updatedStock[originIndex].available -= item.quantity;
            }

            // Credit to destination warehouse
            const destIndex = updatedStock.findIndex(s => s.sku === item.sku && s.warehouseId === tr.toWarehouseId);
            if (destIndex !== -1) {
              updatedStock[destIndex].available += item.quantity;
            } else {
              // Create stock row
              updatedStock.push({
                id: `st-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                sku: item.sku,
                productName: item.productName,
                category: 'Transferred',
                brand: 'General',
                barcode: item.sku.replace('SKU-', ''),
                warehouseId: tr.toWarehouseId,
                warehouseName: tr.toWarehouseName,
                available: item.quantity,
                reserved: 0,
                damaged: 0,
                incoming: 0,
                outgoing: 0,
              });
            }

            // Log both historical movements
            movements.push({
              id: `mov-deduct-${Date.now()}`,
              sku: item.sku,
              productName: item.productName,
              type: 'TRANSFER',
              warehouseId: tr.fromWarehouseId,
              warehouseName: tr.fromWarehouseName,
              quantity: -item.quantity,
              reference: tr.transferNumber,
              notes: `Transferred to ${tr.toWarehouseName}`,
              timestamp: new Date().toISOString(),
            });

            movements.push({
              id: `mov-credit-${Date.now()}`,
              sku: item.sku,
              productName: item.productName,
              type: 'TRANSFER',
              warehouseId: tr.toWarehouseId,
              warehouseName: tr.toWarehouseName,
              quantity: item.quantity,
              reference: tr.transferNumber,
              notes: `Received transfer from ${tr.fromWarehouseName}`,
              timestamp: new Date().toISOString(),
            });
          });
        }
        return { ...tr, status };
      }
      return tr;
    });

    saveToStorage('ent_inv_transfers', updatedTransfers);
    saveToStorage('ent_inv_stock', updatedStock);
    saveToStorage('ent_inv_movements', movements);

    return {
      stockTransfers: updatedTransfers,
      stock: updatedStock,
      stockMovements: movements,
    };
  }),

  // Adjustments CRUD
  addStockAdjustment: (adj) => set((state) => {
    const num = `ADJ-2026-${String(state.stockAdjustments.length + 1).padStart(4, '0')}`;
    const newAdj: StockAdjustment = {
      ...adj,
      id: `adj-${Date.now()}`,
      adjustmentNumber: num,
      createdAt: new Date().toISOString(),
    };
    const updated = [newAdj, ...state.stockAdjustments];
    saveToStorage('ent_inv_adjustments', updated);
    return { stockAdjustments: updated };
  }),

  updateAdjustmentStatus: (id, status, approvedBy = '') => set((state) => {
    const updatedStock = [...state.stock];
    const movements = [...state.stockMovements];

    const updatedAdjs = state.stockAdjustments.map((adj) => {
      if (adj.id === id) {
        if (status === 'APPROVED' && adj.status !== 'APPROVED') {
          // Commit stock value change!
          const matchIndex = updatedStock.findIndex(s => s.sku === adj.sku && s.warehouseId === adj.warehouseId);
          if (matchIndex !== -1) {
            updatedStock[matchIndex].available += adj.qtyChange;
          }

          // Record historical audit movement
          movements.push({
            id: `mov-${Date.now()}`,
            sku: adj.sku,
            productName: adj.productName,
            type: 'ADJUSTMENT',
            warehouseId: adj.warehouseId,
            warehouseName: adj.warehouseName,
            quantity: adj.qtyChange,
            reference: adj.adjustmentNumber,
            notes: `Approved Stock Adjustment: ${adj.reason}`,
            timestamp: new Date().toISOString(),
          });
        }
        return { ...adj, status, approvedBy };
      }
      return adj;
    });

    saveToStorage('ent_inv_adjustments', updatedAdjs);
    saveToStorage('ent_inv_stock', updatedStock);
    saveToStorage('ent_inv_movements', movements);

    return {
      stockAdjustments: updatedAdjs,
      stock: updatedStock,
      stockMovements: movements,
    };
  }),

  // Suppliers CRUD
  addSupplier: (sup) => set((state) => {
    const newSup: Supplier = {
      ...sup,
      id: `sup-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...state.suppliers, newSup];
    saveToStorage('ent_inv_suppliers', updated);
    return { suppliers: updated };
  }),

  updateSupplier: (id, supFields) => set((state) => {
    const updated = state.suppliers.map((s) => (s.id === id ? { ...s, ...supFields } : s));
    saveToStorage('ent_inv_suppliers', updated);
    return { suppliers: updated };
  }),

  deleteSupplier: (id) => set((state) => {
    const updated = state.suppliers.filter((s) => s.id !== id);
    saveToStorage('ent_inv_suppliers', updated);
    return { suppliers: updated };
  }),

  // Barcodes Actions
  addBarcode: (bc) => set((state) => {
    const newBc: BarcodeRecord = {
      ...bc,
      id: `bc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...state.barcodes, newBc];
    saveToStorage('ent_inv_barcodes', updated);
    return { barcodes: updated };
  }),

  deleteBarcode: (id) => set((state) => {
    const updated = state.barcodes.filter((b) => b.id !== id);
    saveToStorage('ent_inv_barcodes', updated);
    return { barcodes: updated };
  }),

  // Batches Actions
  addBatch: (bat) => set((state) => {
    const newBat: BatchRecord = {
      ...bat,
      id: `bat-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...state.batches, newBat];
    saveToStorage('ent_inv_batches', updated);
    return { batches: updated };
  }),

  updateBatchStatus: (id, status) => set((state) => {
    const updated = state.batches.map((b) => (b.id === id ? { ...b, status } : b));
    saveToStorage('ent_inv_batches', updated);
    return { batches: updated };
  }),

  // Serials Actions
  addSerialNumber: (sn) => set((state) => {
    const newSn: SerialNumberRecord = {
      ...sn,
      id: `sn-${Date.now()}`,
    };
    const updated = [...state.serialNumbers, newSn];
    saveToStorage('ent_inv_serials', updated);
    return { serialNumbers: updated };
  }),

  updateSerialStatus: (id, status, notes = '') => set((state) => {
    const updated = state.serialNumbers.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          status,
          history: [
            ...s.history,
            { action: `Status changed to ${status}`, date: new Date().toISOString(), notes }
          ]
        };
      }
      return s;
    });
    saveToStorage('ent_inv_serials', updated);
    return { serialNumbers: updated };
  }),

  // Cycle Counts CRUD
  addCycleCount: (cc) => set((state) => {
    const num = `CC-2026-${String(state.cycleCounts.length + 1).padStart(4, '0')}`;
    const newCc: CycleCount = {
      ...cc,
      id: `cc-${Date.now()}`,
      countNumber: num,
      createdAt: new Date().toISOString(),
    };
    const updated = [newCc, ...state.cycleCounts];
    saveToStorage('ent_inv_cycle_counts', updated);
    return { cycleCounts: updated };
  }),

  completeCycleCount: (id, items, accuracy, auditedBy) => set((state) => {
    const updatedStock = [...state.stock];
    const movements = [...state.stockMovements];

    const activeCc = state.cycleCounts.find((cc) => cc.id === id);
    const warehouseId = activeCc?.warehouseId || (items[0] ? (state.stock.find(s => s.sku === items[0].sku)?.warehouseId || '') : '');
    const warehouseName = activeCc?.warehouseName || (items[0] ? (state.stock.find(s => s.sku === items[0].sku)?.warehouseName || '') : '');
    const countNumber = activeCc?.countNumber || `AUD-2026-${id.slice(-4)}`;

    items.forEach((item) => {
      const systemQty = item.systemQty ?? item.expectedQty ?? 0;
      const variance = item.countedQty - systemQty;
      if (variance !== 0) {
        const stockIndex = updatedStock.findIndex(
          (s) => s.sku === item.sku && (warehouseId ? s.warehouseId === warehouseId : true)
        );
        if (stockIndex !== -1) {
          updatedStock[stockIndex].available = item.countedQty;

          movements.push({
            id: `mov-${Date.now()}-${item.sku}`,
            sku: item.sku,
            productName: item.productName,
            type: 'ADJUSTMENT',
            warehouseId: updatedStock[stockIndex].warehouseId,
            warehouseName: updatedStock[stockIndex].warehouseName,
            quantity: variance,
            reference: countNumber,
            notes: `Cycle Count Reconcile. Audited by ${auditedBy}. Accuracy: ${accuracy}%.`,
            timestamp: new Date().toISOString(),
          });
        }
      }
    });

    let updatedCcList = [...state.cycleCounts];
    const matchIndex = updatedCcList.findIndex((cc) => cc.id === id);

    const ccRecord: CycleCount = {
      id,
      countNumber,
      warehouseId,
      warehouseName,
      status: 'COMPLETED',
      items,
      notes: activeCc?.notes || 'Standard Physical Verification',
      createdAt: activeCc?.createdAt || new Date().toISOString(),
      accuracyScore: accuracy,
      approvedBy: auditedBy,
    };

    if (matchIndex !== -1) {
      updatedCcList[matchIndex] = ccRecord;
    } else {
      updatedCcList = [ccRecord, ...updatedCcList];
    }

    saveToStorage('ent_inv_cycle_counts', updatedCcList);
    saveToStorage('ent_inv_stock', updatedStock);
    saveToStorage('ent_inv_movements', movements);

    return {
      cycleCounts: updatedCcList,
      stock: updatedStock,
      stockMovements: movements,
    };
  }),

  updateCycleCountStatus: (id, status, countItems) => set((state) => {
    const updated = state.cycleCounts.map((cc) => {
      if (cc.id === id) {
        const nextItems = countItems || cc.items;
        return {
          ...cc,
          status,
          items: nextItems.map(item => ({
            ...item,
            variance: item.countedQty - (item.systemQty ?? item.expectedQty ?? 0),
          })),
        };
      }
      return cc;
    });
    saveToStorage('ent_inv_cycle_counts', updated);
    return { cycleCounts: updated };
  }),

  approveCycleVariance: (id, approvedBy) => set((state) => {
    const updatedStock = [...state.stock];
    const movements = [...state.stockMovements];

    const updatedCounts = state.cycleCounts.map((cc) => {
      if (cc.id === id) {
        // Adjust stock level directly to match verified counts!
        cc.items.forEach((item) => {
          const varVal = item.variance ?? 0;
          if (varVal !== 0) {
            const index = updatedStock.findIndex(s => s.sku === item.sku && s.warehouseId === cc.warehouseId);
            if (index !== -1) {
              updatedStock[index].available += varVal;
            }

            movements.push({
              id: `mov-${Date.now()}`,
              sku: item.sku,
              productName: item.productName,
              type: 'ADJUSTMENT',
              warehouseId: cc.warehouseId,
              warehouseName: cc.warehouseName,
              quantity: varVal,
              reference: cc.countNumber,
              notes: `Cycle Count variance adjustment. Approved by ${approvedBy}.`,
              timestamp: new Date().toISOString(),
            });
          }
        });

        return { ...cc, isVarianceApproved: true };
      }
      return cc;
    });

    saveToStorage('ent_inv_cycle_counts', updatedCounts);
    saveToStorage('ent_inv_stock', updatedStock);
    saveToStorage('ent_inv_movements', movements);

    return {
      cycleCounts: updatedCounts,
      stock: updatedStock,
      stockMovements: movements,
    };
  }),
}));
