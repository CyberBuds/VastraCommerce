import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../services/inventoryApi';
import {
  Warehouse,
  StockMovement,
  PurchaseOrder,
  GRN,
  StockTransfer,
  StockAdjustment,
  Supplier,
  CycleCount,
} from '../types/inventoryTypes';

export function useInventoryStats() {
  return useQuery({
    queryKey: ['inventory', 'stats'],
    queryFn: () => inventoryApi.getStats(),
  });
}

export function useWarehousesList() {
  return useQuery({
    queryKey: ['inventory', 'warehouses'],
    queryFn: () => inventoryApi.getWarehouses(),
  });
}

export function useWarehouseById(id: string) {
  return useQuery({
    queryKey: ['inventory', 'warehouses', id],
    queryFn: () => inventoryApi.getWarehouseById(id),
    enabled: !!id,
  });
}

export function useCreateWarehouseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Warehouse, 'id' | 'totalSKUs' | 'currentCapacityPercent' | 'createdAt'>) =>
      inventoryApi.createWarehouse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'warehouses'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'stats'] });
    },
  });
}

export function useUpdateWarehouseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Warehouse> }) =>
      inventoryApi.updateWarehouse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'warehouses'] });
    },
  });
}

export function useDeleteWarehouseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inventoryApi.deleteWarehouse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'warehouses'] });
    },
  });
}

export function useStockList(filters?: { warehouseId?: string; status?: string }) {
  return useQuery({
    queryKey: ['inventory', 'stock', filters],
    queryFn: () => inventoryApi.getStockItems(filters),
  });
}

export function useStockItemById(id: string) {
  return useQuery({
    queryKey: ['inventory', 'stock', id],
    queryFn: () => inventoryApi.getStockItemById(id),
    enabled: !!id,
  });
}

export function useStockMovementsList() {
  return useQuery({
    queryKey: ['inventory', 'movements'],
    queryFn: () => inventoryApi.getStockMovements(),
  });
}

export function useCreateStockMovementMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<StockMovement, 'id' | 'timestamp'>) =>
      inventoryApi.createStockMovement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'movements'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'stock'] });
    },
  });
}

export function usePurchaseOrdersList() {
  return useQuery({
    queryKey: ['inventory', 'purchase-orders'],
    queryFn: () => inventoryApi.getPurchaseOrders(),
  });
}

export function useCreatePurchaseOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>) =>
      inventoryApi.createPurchaseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'purchase-orders'] });
    },
  });
}

export function useUpdatePOStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PurchaseOrder['status'] }) =>
      inventoryApi.updatePOStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'purchase-orders'] });
    },
  });
}

export function useGRNsList() {
  return useQuery({
    queryKey: ['inventory', 'grns'],
    queryFn: () => inventoryApi.getGRNs(),
  });
}

export function useCreateGRNMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<GRN, 'id' | 'grnNumber'>) => inventoryApi.createGRN(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'grns'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'stock'] });
    },
  });
}

export function useStockTransfersList() {
  return useQuery({
    queryKey: ['inventory', 'transfers'],
    queryFn: () => inventoryApi.getTransfers(),
  });
}

export function useCreateStockTransferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<StockTransfer, 'id' | 'transferNumber' | 'createdAt'>) =>
      inventoryApi.createTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'transfers'] });
    },
  });
}

export function useUpdateTransferStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: StockTransfer['status'] }) =>
      inventoryApi.updateTransferStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'transfers'] });
    },
  });
}

export function useStockAdjustmentsList() {
  return useQuery({
    queryKey: ['inventory', 'adjustments'],
    queryFn: () => inventoryApi.getAdjustments(),
  });
}

export function useCreateStockAdjustmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<StockAdjustment, 'id' | 'adjustmentNumber' | 'createdAt'>) =>
      inventoryApi.createAdjustment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'adjustments'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'stock'] });
    },
  });
}

export function useSuppliersList() {
  return useQuery({
    queryKey: ['inventory', 'suppliers'],
    queryFn: () => inventoryApi.getSuppliers(),
  });
}

export function useCreateSupplierMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Supplier, 'id' | 'totalOrdersCount' | 'totalSpent'>) =>
      inventoryApi.createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'suppliers'] });
    },
  });
}

export function useBarcodesList() {
  return useQuery({
    queryKey: ['inventory', 'barcodes'],
    queryFn: () => inventoryApi.getBarcodes(),
  });
}

export function useGenerateBarcodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sku, type }: { sku: string; type: 'code128' | 'qr' | 'ean13' }) =>
      inventoryApi.generateBarcode(sku, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'barcodes'] });
    },
  });
}

export function useBatchesList() {
  return useQuery({
    queryKey: ['inventory', 'batches'],
    queryFn: () => inventoryApi.getBatches(),
  });
}

export function useSerialNumbersList() {
  return useQuery({
    queryKey: ['inventory', 'serial-numbers'],
    queryFn: () => inventoryApi.getSerialNumbers(),
  });
}

export function useExpiryAlertsList() {
  return useQuery({
    queryKey: ['inventory', 'expiry-alerts'],
    queryFn: () => inventoryApi.getExpiryAlerts(),
  });
}

export function useCycleCountsList() {
  return useQuery({
    queryKey: ['inventory', 'cycle-counts'],
    queryFn: () => inventoryApi.getCycleCounts(),
  });
}

export function useCreateCycleCountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<CycleCount, 'id' | 'countNumber' | 'createdAt'>) =>
      inventoryApi.createCycleCount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'cycle-counts'] });
    },
  });
}

export function useInventoryValuation(method: 'FIFO' | 'LIFO' | 'Weighted Average') {
  return useQuery({
    queryKey: ['inventory', 'valuation', method],
    queryFn: () => inventoryApi.getValuation(method),
  });
}
