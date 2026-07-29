import { describe, it, expect } from 'vitest';
import { inventoryApi } from '../services/inventoryApi';

describe('Inventory & Warehouse Management Module', () => {
  it('should retrieve inventory statistics accurately', async () => {
    const stats = await inventoryApi.getStats();
    expect(stats.totalStock).toBeGreaterThan(0);
    expect(stats.inventoryValue).toBeGreaterThan(0);
    expect(stats.warehouseCount).toBe(4);
  });

  it('should calculate FIFO valuation correctly', async () => {
    const val = await inventoryApi.getValuation('FIFO');
    expect(val.valuationMethod).toBe('FIFO');
    expect(val.totalStockValue).toBeGreaterThan(0);
    expect(val.categoryBreakdown.length).toBeGreaterThan(0);
  });

  it('should support creating a new warehouse facility', async () => {
    const newWh = await inventoryApi.createWarehouse({
      code: 'WH-TEST-01',
      name: 'Test Logistics Depot',
      manager: 'Test Manager',
      contactPerson: 'Tester',
      email: 'test@warehouse.io',
      phone: '+1 555 123 4567',
      country: 'USA',
      state: 'Texas',
      city: 'Austin',
      address: '100 Test Way',
      capacity: 50000,
      status: 'active',
      isDefault: false,
    });

    expect(newWh.id).toBeDefined();
    expect(newWh.name).toBe('Test Logistics Depot');

    const allWh = await inventoryApi.getWarehouses();
    expect(allWh.some((w) => w.id === newWh.id)).toBe(true);
  });

  it('should initiate stock transfer successfully', async () => {
    const transfer = await inventoryApi.createTransfer({
      sourceWarehouseId: 'wh-001',
      sourceWarehouseName: 'Central Logistics Hub',
      targetWarehouseId: 'wh-002',
      targetWarehouseName: 'West Coast Distribution Center',
      items: [
        {
          productId: 'stk-101',
          productName: 'Enterprise Rack Server X9000',
          sku: 'SKU-ENT-SERVER-X9',
          quantity: 2,
        },
      ],
      status: 'in_transit',
      trackingNumber: 'TRK-TEST-990',
      requestedBy: 'Unit Test Suite',
    });

    expect(transfer.transferNumber).toContain('TRF-2026-');
    expect(transfer.status).toBe('in_transit');
  });
});
