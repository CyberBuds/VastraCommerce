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

// Initial Mock Data
export const mockWarehouses: Warehouse[] = [
  {
    id: 'wh-001',
    code: 'WH-CENTRAL-01',
    name: 'Central Logistics Hub',
    manager: 'Robert Vance',
    contactPerson: 'David Miller',
    email: 'robert.vance@enterprise-logistics.io',
    phone: '+1 (555) 019-2834',
    country: 'United States',
    state: 'Illinois',
    city: 'Chicago',
    address: '4200 Logistics Parkway, Suite 100',
    capacity: 120000,
    status: 'active',
    isDefault: true,
    totalSKUs: 3420,
    currentCapacityPercent: 78,
    createdAt: '2024-01-15',
  },
  {
    id: 'wh-002',
    code: 'WH-WEST-02',
    name: 'West Coast Distribution Center',
    manager: 'Sarah Jenkins',
    contactPerson: 'Alex Rivera',
    email: 'sarah.j@enterprise-logistics.io',
    phone: '+1 (555) 948-2201',
    country: 'United States',
    state: 'California',
    city: 'Ontario',
    address: '880 Silicon Blvd',
    capacity: 85000,
    status: 'active',
    isDefault: false,
    totalSKUs: 2150,
    currentCapacityPercent: 62,
    createdAt: '2024-03-10',
  },
  {
    id: 'wh-003',
    code: 'WH-EAST-03',
    name: 'East Coast Fulfillment Depot',
    manager: 'Marcus Sterling',
    contactPerson: 'Elena Rostova',
    email: 'marcus.s@enterprise-logistics.io',
    phone: '+1 (555) 432-8811',
    country: 'United States',
    state: 'New Jersey',
    city: 'Newark',
    address: '150 Port Newark Street',
    capacity: 95000,
    status: 'active',
    isDefault: false,
    totalSKUs: 2890,
    currentCapacityPercent: 88,
    createdAt: '2024-05-22',
  },
  {
    id: 'wh-004',
    code: 'WH-EU-04',
    name: 'European Gateway Warehouse',
    manager: 'Hans Gruber',
    contactPerson: 'Sophie Dubois',
    email: 'hans.g@enterprise-logistics.eu',
    phone: '+49 30 92837410',
    country: 'Germany',
    state: 'Bavaria',
    city: 'Munich',
    address: 'Flughafenallee 12',
    capacity: 60000,
    status: 'active',
    isDefault: false,
    totalSKUs: 1450,
    currentCapacityPercent: 54,
    createdAt: '2024-08-01',
  },
];

export const mockStockItems: StockItem[] = [
  {
    id: 'stk-101',
    sku: 'SKU-ENT-SERVER-X9',
    productName: 'Enterprise Rack Server X9000',
    barcode: '8901234567891',
    category: 'Hardware & Infrastructure',
    brand: 'TechPro',
    warehouseId: 'wh-001',
    warehouseName: 'Central Logistics Hub',
    availableQty: 142,
    reservedQty: 25,
    damagedQty: 3,
    incomingQty: 50,
    outgoingQty: 18,
    unitCost: 2499.00,
    totalValuation: 354858.00,
    reorderLevel: 30,
    status: 'in_stock',
    lastRestocked: '2026-07-20',
  },
  {
    id: 'stk-102',
    sku: 'SKU-OPTIC-SFP-10G',
    productName: '10G Fiber Optic SFP+ Transceiver',
    barcode: '8901234567892',
    category: 'Networking',
    brand: 'Cisco-Compat',
    warehouseId: 'wh-001',
    warehouseName: 'Central Logistics Hub',
    availableQty: 12,
    reservedQty: 8,
    damagedQty: 0,
    incomingQty: 200,
    outgoingQty: 5,
    unitCost: 45.00,
    totalValuation: 540.00,
    reorderLevel: 50,
    status: 'low_stock',
    lastRestocked: '2026-06-15',
  },
  {
    id: 'stk-103',
    sku: 'SKU-NVME-2TB-GEN4',
    productName: '2TB PCIe Gen4 Enterprise NVMe SSD',
    barcode: '8901234567893',
    category: 'Storage Media',
    brand: 'Samsung Enterprise',
    warehouseId: 'wh-002',
    warehouseName: 'West Coast Distribution Center',
    availableQty: 0,
    reservedQty: 0,
    damagedQty: 2,
    incomingQty: 100,
    outgoingQty: 0,
    unitCost: 185.00,
    totalValuation: 0.00,
    reorderLevel: 25,
    status: 'out_of_stock',
    lastRestocked: '2026-05-10',
  },
  {
    id: 'stk-104',
    sku: 'SKU-UPS-3000VA-RACK',
    productName: 'Smart UPS 3000VA Online Rackmount',
    barcode: '8901234567894',
    category: 'Power Management',
    brand: 'APC System',
    warehouseId: 'wh-003',
    warehouseName: 'East Coast Fulfillment Depot',
    availableQty: 88,
    reservedQty: 12,
    damagedQty: 1,
    incomingQty: 0,
    outgoingQty: 10,
    unitCost: 1120.00,
    totalValuation: 98560.00,
    reorderLevel: 15,
    status: 'in_stock',
    lastRestocked: '2026-07-22',
  },
];

export const mockMovements: StockMovement[] = [
  {
    id: 'mov-901',
    productId: 'stk-101',
    productName: 'Enterprise Rack Server X9000',
    sku: 'SKU-ENT-SERVER-X9',
    warehouseId: 'wh-001',
    warehouseName: 'Central Logistics Hub',
    type: 'stock_in',
    quantity: 50,
    referenceNo: 'GRN-2026-004',
    reason: 'Received PO-2026-88',
    performedBy: 'David Miller',
    timestamp: '2026-07-26 14:30',
  },
  {
    id: 'mov-902',
    productId: 'stk-102',
    productName: '10G Fiber Optic SFP+ Transceiver',
    sku: 'SKU-OPTIC-SFP-10G',
    warehouseId: 'wh-001',
    warehouseName: 'Central Logistics Hub',
    type: 'transfer',
    quantity: -10,
    referenceNo: 'TRF-8821',
    reason: 'Inter-warehouse transfer to West Coast',
    performedBy: 'Sarah Jenkins',
    timestamp: '2026-07-25 11:15',
  },
  {
    id: 'mov-903',
    productId: 'stk-104',
    productName: 'Smart UPS 3000VA Online Rackmount',
    sku: 'SKU-UPS-3000VA-RACK',
    warehouseId: 'wh-003',
    warehouseName: 'East Coast Fulfillment Depot',
    type: 'adjustment',
    quantity: -1,
    referenceNo: 'ADJ-1029',
    reason: 'Battery terminal damaged during transit',
    performedBy: 'Marcus Sterling',
    timestamp: '2026-07-24 16:45',
  },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-2026-88',
    poNumber: 'PO-2026-0088',
    supplierId: 'sup-01',
    supplierName: 'Global Microchips Inc.',
    warehouseId: 'wh-001',
    warehouseName: 'Central Logistics Hub',
    expectedDeliveryDate: '2026-08-05',
    status: 'approved',
    items: [
      {
        id: 'poi-1',
        productId: 'stk-101',
        productName: 'Enterprise Rack Server X9000',
        sku: 'SKU-ENT-SERVER-X9',
        orderedQty: 50,
        receivedQty: 50,
        unitPrice: 2400.00,
        totalPrice: 120000.00,
      },
    ],
    totalAmount: 120000.00,
    taxAmount: 21600.00,
    grandTotal: 141600.00,
    approvalWorkflowStatus: 'approved_by_finance',
    attachments: ['PO_Quote_Approved.pdf'],
    notes: 'Urgent Q3 datacenter expansion batch',
    createdAt: '2026-07-18',
  },
  {
    id: 'po-2026-89',
    poNumber: 'PO-2026-0089',
    supplierId: 'sup-02',
    supplierName: 'AeroOptics Fiber Solutions',
    warehouseId: 'wh-001',
    warehouseName: 'Central Logistics Hub',
    expectedDeliveryDate: '2026-08-01',
    status: 'pending_approval',
    items: [
      {
        id: 'poi-2',
        productId: 'stk-102',
        productName: '10G Fiber Optic SFP+ Transceiver',
        sku: 'SKU-OPTIC-SFP-10G',
        orderedQty: 200,
        receivedQty: 0,
        unitPrice: 42.50,
        totalPrice: 8500.00,
      },
    ],
    totalAmount: 8500.00,
    taxAmount: 1530.00,
    grandTotal: 10030.00,
    approvalWorkflowStatus: 'pending',
    attachments: ['Vendor_Invoice_Draft.pdf'],
    notes: 'Low stock replenishment',
    createdAt: '2026-07-25',
  },
];

export const mockGRNs: GRN[] = [
  {
    id: 'grn-501',
    grnNumber: 'GRN-2026-004',
    poId: 'po-2026-88',
    poNumber: 'PO-2026-0088',
    supplierName: 'Global Microchips Inc.',
    warehouseName: 'Central Logistics Hub',
    receivedDate: '2026-07-26',
    receivedBy: 'David Miller',
    status: 'completed',
    items: [
      {
        id: 'grni-1',
        productId: 'stk-101',
        productName: 'Enterprise Rack Server X9000',
        sku: 'SKU-ENT-SERVER-X9',
        orderedQty: 50,
        receivedQty: 50,
        acceptedQty: 49,
        rejectedQty: 1,
        rejectionReason: 'Chassis dent on outer panel',
        batchNumber: 'BAT-2026-07-SRV',
        serialNumbers: ['SN-SRV-901', 'SN-SRV-902', 'SN-SRV-903'],
        qualityCheckStatus: 'passed',
      },
    ],
    totalAccepted: 49,
    totalRejected: 1,
    notes: 'Inspected with QA protocol level 2',
  },
];

export const mockStockTransfers: StockTransfer[] = [
  {
    id: 'trf-8821',
    transferNumber: 'TRF-2026-8821',
    sourceWarehouseId: 'wh-001',
    sourceWarehouseName: 'Central Logistics Hub',
    targetWarehouseId: 'wh-002',
    targetWarehouseName: 'West Coast Distribution Center',
    items: [
      {
        productId: 'stk-102',
        productName: '10G Fiber Optic SFP+ Transceiver',
        sku: 'SKU-OPTIC-SFP-10G',
        quantity: 10,
      },
    ],
    status: 'in_transit',
    trackingNumber: 'TRK-FEDEX-998120',
    requestedBy: 'Sarah Jenkins',
    approvedBy: 'Robert Vance',
    notes: 'Balancing stock for West Coast tech client order',
    createdAt: '2026-07-25',
  },
];

export const mockStockAdjustments: StockAdjustment[] = [
  {
    id: 'adj-1029',
    adjustmentNumber: 'ADJ-2026-1029',
    warehouseId: 'wh-003',
    warehouseName: 'East Coast Fulfillment Depot',
    items: [
      {
        productId: 'stk-104',
        productName: 'Smart UPS 3000VA Online Rackmount',
        sku: 'SKU-UPS-3000VA-RACK',
        previousQty: 89,
        newQty: 88,
        adjustmentQty: -1,
        type: 'decrease',
        reason: 'Water drip damage during severe weather storm',
      },
    ],
    status: 'approved',
    reasonCategory: 'damage',
    totalAdjustmentValue: -1120.00,
    requestedBy: 'Marcus Sterling',
    approvedBy: 'Robert Vance',
    attachments: ['Damaged_Unit_Photo.jpg'],
    createdAt: '2026-07-24',
  },
];

export const mockSuppliers: Supplier[] = [
  {
    id: 'sup-01',
    code: 'SUP-GLOBAL-01',
    companyName: 'Global Microchips Inc.',
    gstNumber: '27AAACG1234H1Z5',
    panNumber: 'AAACG1234H',
    email: 'orders@globalmicrochips.com',
    phone: '+1 (800) 555-9000',
    address: '100 Silicon Way, San Jose, CA 95134',
    contactPerson: 'Gregory House',
    bankDetails: {
      bankName: 'JPMorgan Chase',
      accountNumber: '99821034821',
      ifscCode: 'CHASUS33',
      branch: 'San Jose HQ',
    },
    paymentTerms: 'Net 30',
    rating: 4.8,
    status: 'active',
    totalOrdersCount: 42,
    totalSpent: 1250000.00,
  },
  {
    id: 'sup-02',
    code: 'SUP-AERO-02',
    companyName: 'AeroOptics Fiber Solutions',
    gstNumber: '29BBBCA9876K1Z9',
    panNumber: 'BBBCA9876K',
    email: 'sales@aerooptics.io',
    phone: '+1 (800) 444-1234',
    address: '500 Photonics Ave, Austin, TX 78701',
    contactPerson: 'Amanda Waller',
    bankDetails: {
      bankName: 'Bank of America',
      accountNumber: '4410293811',
      ifscCode: 'BOFAUS66',
      branch: 'Austin Central',
    },
    paymentTerms: 'Net 15',
    rating: 4.5,
    status: 'active',
    totalOrdersCount: 18,
    totalSpent: 340000.00,
  },
];

export const mockBarcodes: BarcodeItem[] = [
  {
    id: 'bar-101',
    sku: 'SKU-ENT-SERVER-X9',
    productName: 'Enterprise Rack Server X9000',
    barcodeValue: '8901234567891',
    barcodeType: 'code128',
    category: 'Hardware & Infrastructure',
    printQuantity: 50,
    status: 'printed',
  },
  {
    id: 'bar-102',
    sku: 'SKU-OPTIC-SFP-10G',
    productName: '10G Fiber Optic SFP+ Transceiver',
    barcodeValue: '8901234567892',
    barcodeType: 'qr',
    category: 'Networking',
    printQuantity: 200,
    status: 'generated',
  },
];

export const mockBatches: BatchItem[] = [
  {
    id: 'bat-001',
    batchNumber: 'BAT-2026-07-SRV',
    productId: 'stk-101',
    productName: 'Enterprise Rack Server X9000',
    sku: 'SKU-ENT-SERVER-X9',
    warehouseName: 'Central Logistics Hub',
    mfgDate: '2026-06-01',
    expiryDate: '2031-06-01',
    quantity: 49,
    status: 'active',
  },
  {
    id: 'bat-002',
    batchNumber: 'BAT-2026-03-NVME',
    productId: 'stk-103',
    productName: '2TB PCIe Gen4 Enterprise NVMe SSD',
    sku: 'SKU-NVME-2TB-GEN4',
    warehouseName: 'West Coast Distribution Center',
    mfgDate: '2024-08-10',
    expiryDate: '2026-08-10',
    quantity: 15,
    status: 'expiring_soon',
  },
];

export const mockSerialNumbers: SerialNumberItem[] = [
  {
    id: 'ser-101',
    serialNumber: 'SN-SRV-2026-9001',
    productId: 'stk-101',
    productName: 'Enterprise Rack Server X9000',
    sku: 'SKU-ENT-SERVER-X9',
    warehouseName: 'Central Logistics Hub',
    currentStatus: 'available',
    assignedDate: '2026-07-26',
    history: [
      { date: '2026-07-26', action: 'GRN Received & QC Passed', user: 'David Miller' },
    ],
  },
  {
    id: 'ser-102',
    serialNumber: 'SN-SRV-2026-9002',
    productId: 'stk-101',
    productName: 'Enterprise Rack Server X9000',
    sku: 'SKU-ENT-SERVER-X9',
    warehouseName: 'Central Logistics Hub',
    currentStatus: 'reserved',
    assignedDate: '2026-07-26',
    history: [
      { date: '2026-07-26', action: 'GRN Received', user: 'David Miller' },
      { date: '2026-07-27', action: 'Reserved for PO-2026-0088 client delivery', user: 'Robert Vance' },
    ],
  },
];

export const mockExpiryAlerts: ExpiryAlert[] = [
  {
    id: 'exp-01',
    productId: 'stk-103',
    productName: 'Thermal Paste Compound - Enterprise Grade',
    sku: 'SKU-THERM-PASTE-100G',
    batchNumber: 'BAT-2024-PASTE',
    warehouseName: 'West Coast Distribution Center',
    expiryDate: '2026-08-12',
    daysToExpiry: 16,
    quantity: 45,
    riskLevel: 'critical',
  },
  {
    id: 'exp-02',
    productId: 'stk-105',
    productName: 'Lithium UPS Replacement Battery Pack',
    sku: 'SKU-BAT-LITH-3000',
    batchNumber: 'BAT-2023-BAT-B',
    warehouseName: 'East Coast Fulfillment Depot',
    expiryDate: '2026-09-05',
    daysToExpiry: 40,
    quantity: 12,
    riskLevel: 'high',
  },
];

export const mockCycleCounts: CycleCount[] = [
  {
    id: 'cc-901',
    countNumber: 'CC-2026-Q3-01',
    warehouseId: 'wh-001',
    warehouseName: 'Central Logistics Hub',
    scheduledDate: '2026-08-01',
    assignedEmployee: 'David Miller',
    status: 'scheduled',
    varianceItemsCount: 0,
    varianceValue: 0,
    createdAt: '2026-07-20',
  },
  {
    id: 'cc-902',
    countNumber: 'CC-2026-Q2-04',
    warehouseId: 'wh-003',
    warehouseName: 'East Coast Fulfillment Depot',
    scheduledDate: '2026-07-15',
    assignedEmployee: 'Elena Rostova',
    status: 'completed',
    varianceItemsCount: 3,
    varianceValue: -450.00,
    approvedBy: 'Marcus Sterling',
    createdAt: '2026-07-10',
  },
];

// In-Memory Mutatable Data Store
let warehouses = [...mockWarehouses];
let stockItems = [...mockStockItems];
let stockMovements = [...mockMovements];
let purchaseOrders = [...mockPurchaseOrders];
let grns = [...mockGRNs];
let stockTransfers = [...mockStockTransfers];
let stockAdjustments = [...mockStockAdjustments];
let suppliers = [...mockSuppliers];
let barcodes = [...mockBarcodes];
let batches = [...mockBatches];
let serialNumbers = [...mockSerialNumbers];
let cycleCounts = [...mockCycleCounts];

export const inventoryApi = {
  // Stats
  getStats: async (): Promise<InventoryStats> => {
    return {
      totalStock: 14850,
      availableStock: 12400,
      reservedStock: 1850,
      lowStockCount: 14,
      outOfStockCount: 5,
      damagedStock: 42,
      incomingStock: 850,
      outgoingStock: 620,
      warehouseCount: warehouses.length,
      supplierCount: suppliers.length,
      inventoryValue: 2845000.00,
      todaysStockMovements: 128,
    };
  },

  // Warehouses
  getWarehouses: async (): Promise<Warehouse[]> => warehouses,
  getWarehouseById: async (id: string): Promise<Warehouse | undefined> =>
    warehouses.find((w) => w.id === id),
  createWarehouse: async (data: Omit<Warehouse, 'id' | 'totalSKUs' | 'currentCapacityPercent' | 'createdAt'>): Promise<Warehouse> => {
    const newWh: Warehouse = {
      ...data,
      id: `wh-${Date.now().toString().slice(-4)}`,
      totalSKUs: 0,
      currentCapacityPercent: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    warehouses = [newWh, ...warehouses];
    return newWh;
  },
  updateWarehouse: async (id: string, data: Partial<Warehouse>): Promise<Warehouse> => {
    warehouses = warehouses.map((w) => (w.id === id ? { ...w, ...data } : w));
    const updated = warehouses.find((w) => w.id === id);
    if (!updated) throw new Error('Warehouse not found');
    return updated;
  },
  deleteWarehouse: async (id: string): Promise<boolean> => {
    warehouses = warehouses.filter((w) => w.id !== id);
    return true;
  },

  // Stock
  getStockItems: async (filters?: { warehouseId?: string; status?: string }): Promise<StockItem[]> => {
    let result = [...stockItems];
    if (filters?.warehouseId) {
      result = result.filter((s) => s.warehouseId === filters.warehouseId);
    }
    if (filters?.status) {
      result = result.filter((s) => s.status === filters.status);
    }
    return result;
  },
  getStockItemById: async (id: string): Promise<StockItem | undefined> =>
    stockItems.find((s) => s.id === id),

  // Stock Movements
  getStockMovements: async (): Promise<StockMovement[]> => stockMovements,
  createStockMovement: async (data: Omit<StockMovement, 'id' | 'timestamp'>): Promise<StockMovement> => {
    const newMov: StockMovement = {
      ...data,
      id: `mov-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString(),
    };
    stockMovements = [newMov, ...stockMovements];
    return newMov;
  },

  // Purchase Orders
  getPurchaseOrders: async (): Promise<PurchaseOrder[]> => purchaseOrders,
  createPurchaseOrder: async (data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>): Promise<PurchaseOrder> => {
    const newPo: PurchaseOrder = {
      ...data,
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    purchaseOrders = [newPo, ...purchaseOrders];
    return newPo;
  },
  updatePOStatus: async (id: string, status: PurchaseOrder['status']): Promise<PurchaseOrder> => {
    purchaseOrders = purchaseOrders.map((p) => (p.id === id ? { ...p, status } : p));
    const po = purchaseOrders.find((p) => p.id === id);
    if (!po) throw new Error('PO not found');
    return po;
  },

  // GRN
  getGRNs: async (): Promise<GRN[]> => grns,
  createGRN: async (data: Omit<GRN, 'id' | 'grnNumber'>): Promise<GRN> => {
    const newGrn: GRN = {
      ...data,
      id: `grn-${Date.now()}`,
      grnNumber: `GRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    grns = [newGrn, ...grns];
    return newGrn;
  },

  // Transfers
  getTransfers: async (): Promise<StockTransfer[]> => stockTransfers,
  createTransfer: async (data: Omit<StockTransfer, 'id' | 'transferNumber' | 'createdAt'>): Promise<StockTransfer> => {
    const newTrf: StockTransfer = {
      ...data,
      id: `trf-${Date.now()}`,
      transferNumber: `TRF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    stockTransfers = [newTrf, ...stockTransfers];
    return newTrf;
  },
  updateTransferStatus: async (id: string, status: StockTransfer['status']): Promise<StockTransfer> => {
    stockTransfers = stockTransfers.map((t) => (t.id === id ? { ...t, status } : t));
    const trf = stockTransfers.find((t) => t.id === id);
    if (!trf) throw new Error('Transfer not found');
    return trf;
  },

  // Adjustments
  getAdjustments: async (): Promise<StockAdjustment[]> => stockAdjustments,
  createAdjustment: async (data: Omit<StockAdjustment, 'id' | 'adjustmentNumber' | 'createdAt'>): Promise<StockAdjustment> => {
    const newAdj: StockAdjustment = {
      ...data,
      id: `adj-${Date.now()}`,
      adjustmentNumber: `ADJ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    stockAdjustments = [newAdj, ...stockAdjustments];
    return newAdj;
  },

  // Suppliers
  getSuppliers: async (): Promise<Supplier[]> => suppliers,
  createSupplier: async (data: Omit<Supplier, 'id' | 'totalOrdersCount' | 'totalSpent'>): Promise<Supplier> => {
    const newSup: Supplier = {
      ...data,
      id: `sup-${Date.now()}`,
      totalOrdersCount: 0,
      totalSpent: 0,
    };
    suppliers = [newSup, ...suppliers];
    return newSup;
  },

  // Barcodes
  getBarcodes: async (): Promise<BarcodeItem[]> => barcodes,
  generateBarcode: async (sku: string, type: 'code128' | 'qr' | 'ean13'): Promise<BarcodeItem> => {
    const item = stockItems.find((s) => s.sku === sku);
    const newBarcode: BarcodeItem = {
      id: `bar-${Date.now()}`,
      sku,
      productName: item ? item.productName : 'Generic Inventory Item',
      barcodeValue: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      barcodeType: type,
      category: item ? item.category : 'General',
      printQuantity: 1,
      status: 'generated',
    };
    barcodes = [newBarcode, ...barcodes];
    return newBarcode;
  },

  // Batches
  getBatches: async (): Promise<BatchItem[]> => batches,

  // Serial Numbers
  getSerialNumbers: async (): Promise<SerialNumberItem[]> => serialNumbers,

  // Expiry Alerts
  getExpiryAlerts: async (): Promise<ExpiryAlert[]> => mockExpiryAlerts,

  // Cycle Counts
  getCycleCounts: async (): Promise<CycleCount[]> => cycleCounts,
  createCycleCount: async (data: Omit<CycleCount, 'id' | 'countNumber' | 'createdAt'>): Promise<CycleCount> => {
    const newCc: CycleCount = {
      ...data,
      id: `cc-${Date.now()}`,
      countNumber: `CC-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    cycleCounts = [newCc, ...cycleCounts];
    return newCc;
  },

  // Valuation
  getValuation: async (method: 'FIFO' | 'LIFO' | 'Weighted Average'): Promise<InventoryValuation> => {
    const totalVal = stockItems.reduce((acc, curr) => acc + curr.totalValuation, 0);
    const totalUnits = stockItems.reduce((acc, curr) => acc + curr.availableQty + curr.reservedQty, 0);
    return {
      valuationMethod: method,
      totalStockValue: totalVal,
      totalUnits,
      inventoryCost: totalVal * 0.72,
      estimatedProfit: totalVal * 0.28,
      categoryBreakdown: [
        { category: 'Hardware & Infrastructure', value: 354858.00, count: 142 },
        { category: 'Networking', value: 540.00, count: 12 },
        { category: 'Power Management', value: 98560.00, count: 88 },
      ],
    };
  },
};
