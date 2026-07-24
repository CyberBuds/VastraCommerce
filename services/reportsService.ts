import { api } from '@/services/api';
import {
  ExecutiveMetrics,
  SalesTrendData,
  SalesByBreakdown,
  OrderStatusBreakdown,
  CustomerAnalytics,
  InventoryValuationItem,
  PaymentGatewayMetric,
  MarketingCampaignReport,
  FinanceSummary,
  ShippingPerformanceItem,
  AuditLogItem,
  SystemMetricItem,
} from '@/features/reports/types/reportsTypes';

export const reportsService = {
  getExecutiveMetrics: async (): Promise<ExecutiveMetrics> => {
    return {
      totalRevenue: 2485900,
      netRevenue: 2198400,
      grossSales: 2650000,
      totalOrders: 18450,
      totalCustomers: 12400,
      totalProducts: 3820,
      inventoryValue: 4120000,
      refundAmount: 64100,
      taxCollected: 223700,
      netProfit: 685000,
      grossLoss: 12400,
      averageOrderValue: 134.74,
      conversionRate: 3.82,
      repeatCustomerRate: 42.6,
      revenueChange: 14.8,
      ordersChange: 9.3,
      conversionChange: 0.6,
    };
  },

  getSalesTrend: async (): Promise<SalesTrendData[]> => {
    return [
      { period: 'Jan 2026', grossSales: 185000, netSales: 168000, discounts: 12000, refunds: 5000, orders: 1380 },
      { period: 'Feb 2026', grossSales: 210000, netSales: 192000, discounts: 13500, refunds: 4500, orders: 1540 },
      { period: 'Mar 2026', grossSales: 245000, netSales: 224000, discounts: 15000, refunds: 6000, orders: 1790 },
      { period: 'Apr 2026', grossSales: 230000, netSales: 208000, discounts: 16000, refunds: 6000, orders: 1680 },
      { period: 'May 2026', grossSales: 280000, netSales: 256000, discounts: 18000, refunds: 6000, orders: 2050 },
      { period: 'Jun 2026', grossSales: 310000, netSales: 284000, discounts: 20000, refunds: 6000, orders: 2280 },
      { period: 'Jul 2026', grossSales: 340000, netSales: 312000, discounts: 21000, refunds: 7000, orders: 2490 },
    ];
  },

  getSalesByCategory: async (): Promise<SalesByBreakdown[]> => {
    return [
      { id: 'cat-1', name: 'Avionics & Radar Systems', category: 'Electronics', ordersCount: 4120, quantitySold: 5800, totalRevenue: 980000, percentageOfTotal: 39.4 },
      { id: 'cat-2', name: 'Turbine Engine Spares', category: 'Propulsion', ordersCount: 3200, quantitySold: 4100, totalRevenue: 640000, percentageOfTotal: 25.7 },
      { id: 'cat-3', name: 'Flight Deck Controls', category: 'Cockpit', ordersCount: 2800, quantitySold: 3900, totalRevenue: 420000, percentageOfTotal: 16.9 },
      { id: 'cat-4', name: 'Hydraulics & Actuators', category: 'Airframe', ordersCount: 2100, quantitySold: 3100, totalRevenue: 280000, percentageOfTotal: 11.2 },
      { id: 'cat-5', name: 'Interior Cabin Systems', category: 'Cabin', ordersCount: 1450, quantitySold: 2200, totalRevenue: 165900, percentageOfTotal: 6.8 },
    ];
  },

  getOrderStatusBreakdown: async (): Promise<OrderStatusBreakdown[]> => {
    return [
      { status: 'Completed / Delivered', count: 14200, value: 1910000, percentage: 76.9 },
      { status: 'Processing / Packing', count: 2100, value: 285000, percentage: 11.3 },
      { status: 'Pending Payment', count: 980, value: 132000, percentage: 5.3 },
      { status: 'Cancelled', count: 670, value: 90000, percentage: 3.6 },
      { status: 'Returned / Refunded', count: 500, value: 68900, percentage: 2.9 },
    ];
  },

  getCustomerAnalytics: async (): Promise<CustomerAnalytics> => {
    return {
      totalCustomers: 12400,
      newCustomers: 1850,
      activeCustomers: 8900,
      inactiveCustomers: 3500,
      repeatCustomers: 5280,
      averageLtv: 4850.5,
      topCustomers: [
        { id: 'cust-1', name: 'Boeing Global Logistics', email: 'procurement@boeing.com', totalOrders: 142, totalSpent: 485000, ltv: 620000, lastOrderDate: '2026-07-21' },
        { id: 'cust-2', name: 'Airbus Defense Services', email: 'supply@airbus.com', totalOrders: 118, totalSpent: 392000, ltv: 510000, lastOrderDate: '2026-07-20' },
        { id: 'cust-3', name: 'Lockheed Martin Corp', email: 'vendor@lockheed.com', totalOrders: 95, totalSpent: 310000, ltv: 430000, lastOrderDate: '2026-07-19' },
        { id: 'cust-4', name: 'Northrop Grumman Aero', email: 'parts@northrop.com', totalOrders: 82, totalSpent: 265000, ltv: 380000, lastOrderDate: '2026-07-18' },
        { id: 'cust-5', name: 'Rolls-Royce Aerospace', email: 'aero@rolls-royce.com', totalOrders: 74, totalSpent: 220000, ltv: 310000, lastOrderDate: '2026-07-15' },
      ],
    };
  },

  getInventoryValuation: async (): Promise<InventoryValuationItem[]> => {
    return [
      { id: 'inv-1', sku: 'AV-RAD-09', productName: 'AeroRadar Pro X9 Weather System', category: 'Avionics', warehouse: 'Main Seattle Hub', stockOnHand: 240, reservedStock: 35, costPrice: 1800, retailPrice: 2850, totalCostValue: 432000, totalRetailValue: 684000, status: 'IN_STOCK' },
      { id: 'inv-2', sku: 'TURB-BLD-88', productName: 'Titanium Blade Set V8', category: 'Propulsion', warehouse: 'Frankfurt Hub', stockOnHand: 18, reservedStock: 12, costPrice: 4200, retailPrice: 6500, totalCostValue: 75600, totalRetailValue: 117000, status: 'LOW_STOCK' },
      { id: 'inv-3', sku: 'HYD-ACT-02', productName: 'Dual Hydraulic Actuator Unit', category: 'Airframe', warehouse: 'Singapore Depot', stockOnHand: 0, reservedStock: 0, costPrice: 950, retailPrice: 1500, totalCostValue: 0, totalRetailValue: 0, status: 'OUT_OF_STOCK' },
      { id: 'inv-4', sku: 'CKP-ALT-10', productName: 'Digital Altimeter Display Screen', category: 'Cockpit', warehouse: 'Main Seattle Hub', stockOnHand: 510, reservedStock: 80, costPrice: 620, retailPrice: 990, totalCostValue: 316200, totalRetailValue: 504900, status: 'IN_STOCK' },
      { id: 'inv-5', sku: 'CAB-LED-44', productName: 'Ambient Flight Cabin Light Module', category: 'Cabin', warehouse: 'Frankfurt Hub', stockOnHand: 1200, reservedStock: 150, costPrice: 85, retailPrice: 140, totalCostValue: 102000, totalRetailValue: 168000, status: 'IN_STOCK' },
    ];
  },

  getPaymentGateways: async (): Promise<PaymentGatewayMetric[]> => {
    return [
      { gateway: 'Stripe Enterprise', method: 'Credit/Debit Card', transactionsCount: 11200, successfulCount: 10980, failedCount: 220, totalVolume: 1520000, feeAmount: 38000, successRate: 98.0 },
      { gateway: 'Razorpay Corporate', method: 'UPI & NetBanking', transactionsCount: 4200, successfulCount: 4140, failedCount: 60, totalVolume: 580000, feeAmount: 11600, successRate: 98.5 },
      { gateway: 'PayPal Business', method: 'PayPal Wallet', transactionsCount: 1800, successfulCount: 1720, failedCount: 80, totalVolume: 240000, feeAmount: 8400, successRate: 95.5 },
      { gateway: 'Wire Transfer / ACH', method: 'Direct Bank Wire', transactionsCount: 1250, successfulCount: 1240, failedCount: 10, totalVolume: 145900, feeAmount: 1500, successRate: 99.2 },
    ];
  },

  getMarketingCampaigns: async (): Promise<MarketingCampaignReport[]> => {
    return [
      { id: 'mkt-1', campaignName: 'Q2 Avionics Hardware Upgrade Promo', channel: 'EMAIL', impressions: 45000, clicks: 6800, conversions: 420, spend: 12000, revenueGenerated: 185000, roi: 14.4 },
      { id: 'mkt-2', campaignName: 'Loyalty VIP JetParts Discount', channel: 'COUPON', impressions: 28000, clicks: 4200, conversions: 310, spend: 8500, revenueGenerated: 112000, roi: 12.1 },
      { id: 'mkt-3', campaignName: 'SMS Urgent Order Shipping Alerts', channel: 'SMS', impressions: 18000, clicks: 3900, conversions: 280, spend: 2400, revenueGenerated: 42000, roi: 16.5 },
      { id: 'mkt-4', campaignName: 'WhatsApp B2B Re-Engagement', channel: 'WHATSAPP', impressions: 12000, clicks: 2800, conversions: 190, spend: 1800, revenueGenerated: 35000, roi: 18.4 },
    ];
  },

  getFinanceSummary: async (): Promise<FinanceSummary> => {
    return {
      grossRevenue: 2650000,
      cogs: 1320000,
      operatingExpenses: 380000,
      marketingExpenses: 95000,
      logisticsExpenses: 110000,
      taxLiability: 223700,
      netMargin: 25.8,
      ebitda: 745000,
    };
  },

  getShippingPerformance: async (): Promise<ShippingPerformanceItem[]> => {
    return [
      { courierName: 'FedEx Express Freight', totalShipments: 6400, deliveredOnTime: 6220, delayedCount: 150, failedCount: 30, avgDeliveryHours: 28, totalCost: 128000, slaRate: 97.1 },
      { courierName: 'DHL Global Forwarding', totalShipments: 5200, deliveredOnTime: 5080, delayedCount: 95, failedCount: 25, avgDeliveryHours: 32, totalCost: 114000, slaRate: 97.6 },
      { courierName: 'UPS Air Cargo', totalShipments: 4100, deliveredOnTime: 3950, delayedCount: 120, failedCount: 30, avgDeliveryHours: 34, totalCost: 89000, slaRate: 96.3 },
      { courierName: 'BlueDart Express B2B', totalShipments: 2750, deliveredOnTime: 2680, delayedCount: 55, failedCount: 15, avgDeliveryHours: 24, totalCost: 45000, slaRate: 97.4 },
    ];
  },

  getAuditLogs: async (): Promise<AuditLogItem[]> => {
    return [
      { id: 'aud-1', timestamp: '2026-07-22T12:30:15Z', userEmail: 'admin@enterprise-aero.com', userRole: 'Super Admin', action: 'EXPORT_FINANCIAL_REPORT', module: 'FINANCE', ipAddress: '192.168.1.102', status: 'SUCCESS', details: 'Exported Q2 Profit & Loss ledger in PDF format' },
      { id: 'aud-2', timestamp: '2026-07-22T11:45:00Z', userEmail: 'cfo@enterprise-aero.com', userRole: 'Finance Director', action: 'UPDATE_TAX_CONFIG', module: 'TAX', ipAddress: '192.168.1.150', status: 'SUCCESS', details: 'Updated GST rate rules for EU region' },
      { id: 'aud-3', timestamp: '2026-07-22T10:12:40Z', userEmail: 'analyst@enterprise-aero.com', userRole: 'Data Analyst', action: 'CREATE_CUSTOM_REPORT_TEMPLATE', module: 'REPORTS', ipAddress: '10.0.4.88', status: 'SUCCESS', details: 'Saved template: High-Margin Product Sales Breakdown' },
      { id: 'aud-4', timestamp: '2026-07-22T09:05:12Z', userEmail: 'unknown@external-sec.com', userRole: 'Guest', action: 'FAILED_ADMIN_LOGIN', module: 'AUTH', ipAddress: '185.220.101.5', status: 'FAILED', details: 'Invalid credentials attempt on /admin/login' },
    ];
  },

  getSystemMetrics: async (): Promise<SystemMetricItem[]> => {
    return [
      { timestamp: '12:00', cpuUsagePct: 32, memoryUsagePct: 58, apiRequestsPerMin: 1450, avgLatencyMs: 42, errorRatePct: 0.02, activeJobsCount: 12, dbPoolConnections: 24 },
      { timestamp: '12:10', cpuUsagePct: 38, memoryUsagePct: 62, apiRequestsPerMin: 1820, avgLatencyMs: 48, errorRatePct: 0.04, activeJobsCount: 18, dbPoolConnections: 31 },
      { timestamp: '12:20', cpuUsagePct: 45, memoryUsagePct: 65, apiRequestsPerMin: 2200, avgLatencyMs: 55, errorRatePct: 0.03, activeJobsCount: 22, dbPoolConnections: 38 },
      { timestamp: '12:30', cpuUsagePct: 41, memoryUsagePct: 61, apiRequestsPerMin: 1950, avgLatencyMs: 46, errorRatePct: 0.01, activeJobsCount: 15, dbPoolConnections: 29 },
      { timestamp: '12:40', cpuUsagePct: 35, memoryUsagePct: 59, apiRequestsPerMin: 1600, avgLatencyMs: 41, errorRatePct: 0.02, activeJobsCount: 14, dbPoolConnections: 26 },
    ];
  },
};
