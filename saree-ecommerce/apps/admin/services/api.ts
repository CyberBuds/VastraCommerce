import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { ApiResponse } from '@/types/common';

// Create a real Axios Instance
export const api: AxiosInstance = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock database structures persisted in LocalStorage to behave like a 100% real server
const LOCAL_DB_KEYS = {
  products: 'ent_mock_db_products',
  categories: 'ent_mock_db_categories',
  users: 'ent_mock_db_users',
};

// Seed mock products
const DEFAULT_PRODUCTS = Array.from({ length: 45 }).map((_, i) => ({
  id: `prod-${i + 1}`,
  name: [
    'AeroFlow Turbine X1',
    'Quantum Spark Plug',
    'Industrial Hydraulic Fluid',
    'Carbon Fiber Strut',
    'GigaCharge battery pack',
    'Precision Laser Meter',
    'Heavy Duty Steel Rebar',
    'Solar Cell Monocrystalline',
  ][i % 8] + ` (Batch #${1000 + i})`,
  sku: `SKU-AERO-${10000 + i}`,
  category: ['Turbines', 'Auto Components', 'Fluids', 'Structural', 'Electrical', 'Instruments'][i % 6],
  price: parseFloat((150 + i * 49.99).toFixed(2)),
  stock: Math.floor(Math.random() * 250) + 10,
  status: Math.random() > 0.15 ? 'ACTIVE' : 'OUT_OF_STOCK',
  createdAt: new Date(Date.now() - i * 8 * 3600 * 1000).toISOString(),
}));

// Seed categories
const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Turbines', code: 'TURB', count: 12, status: 'ACTIVE' },
  { id: 'cat-2', name: 'Auto Components', code: 'AUTO', count: 8, status: 'ACTIVE' },
  { id: 'cat-3', name: 'Fluids', code: 'FLUI', count: 15, status: 'ACTIVE' },
  { id: 'cat-4', name: 'Structural', code: 'STRU', count: 20, status: 'ACTIVE' },
  { id: 'cat-5', name: 'Electrical', code: 'ELEC', count: 32, status: 'ACTIVE' },
  { id: 'cat-6', name: 'Instruments', code: 'INST', count: 6, status: 'ACTIVE' },
];

// Seed users for user administration
const DEFAULT_USERS = [
  { id: 'u-1', email: 'ykgupta042@gmail.com', firstName: 'Yash', lastName: 'Gupta', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  { id: 'u-2', email: 'admin@enterprise.com', firstName: 'Sarah', lastName: 'Connor', role: 'ADMIN', status: 'ACTIVE' },
  { id: 'u-3', email: 'manager@enterprise.com', firstName: 'Michael', lastName: 'Scott', role: 'MANAGER', status: 'ACTIVE' },
  { id: 'u-4', email: 'operator@enterprise.com', firstName: 'Dwight', lastName: 'Schrute', role: 'OPERATOR', status: 'INACTIVE' },
];

function getLocalDb<T>(key: string, defaultData: T[]): T[] {
  if (typeof window === 'undefined') return defaultData;
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(item);
}

function setLocalDb<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Interceptor 1: Authorization Header Injection
api.interceptors.request.use(
  (config) => {
    const tokens = useAuthStore.getState().tokens;
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor 2: Mock Server Interceptor
// Intercepts /api/* requests and processes them client-side in memory with a simulated delay
api.interceptors.request.use(
  async (config) => {
    const { url, method, data, params } = config;

    // Check if the endpoint is a simulated API (excluding real API proxy routes)
    if (url && url.startsWith('/api/') && !url.includes('/api/v1/auth/login')) {
      const settings = useSettingsStore.getState().settings;
      const latency = settings.simulatedLatencyMs || 300;

      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, latency));

      // Handle Mock Endpoints
      const responseData = handleMockRoute(url, method || 'get', data, params);

      // We throw a custom config-containing cancellation/bypass object to avoid actual HTTP outgoing request,
      // or we can hijack the adapter. The cleanest way in Axios to mock is to trigger a mock adapter resolution:
      config.adapter = async () => {
        return {
          data: responseData,
          status: responseData.success !== false ? 200 : 400,
          statusText: responseData.success !== false ? 'OK' : 'Bad Request',
          headers: {},
          config,
        };
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor 3: Auth Error and Token Refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry Logic for temporary network failures (only if not an authorization error)
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = true;
      return api(originalRequest);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = await useAuthStore.getState().refreshToken();
        processQueue(null, tokens.accessToken);
        originalRequest.headers.Authorization = 'Bearer ' + tokens.accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Mock Route Dispatcher
function handleMockRoute(url: string, method: string, body: any, params: any): any {
  const path = url.split('?')[0];

  // 1. Dashboard metrics mock
  if (path === '/api/dashboard/stats') {
    const products = getLocalDb(LOCAL_DB_KEYS.products, DEFAULT_PRODUCTS);
    const totalInventoryStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = products.filter((p) => p.stock < 20).length;

    return {
      success: true,
      data: {
        stats: {
          revenue: { value: 1245800.5, change: +12.4, history: [40, 50, 45, 60, 55, 70, 65, 80] },
          orders: { value: 3450, change: -2.3, history: [100, 120, 110, 105, 95, 115, 120, 108] },
          customers: { value: 1820, change: +8.1, history: [80, 85, 90, 95, 100, 105, 110, 115] },
          products: { value: products.length, change: +4.2 },
          inventory: { value: totalInventoryStock, lowStock: lowStockCount },
        },
        recentActivities: [
          { id: 'act-1', user: { name: 'Yash Gupta', email: 'ykgupta042@gmail.com', avatarUrl: 'https://picsum.photos/seed/yash/50' }, action: 'Published product', target: 'AeroFlow Turbine X1', timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
          { id: 'act-2', user: { name: 'Sarah Connor', email: 'admin@enterprise.com', avatarUrl: 'https://picsum.photos/seed/sarah/50' }, action: 'Adjusted permissions for role', target: 'MANAGER', timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
          { id: 'act-3', user: { name: 'Michael Scott', email: 'manager@enterprise.com', avatarUrl: 'https://picsum.photos/seed/michael/50' }, action: 'Processed Bulk Order Shipment', target: 'ORD-54890', timestamp: new Date(Date.now() - 120 * 60000).toISOString() },
          { id: 'act-4', user: { name: 'Dwight Schrute', email: 'operator@enterprise.com', avatarUrl: 'https://picsum.photos/seed/dwight/50' }, action: 'Updated warehouse stock', target: 'WH-Scranton-1', timestamp: new Date(Date.now() - 240 * 60000).toISOString() },
        ],
        recentOrders: [
          { id: 'ORD-98432', customer: 'Acme Heavy Industries', date: new Date(Date.now() - 30 * 60000).toISOString(), amount: 48950.0, status: 'PROCESSING' },
          { id: 'ORD-98431', customer: 'Global Supply Corp', date: new Date(Date.now() - 180 * 60000).toISOString(), amount: 12500.2, status: 'DELIVERED' },
          { id: 'ORD-98430', customer: 'BioTech Solutions', date: new Date(Date.now() - 360 * 60000).toISOString(), amount: 6200.0, status: 'SHIPPED' },
          { id: 'ORD-98429', customer: 'InnoTech Lab Ltd', date: new Date(Date.now() - 720 * 60000).toISOString(), amount: 1540.0, status: 'CANCELLED' },
          { id: 'ORD-98428', customer: 'Pioneer Apex Co', date: new Date(Date.now() - 1440 * 60000).toISOString(), amount: 33400.0, status: 'HOLD' },
        ],
      },
    };
  }

  // 2. Catalog Products CRUD
  if (path === '/api/catalog/products') {
    const products = getLocalDb(LOCAL_DB_KEYS.products, DEFAULT_PRODUCTS);

    if (method === 'get') {
      const q = params?.search?.toLowerCase() || '';
      const page = parseInt(params?.page || '1');
      const limit = parseInt(params?.limit || '10');
      const sortColumn = params?.sortColumn || 'createdAt';
      const sortDirection = params?.sortDirection || 'desc';
      const statusFilter = params?.status || '';

      let filtered = [...products];

      // Filtering
      if (q) {
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
      }
      if (statusFilter) {
        filtered = filtered.filter((p) => p.status === statusFilter);
      }

      // Sorting
      filtered.sort((a: any, b: any) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        if (valA === undefined || valB === undefined) return 0;
        if (typeof valA === 'string') {
          return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      });

      // Pagination
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedData = filtered.slice(startIndex, startIndex + limit);

      return {
        success: true,
        data: {
          data: paginatedData,
          total,
          page,
          limit,
          totalPages,
        },
      };
    }

    if (method === 'post') {
      const newProduct = {
        ...body,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [newProduct, ...products];
      setLocalDb(LOCAL_DB_KEYS.products, updated);
      return { success: true, data: newProduct };
    }
  }

  // Dynamic route for individual product
  if (path.startsWith('/api/catalog/products/')) {
    const products = getLocalDb(LOCAL_DB_KEYS.products, DEFAULT_PRODUCTS);
    const prodId = path.split('/').pop();

    if (method === 'get') {
      const product = products.find((p) => p.id === prodId);
      if (product) {
        return { success: true, data: product };
      }
      return { success: false, error: 'Product not found' };
    }

    if (method === 'put') {
      const index = products.findIndex((p) => p.id === prodId);
      if (index !== -1) {
        products[index] = { ...products[index], ...body };
        setLocalDb(LOCAL_DB_KEYS.products, products);
        return { success: true, data: products[index] };
      }
    }

    if (method === 'delete') {
      const updated = products.filter((p) => p.id !== prodId);
      setLocalDb(LOCAL_DB_KEYS.products, updated);
      return { success: true, data: { id: prodId } };
    }
  }

  // 3. Catalog Categories CRUD
  if (path === '/api/catalog/categories') {
    const categories = getLocalDb(LOCAL_DB_KEYS.categories, DEFAULT_CATEGORIES);

    if (method === 'get') {
      return { success: true, data: categories };
    }

    if (method === 'post') {
      const newCat = {
        ...body,
        id: `cat-${Date.now()}`,
        count: 0,
      };
      const updated = [...categories, newCat];
      setLocalDb(LOCAL_DB_KEYS.categories, updated);
      return { success: true, data: newCat };
    }
  }

  if (path.startsWith('/api/catalog/categories/')) {
    const categories = getLocalDb(LOCAL_DB_KEYS.categories, DEFAULT_CATEGORIES);
    const catId = path.split('/').pop();

    if (method === 'put') {
      const index = categories.findIndex((c) => c.id === catId);
      if (index !== -1) {
        categories[index] = { ...categories[index], ...body };
        setLocalDb(LOCAL_DB_KEYS.categories, categories);
        return { success: true, data: categories[index] };
      }
    }

    if (method === 'delete') {
      const updated = categories.filter((c) => c.id !== catId);
      setLocalDb(LOCAL_DB_KEYS.categories, updated);
      return { success: true, data: { id: catId } };
    }
  }

  // 4. Administration Users
  if (path === '/api/administration/users') {
    const users = getLocalDb(LOCAL_DB_KEYS.users, DEFAULT_USERS);

    if (method === 'get') {
      return { success: true, data: users };
    }

    if (method === 'post') {
      const newUser = {
        ...body,
        id: `u-${Date.now()}`,
      };
      const updated = [...users, newUser];
      setLocalDb(LOCAL_DB_KEYS.users, updated);
      return { success: true, data: newUser };
    }
  }

  if (path.startsWith('/api/administration/users/')) {
    const users = getLocalDb(LOCAL_DB_KEYS.users, DEFAULT_USERS);
    const userId = path.split('/').pop();

    if (method === 'put') {
      const index = users.findIndex((u) => u.id === userId);
      if (index !== -1) {
        users[index] = { ...users[index], ...body };
        setLocalDb(LOCAL_DB_KEYS.users, users);
        return { success: true, data: users[index] };
      }
    }

    if (method === 'delete') {
      const updated = users.filter((u) => u.id !== userId);
      setLocalDb(LOCAL_DB_KEYS.users, updated);
      return { success: true, data: { id: userId } };
    }
  }

  // 5. CRM Customers & CRM Management
  if (path === '/api/crm/customers') {
    const { useCustomerStore } = require('@/store/customerStore');
    const store = useCustomerStore.getState();

    if (method === 'get') {
      const q = params?.search?.toLowerCase() || '';
      const groupId = params?.groupId || '';
      const status = params?.status || '';
      let filtered = [...store.customers];

      if (q) {
        filtered = filtered.filter(
          (c) =>
            `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.customerCode.toLowerCase().includes(q)
        );
      }
      if (groupId) {
        filtered = filtered.filter((c) => c.groupId === groupId);
      }
      if (status) {
        filtered = filtered.filter((c) => c.status === status);
      }

      return { success: true, data: filtered };
    }

    if (method === 'post') {
      const newCust = store.addCustomer(body);
      return { success: true, data: newCust };
    }
  }

  if (path.startsWith('/api/crm/customers/')) {
    const { useCustomerStore } = require('@/store/customerStore');
    const store = useCustomerStore.getState();
    const parts = path.split('/');
    const custId = parts[parts.length - 1];

    if (method === 'get') {
      const customer = store.customers.find((c: any) => c.id === custId);
      if (customer) return { success: true, data: customer };
      return { success: false, error: 'Customer not found' };
    }

    if (method === 'put') {
      store.updateCustomer(custId, body);
      const updated = store.customers.find((c: any) => c.id === custId);
      return { success: true, data: updated };
    }

    if (method === 'delete') {
      store.deleteCustomer(custId);
      return { success: true, data: { id: custId } };
    }
  }

  if (path === '/api/crm/groups') {
    const { useCustomerStore } = require('@/store/customerStore');
    const store = useCustomerStore.getState();

    if (method === 'get') {
      return { success: true, data: store.groups };
    }

    if (method === 'post') {
      store.addGroup(body);
      return { success: true, data: body };
    }
  }

  if (path.startsWith('/api/crm/groups/')) {
    const { useCustomerStore } = require('@/store/customerStore');
    const store = useCustomerStore.getState();
    const groupId = path.split('/').pop()!;

    if (method === 'put') {
      store.updateGroup(groupId, body);
      return { success: true, data: body };
    }

    if (method === 'delete') {
      store.deleteGroup(groupId);
      return { success: true, data: { id: groupId } };
    }
  }

  if (path === '/api/crm/segments') {
    const { useCustomerStore } = require('@/store/customerStore');
    const store = useCustomerStore.getState();

    if (method === 'get') {
      return { success: true, data: store.segments };
    }

    if (method === 'post') {
      store.addSegment(body);
      return { success: true, data: body };
    }
  }

  if (path.startsWith('/api/crm/segments/')) {
    const { useCustomerStore } = require('@/store/customerStore');
    const store = useCustomerStore.getState();
    const segmentId = path.split('/').pop()!;

    if (method === 'put') {
      store.updateSegment(segmentId, body);
      return { success: true, data: body };
    }

    if (method === 'delete') {
      store.deleteSegment(segmentId);
      return { success: true, data: { id: segmentId } };
    }
  }

  // 6. Orders & Order Management Module Mock Routes
  if (path === '/api/orders') {
    const { useOrderStore } = require('@/store/orderStore');
    const store = useOrderStore.getState();

    if (method === 'get') {
      const q = params?.search?.toLowerCase() || '';
      const status = params?.status || '';
      let filtered = [...store.orders];

      if (q) {
        filtered = filtered.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerEmail.toLowerCase().includes(q)
        );
      }
      if (status) {
        filtered = filtered.filter((o) => o.status === status);
      }

      return { success: true, data: filtered };
    }

    if (method === 'post') {
      const newOrder = store.addOrder(body);
      return { success: true, data: newOrder };
    }
  }

  if (path.startsWith('/api/orders/')) {
    const { useOrderStore } = require('@/store/orderStore');
    const store = useOrderStore.getState();
    const parts = path.split('/');
    const orderId = parts[3];

    if (parts.length === 4) {
      if (method === 'get') {
        const order = store.orders.find((o: any) => o.id === orderId);
        if (order) return { success: true, data: order };
        return { success: false, error: 'Order not found' };
      }
      if (method === 'put') {
        store.updateOrder(orderId, body);
        const updated = store.orders.find((o: any) => o.id === orderId);
        return { success: true, data: updated };
      }
      if (method === 'delete') {
        store.deleteOrder(orderId);
        return { success: true, data: { id: orderId } };
      }
    }

    if (parts.length === 5) {
      const action = parts[4];
      if (action === 'hold') {
        store.holdOrder(orderId, body.reason);
        const updated = store.orders.find((o: any) => o.id === orderId);
        return { success: true, data: updated };
      }
      if (action === 'release') {
        store.releaseOrder(orderId);
        const updated = store.orders.find((o: any) => o.id === orderId);
        return { success: true, data: updated };
      }
      if (action === 'timeline') {
        store.addTimelineEvent(orderId, body);
        const updated = store.orders.find((o: any) => o.id === orderId);
        return { success: true, data: updated };
      }
      if (action === 'cancel') {
        store.cancelOrder(orderId, body.reason);
        const updated = store.orders.find((o: any) => o.id === orderId);
        return { success: true, data: updated };
      }
    }

    if (parts.length === 6 && parts[4] === 'picking') {
      const subAction = parts[5];
      if (subAction === 'start') {
        store.startPicking(orderId);
        const updated = store.orders.find((o: any) => o.id === orderId);
        return { success: true, data: updated };
      }
      if (subAction === 'complete') {
        store.completePicking(orderId);
        const updated = store.orders.find((o: any) => o.id === orderId);
        return { success: true, data: updated };
      }
    }

    if (parts.length === 6 && parts[4] === 'packing') {
      const subAction = parts[5];
      if (subAction === 'complete') {
        store.completePacking(orderId);
        const updated = store.orders.find((o: any) => o.id === orderId);
        return { success: true, data: updated };
      }
    }

    if (parts.length === 7 && parts[4] === 'picking' && parts[5] === 'items') {
      const itemId = parts[6];
      store.markItemPicked(orderId, itemId, body.status);
      const updated = store.orders.find((o: any) => o.id === orderId);
      return { success: true, data: updated };
    }

    if (parts.length === 7 && parts[4] === 'packing' && parts[5] === 'items') {
      const itemId = parts[6];
      store.markItemPacked(orderId, itemId, body.status);
      const updated = store.orders.find((o: any) => o.id === orderId);
      return { success: true, data: updated };
    }
  }

  if (path === '/api/invoices') {
    const { useOrderStore } = require('@/store/orderStore');
    const store = useOrderStore.getState();
    if (method === 'get') {
      return { success: true, data: store.invoices };
    }
  }

  if (path.startsWith('/api/invoices/')) {
    const { useOrderStore } = require('@/store/orderStore');
    const store = useOrderStore.getState();
    const parts = path.split('/');
    const invoiceId = parts[3];

    if (parts.length === 4) {
      if (method === 'get') {
        const inv = store.invoices.find((i: any) => i.id === invoiceId);
        if (inv) return { success: true, data: inv };
        return { success: false, error: 'Invoice not found' };
      }
    }
    if (parts.length === 5) {
      const action = parts[4];
      if (action === 'pay') {
        store.payInvoice(invoiceId);
        const updated = store.invoices.find((i: any) => i.id === invoiceId);
        return { success: true, data: updated };
      }
      if (action === 'void') {
        store.voidInvoice(invoiceId);
        const updated = store.invoices.find((i: any) => i.id === invoiceId);
        return { success: true, data: updated };
      }
    }
  }

  if (path === '/api/shipments') {
    const { useOrderStore } = require('@/store/orderStore');
    const store = useOrderStore.getState();
    if (method === 'get') {
      return { success: true, data: store.shipments };
    }
  }

  if (path.startsWith('/api/shipments/')) {
    const { useOrderStore } = require('@/store/orderStore');
    const store = useOrderStore.getState();
    const parts = path.split('/');

    if (parts.length === 5 && parts[3] === 'order') {
      const orderId = parts[4];
      if (method === 'post') {
        const shipment = store.createShipment(orderId, body);
        return { success: true, data: shipment };
      }
    }

    const shipmentId = parts[3];
    if (parts.length === 5 && parts[4] === 'status') {
      if (method === 'put') {
        store.updateShipmentStatus(shipmentId, body.status, body.details);
        const updated = store.shipments.find((s: any) => s.id === shipmentId);
        return { success: true, data: updated };
      }
    }
  }

  if (path === '/api/returns') {
    const { useOrderStore } = require('@/store/orderStore');
    const store = useOrderStore.getState();
    if (method === 'get') {
      return { success: true, data: store.returns };
    }
    if (method === 'post') {
      const returnReq = store.requestReturn(body);
      return { success: true, data: returnReq };
    }
  }

  if (path.startsWith('/api/returns/')) {
    const { useOrderStore } = require('@/store/orderStore');
    const store = useOrderStore.getState();
    const parts = path.split('/');
    const returnId = parts[3];

    if (parts.length === 5 && parts[4] === 'process') {
      if (method === 'put') {
        store.processReturnStatus(returnId, body.status, body.itemStatuses, body.customRefundAmount);
        const updated = store.returns.find((r: any) => r.id === returnId);
        return { success: true, data: updated };
      }
    }
  }

  if (path === '/api/tracking') {
    const { useOrderStore } = require('@/store/orderStore');
    const store = useOrderStore.getState();
    if (method === 'get') {
      return { success: true, data: store.tracking };
    }
  }

  if (path.startsWith('/api/tracking/')) {
    const { useOrderStore } = require('@/store/orderStore');
    const store = useOrderStore.getState();
    const trackingNum = path.split('/').pop();
    const track = store.tracking.find((t: any) => t.trackingNumber === trackingNum);
    if (track) return { success: true, data: track };
    return { success: false, error: 'Tracking detail not found' };
  }

  // 7. CMS Module Mock Routes
  if (path.startsWith('/api/cms')) {
    const { useCmsStore } = require('@/store/cmsStore');
    const cmsStore = useCmsStore.getState();

    if (path === '/api/cms/stats') {
      return { success: true, data: cmsStore.getStats() };
    }

    if (path === '/api/cms/pages') {
      if (method === 'get') return { success: true, data: cmsStore.pages };
      if (method === 'post') {
        const page = cmsStore.addPage(body);
        return { success: true, data: page };
      }
    }

    if (path.startsWith('/api/cms/pages/')) {
      const id = path.split('/').pop();
      if (method === 'get') {
        const page = cmsStore.pages.find((p: any) => p.id === id);
        return page ? { success: true, data: page } : { success: false, error: 'Page not found' };
      }
      if (method === 'put') {
        cmsStore.updatePage(id, body);
        return { success: true, data: cmsStore.pages.find((p: any) => p.id === id) };
      }
      if (method === 'delete') {
        cmsStore.deletePage(id);
        return { success: true, data: { id } };
      }
    }

    if (path === '/api/cms/blogs') {
      if (method === 'get') return { success: true, data: cmsStore.blogs };
      if (method === 'post') {
        const blog = cmsStore.addBlog(body);
        return { success: true, data: blog };
      }
    }

    if (path.startsWith('/api/cms/blogs/')) {
      const id = path.split('/').pop();
      if (method === 'get') {
        const blog = cmsStore.blogs.find((b: any) => b.id === id);
        return blog ? { success: true, data: blog } : { success: false, error: 'Blog not found' };
      }
      if (method === 'put') {
        cmsStore.updateBlog(id, body);
        return { success: true, data: cmsStore.blogs.find((b: any) => b.id === id) };
      }
      if (method === 'delete') {
        cmsStore.deleteBlog(id);
        return { success: true, data: { id } };
      }
    }

    if (path === '/api/cms/categories') return { success: true, data: cmsStore.categories };
    if (path === '/api/cms/tags') return { success: true, data: cmsStore.tags };
    if (path === '/api/cms/media') return { success: true, data: cmsStore.mediaItems };
    if (path === '/api/cms/menus') return { success: true, data: cmsStore.menus };
    if (path === '/api/cms/faqs') return { success: true, data: cmsStore.faqs };
    if (path === '/api/cms/testimonials') return { success: true, data: cmsStore.testimonials };
    if (path === '/api/cms/landing-pages') return { success: true, data: cmsStore.landingPages };
    if (path === '/api/cms/seo') return { success: true, data: cmsStore.seoConfig };
    if (path === '/api/cms/redirects') return { success: true, data: cmsStore.redirects };
    if (path === '/api/cms/sitemaps') return { success: true, data: cmsStore.sitemaps };
    if (path === '/api/cms/robots') return { success: true, data: cmsStore.robotsConfig };
    if (path === '/api/cms/schemas') return { success: true, data: cmsStore.schemas };
    if (path === '/api/cms/meta-rules') return { success: true, data: cmsStore.metaRules };
    if (path === '/api/cms/scheduler') return { success: true, data: cmsStore.scheduledQueue };
    if (path === '/api/cms/revisions') return { success: true, data: cmsStore.revisions };
  }

  // 8. System Administration & Settings Module Mock Routes
  if (path.startsWith('/api/system')) {
    const { useSystemStore } = require('@/store/systemStore');
    const systemStore = useSystemStore.getState();

    if (path === '/api/system/company') {
      if (method === 'get') return { success: true, data: systemStore.companyProfile };
      if (method === 'put') {
        systemStore.updateCompanyProfile(body);
        return { success: true, data: systemStore.companyProfile };
      }
    }

    if (path === '/api/system/stores') {
      if (method === 'get') return { success: true, data: systemStore.stores };
      if (method === 'post') {
        systemStore.addStoreSetting(body);
        return { success: true, data: body };
      }
    }

    if (path === '/api/system/theme') {
      if (method === 'get') return { success: true, data: systemStore.themeConfig };
      if (method === 'put') {
        systemStore.updateThemeConfig(body);
        return { success: true, data: systemStore.themeConfig };
      }
    }

    if (path === '/api/system/localization') {
      if (method === 'get') return { success: true, data: systemStore.localization };
      if (method === 'put') {
        systemStore.updateLocalization(body);
        return { success: true, data: systemStore.localization };
      }
    }

    if (path === '/api/system/tax') return { success: true, data: systemStore.taxRules };
    if (path === '/api/system/gateways') return { success: true, data: systemStore.gateways };
    if (path === '/api/system/integrations') return { success: true, data: systemStore.integrations };
    if (path === '/api/system/webhooks') return { success: true, data: systemStore.webhooks };
    if (path === '/api/system/feature-flags') return { success: true, data: systemStore.featureFlags };
    if (path === '/api/system/security') {
      if (method === 'get') return { success: true, data: systemStore.securityPolicy };
      if (method === 'put') {
        systemStore.updateSecurityPolicy(body);
        return { success: true, data: systemStore.securityPolicy };
      }
    }
    if (path === '/api/system/roles') return { success: true, data: systemStore.roles };
    if (path === '/api/system/users') return { success: true, data: systemStore.users };
    if (path === '/api/system/logs') return { success: true, data: systemStore.auditLogs };
    if (path === '/api/system/health') return { success: true, data: systemStore.healthMetrics };
    if (path === '/api/system/cache') return { success: true, data: systemStore.cacheStatus };
    if (path === '/api/system/backups') return { success: true, data: systemStore.backups };
    if (path === '/api/system/license') return { success: true, data: systemStore.licenseInfo };
  }

  // Default fallback for unhandled mocked endpoints
  return { success: true, data: {} };
}

// Enterprise Feature API Base Class
export class BaseFeatureApi<T> {
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  async getAll(params?: any): Promise<ApiResponse<T[]>> {
    const response = await api.get<ApiResponse<T[]>>(this.basePath, { params });
    return response.data;
  }

  async getPaginated(params?: any): Promise<ApiResponse<{ data: T[]; total: number; page: number; limit: number; totalPages: number }>> {
    const response = await api.get(this.basePath, { params });
    return response.data;
  }

  async getById(id: string | number): Promise<ApiResponse<T>> {
    const response = await api.get<ApiResponse<T>>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await api.post<ApiResponse<T>>(this.basePath, data);
    return response.data;
  }

  async update(id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await api.put<ApiResponse<T>>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string | number): Promise<ApiResponse<{ id: string | number }>> {
    const response = await api.delete<ApiResponse<{ id: string | number }>>(`${this.basePath}/${id}`);
    return response.data;
  }
}
