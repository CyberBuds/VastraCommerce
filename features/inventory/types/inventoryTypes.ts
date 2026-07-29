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
  capacity: number; // in sq ft or pallet count
  status: 'active' | 'inactive';
  isDefault: boolean;
  totalSKUs: number;
  currentCapacityPercent: number;
  createdAt: string;
}

export interface StockItem {
  id: string;
  sku: string;
  productName: string;
  barcode: string;
  category: string;
  brand: string;
  warehouseId: string;
  warehouseName: string;
  availableQty: number;
  reservedQty: number;
  damagedQty: number;
  incomingQty: number;
  outgoingQty: number;
  unitCost: number;
  totalValuation: number;
  reorderLevel: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstocked';
  lastRestocked: string;
}

export type MovementType =
  | 'stock_in'
  | 'stock_out'
  | 'transfer'
  | 'adjustment'
  | 'return'
  | 'damage'
  | 'lost'
  | 'expired'
  | 'manual';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  type: MovementType;
  quantity: number;
  referenceNo: string;
  reason: string;
  performedBy: string;
  timestamp: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  orderedQty: number;
  receivedQty: number;
  unitPrice: number;
  totalPrice: number;
}

export type POStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'partially_received'
  | 'received'
  | 'cancelled';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  expectedDeliveryDate: string;
  status: POStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
  taxAmount: number;
  grandTotal: number;
  approvalWorkflowStatus: 'pending' | 'approved_by_finance' | 'rejected';
  attachments: string[];
  notes: string;
  createdAt: string;
}

export interface GRNLineItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  orderedQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  rejectionReason?: string;
  batchNumber?: string;
  serialNumbers?: string[];
  qualityCheckStatus: 'passed' | 'failed' | 'conditional';
}

export interface GRN {
  id: string;
  grnNumber: string;
  poId: string;
  poNumber: string;
  supplierName: string;
  warehouseName: string;
  receivedDate: string;
  receivedBy: string;
  status: 'draft' | 'completed' | 'rejected';
  items: GRNLineItem[];
  totalAccepted: number;
  totalRejected: number;
  notes?: string;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  sourceWarehouseId: string;
  sourceWarehouseName: string;
  targetWarehouseId: string;
  targetWarehouseName: string;
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
  }[];
  status: 'draft' | 'pending_approval' | 'approved' | 'in_transit' | 'completed' | 'rejected';
  trackingNumber: string;
  requestedBy: string;
  approvedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  warehouseId: string;
  warehouseName: string;
  items: {
    productId: string;
    productName: string;
    sku: string;
    previousQty: number;
    newQty: number;
    adjustmentQty: number;
    type: 'increase' | 'decrease';
    reason: string;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  reasonCategory: 'cycle_count_discrepancy' | 'damage' | 'spoilage' | 'theft' | 'audit_reconciliation';
  totalAdjustmentValue: number;
  requestedBy: string;
  approvedBy?: string;
  attachments?: string[];
  createdAt: string;
}

export interface Supplier {
  id: string;
  code: string;
  companyName: string;
  gstNumber: string;
  panNumber: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  paymentTerms: string;
  rating: number; // 1-5
  status: 'active' | 'inactive';
  totalOrdersCount: number;
  totalSpent: number;
}

export interface BarcodeItem {
  id: string;
  sku: string;
  productName: string;
  barcodeValue: string;
  barcodeType: 'code128' | 'qr' | 'ean13';
  category: string;
  printQuantity: number;
  status: 'generated' | 'printed';
}

export interface BatchItem {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseName: string;
  mfgDate: string;
  expiryDate: string;
  quantity: number;
  status: 'active' | 'expiring_soon' | 'expired' | 'recalled';
}

export interface SerialNumberItem {
  id: string;
  serialNumber: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseName: string;
  currentStatus: 'available' | 'reserved' | 'sold' | 'transferred' | 'damaged';
  assignedDate: string;
  history: {
    date: string;
    action: string;
    user: string;
  }[];
}

export interface ExpiryAlert {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  batchNumber: string;
  warehouseName: string;
  expiryDate: string;
  daysToExpiry: number;
  quantity: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface CycleCount {
  id: string;
  countNumber: string;
  warehouseId: string;
  warehouseName: string;
  scheduledDate: string;
  assignedEmployee: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'approved';
  varianceItemsCount: number;
  varianceValue: number;
  approvedBy?: string;
  createdAt: string;
}

export interface InventoryValuation {
  valuationMethod: 'FIFO' | 'LIFO' | 'Weighted Average';
  totalStockValue: number;
  totalUnits: number;
  inventoryCost: number;
  estimatedProfit: number;
  categoryBreakdown: {
    category: string;
    value: number;
    count: number;
  }[];
}

export interface InventoryStats {
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  damagedStock: number;
  incomingStock: number;
  outgoingStock: number;
  warehouseCount: number;
  supplierCount: number;
  inventoryValue: number;
  todaysStockMovements: number;
}
