import { create } from 'zustand';
import {
  CompanyProfile,
  StoreSetting,
  ThemeConfig,
  LocalizationConfig,
  TaxRule,
  CommunicationGatewayConfig,
  ThirdPartyIntegration,
  WebhookEndpoint,
  FeatureFlag,
  SecurityPolicy,
  SystemRole,
  SystemUser,
  AuditLogItem,
  SystemHealthMetrics,
  CacheEntryStatus,
  SystemBackup,
  SystemLicenseInfo,
  SystemRoleType,
  UserStatus,
} from '@/features/system/types/systemTypes';

interface SystemState {
  companyProfile: CompanyProfile;
  stores: StoreSetting[];
  themeConfig: ThemeConfig;
  localization: LocalizationConfig;
  taxRules: TaxRule[];
  gateways: CommunicationGatewayConfig[];
  integrations: ThirdPartyIntegration[];
  webhooks: WebhookEndpoint[];
  featureFlags: FeatureFlag[];
  securityPolicy: SecurityPolicy;
  roles: SystemRole[];
  users: SystemUser[];
  auditLogs: AuditLogItem[];
  healthMetrics: SystemHealthMetrics;
  cacheStatus: CacheEntryStatus[];
  backups: SystemBackup[];
  licenseInfo: SystemLicenseInfo;

  // Actions
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  updateStoreSetting: (id: string, store: Partial<StoreSetting>) => void;
  addStoreSetting: (store: Omit<StoreSetting, 'id'>) => void;
  deleteStoreSetting: (id: string) => void;
  updateThemeConfig: (theme: Partial<ThemeConfig>) => void;
  updateLocalization: (loc: Partial<LocalizationConfig>) => void;
  addTaxRule: (rule: Omit<TaxRule, 'id'>) => void;
  updateTaxRule: (id: string, rule: Partial<TaxRule>) => void;
  deleteTaxRule: (id: string) => void;
  updateGatewayConfig: (type: CommunicationGatewayConfig['type'], config: Partial<CommunicationGatewayConfig>) => void;
  updateIntegration: (id: string, data: Partial<ThirdPartyIntegration>) => void;
  addWebhook: (webhook: Omit<WebhookEndpoint, 'id' | 'failureCount' | 'lastTriggeredAt'>) => void;
  deleteWebhook: (id: string) => void;
  toggleFeatureFlag: (id: string) => void;
  updateFeatureFlag: (id: string, flag: Partial<FeatureFlag>) => void;
  addFeatureFlag: (flag: Omit<FeatureFlag, 'id' | 'updatedAt'>) => void;
  updateSecurityPolicy: (policy: Partial<SecurityPolicy>) => void;
  addRole: (role: Omit<SystemRole, 'id' | 'updatedAt' | 'userCount'>) => void;
  updateRole: (id: string, role: Partial<SystemRole>) => void;
  deleteRole: (id: string) => void;
  addUser: (user: Omit<SystemUser, 'id' | 'createdAt' | 'lastLoginAt' | 'ipAddress'>) => void;
  updateUser: (id: string, user: Partial<SystemUser>) => void;
  toggleUserStatus: (id: string, status: UserStatus) => void;
  deleteUser: (id: string) => void;
  addAuditLog: (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => void;
  clearAuditLogs: () => void;
  flushCache: (category: CacheEntryStatus['category'] | 'ALL') => void;
  createBackup: (type: 'MANUAL' | 'AUTOMATED') => SystemBackup;
  deleteBackup: (id: string) => void;
  refreshHealthMetrics: () => void;
}

const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  companyName: 'Aero Enterprise Global Inc.',
  legalName: 'Aero Technologies LLC',
  taxId: 'US-EIN-894321908',
  registrationNumber: 'REG-DEL-2024-9988',
  supportEmail: 'secops@enterprise.aero',
  supportPhone: '+1 (800) 555-0199',
  websiteUrl: 'https://enterprise.aero',
  addressLine1: '100 Aerospace Blvd, Suite 400',
  addressLine2: 'Tech Innovation Park',
  city: 'Seattle',
  state: 'WA',
  zipCode: '98101',
  country: 'United States',
  timezone: 'America/Los_Angeles',
  fiscalYearStartMonth: 'April',
  logoUrl: 'https://picsum.photos/seed/aero-logo/200/60',
  faviconUrl: 'https://picsum.photos/seed/aero-fav/32/32',
};

const DEFAULT_STORES: StoreSetting[] = [
  {
    id: 'st-1',
    storeCode: 'US-MAIN',
    name: 'North America Flagship Store',
    domain: 'store.enterprise.aero',
    defaultLanguage: 'en-US',
    defaultCurrency: 'USD',
    isActive: true,
    inventoryStrategy: 'STRICT_ALLOCATION',
    checkoutRequirePhone: true,
    minOrderValue: 25,
  },
  {
    id: 'st-2',
    storeCode: 'EU-CENTRAL',
    name: 'Europe Central Portal',
    domain: 'eu.enterprise.aero',
    defaultLanguage: 'de-DE',
    defaultCurrency: 'EUR',
    isActive: true,
    inventoryStrategy: 'MULTI_WAREHOUSE_FULFILLMENT',
    checkoutRequirePhone: false,
    minOrderValue: 30,
  },
  {
    id: 'st-3',
    storeCode: 'APAC-SING',
    name: 'APAC Enterprise Hub',
    domain: 'apac.enterprise.aero',
    defaultLanguage: 'en-SG',
    defaultCurrency: 'SGD',
    isActive: true,
    inventoryStrategy: 'BACKORDER',
    checkoutRequirePhone: true,
    minOrderValue: 50,
  },
];

const DEFAULT_THEME: ThemeConfig = {
  mode: 'system',
  primaryColor: '#0f172a',
  accentColor: '#2563eb',
  fontFamily: 'Plus Jakarta Sans',
  borderRadius: '0.5rem',
  enableCustomCss: false,
  customCss: '/* Custom Enterprise CSS Overrides */\n.enterprise-badge { text-transform: uppercase; }',
};

const DEFAULT_LOCALIZATION: LocalizationConfig = {
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'es-ES', 'de-DE', 'fr-FR', 'ja-JP', 'zh-CN'],
  defaultCurrency: 'USD',
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR'],
  autoSyncExchangeRates: true,
  exchangeRateApiProvider: 'OpenExchangeRates Enterprise',
  dateFormat: 'MMM dd, yyyy',
  timeFormat: 'HH:mm:ss',
  decimalSeparator: '.',
  thousandSeparator: ',',
};

const DEFAULT_TAX_RULES: TaxRule[] = [
  {
    id: 'tax-1',
    region: 'California',
    country: 'United States',
    taxName: 'CA State Sales Tax',
    ratePercent: 7.25,
    isCompound: false,
    vatGstNumber: 'CA-SALES-9981',
    appliesToShipping: true,
    status: 'ACTIVE',
  },
  {
    id: 'tax-2',
    region: 'Germany / EU',
    country: 'Germany',
    taxName: 'Standard VAT',
    ratePercent: 19.0,
    isCompound: false,
    vatGstNumber: 'DE-VAT-88412093',
    appliesToShipping: true,
    status: 'ACTIVE',
  },
  {
    id: 'tax-3',
    region: 'United Kingdom',
    country: 'United Kingdom',
    taxName: 'UK VAT',
    ratePercent: 20.0,
    isCompound: false,
    vatGstNumber: 'GB-VAT-11928374',
    appliesToShipping: true,
    status: 'ACTIVE',
  },
];

const DEFAULT_GATEWAYS: CommunicationGatewayConfig[] = [
  {
    type: 'EMAIL',
    provider: 'Amazon SES Enterprise',
    isEnabled: true,
    senderAddress: 'noreply@enterprise.aero',
    senderName: 'Aero Enterprise System',
    apiKey: 'AKIAIOSFODNN7EXAMPLE',
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    useTls: true,
    dailyQuota: 50000,
    usedToday: 3412,
  },
  {
    type: 'SMS',
    provider: 'Twilio SMS API',
    isEnabled: true,
    senderAddress: '+18005550199',
    senderName: 'AeroSystem',
    apiKey: 'AC329847120398123981',
    apiSecret: 'secret_twilio_token_99812',
    dailyQuota: 10000,
    usedToday: 890,
  },
  {
    type: 'WHATSAPP',
    provider: 'Meta Business Cloud API',
    isEnabled: true,
    senderAddress: '+18005550199',
    senderName: 'Aero Enterprise Support',
    apiKey: 'EAAG98231093128312093',
    dailyQuota: 25000,
    usedToday: 1240,
  },
  {
    type: 'PUSH',
    provider: 'Firebase Cloud Messaging (FCM)',
    isEnabled: true,
    senderAddress: 'aero-fcm-project-id',
    senderName: 'Aero Admin App',
    apiKey: 'AIzaSyAEROENTERPRISE98423',
    dailyQuota: 100000,
    usedToday: 14200,
  },
];

const DEFAULT_INTEGRATIONS: ThirdPartyIntegration[] = [
  {
    id: 'int-1',
    name: 'Stripe Corporate Payments',
    category: 'PAYMENT',
    providerKey: 'stripe',
    apiKey: 'sk_live_51AERO88421938...',
    environment: 'PRODUCTION',
    isEnabled: true,
    lastSyncedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    healthStatus: 'HEALTHY',
  },
  {
    id: 'int-2',
    name: 'FedEx Express API',
    category: 'SHIPPING',
    providerKey: 'fedex',
    apiKey: 'FEDEX_LIVE_KEY_99812',
    environment: 'PRODUCTION',
    isEnabled: true,
    lastSyncedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    healthStatus: 'HEALTHY',
  },
  {
    id: 'int-3',
    name: 'Google Gemini 2.5 Pro (Server-Side)',
    category: 'AI',
    providerKey: 'gemini',
    apiKey: 'AIzaSyAERO_GEMINI_KEY...',
    environment: 'PRODUCTION',
    isEnabled: true,
    lastSyncedAt: new Date(Date.now() - 2 * 60000).toISOString(),
    healthStatus: 'HEALTHY',
  },
  {
    id: 'int-4',
    name: 'Google Maps Places & Geocoding',
    category: 'MAPS',
    providerKey: 'google_maps',
    apiKey: 'AIzaSyMAPS_KEY_8841',
    environment: 'PRODUCTION',
    isEnabled: true,
    lastSyncedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    healthStatus: 'HEALTHY',
  },
];

const DEFAULT_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: 'wh-1',
    name: 'ERP Order Sync Webhook',
    targetUrl: 'https://erp.enterprise.aero/api/v1/webhooks/orders',
    secretKey: 'whsec_aero_984129038',
    events: ['order.created', 'order.shipped', 'order.cancelled'],
    isEnabled: true,
    failureCount: 0,
    lastTriggeredAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: 'wh-2',
    name: 'CRM Customer Activity Webhook',
    targetUrl: 'https://crm.enterprise.aero/api/v1/webhooks/customers',
    secretKey: 'whsec_crm_112039123',
    events: ['customer.created', 'customer.group_changed'],
    isEnabled: true,
    failureCount: 1,
    lastTriggeredAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
];

const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'ff-1',
    key: 'ENABLE_AI_RECOMMENDATIONS',
    name: 'AI Product Recommendations Engine',
    description: 'Powers Gemini smart cross-selling suggestions in cart checkout.',
    status: 'ENABLED',
    rolloutPercentage: 100,
    targetRoles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OPERATOR'],
    module: 'Catalog',
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedBy: 'Yash Gupta',
  },
  {
    id: 'ff-2',
    key: 'ENABLE_REALTIME_INVENTORY_SYNC',
    name: 'Realtime Warehouse Inventory Sync',
    description: 'WebSocket stream for instant stock count updates across all warehouses.',
    status: 'BETA_ROLLOUT',
    rolloutPercentage: 50,
    targetRoles: ['SUPER_ADMIN', 'ADMIN', 'OPERATOR'],
    module: 'Inventory',
    updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedBy: 'Sarah Connor',
  },
  {
    id: 'ff-3',
    key: 'ENABLE_CRYPTO_PAYMENT_GATEWAY',
    name: 'Crypto & Web3 Payment Checkout',
    description: 'Allows USDC and BTC enterprise settlement gateways.',
    status: 'DISABLED',
    rolloutPercentage: 0,
    targetRoles: ['SUPER_ADMIN'],
    module: 'Payments',
    updatedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedBy: 'Yash Gupta',
  },
  {
    id: 'ff-4',
    key: 'ENABLE_ADVANCED_AUDIT_LOGGING',
    name: 'Deep Object Differential Audit Trail',
    description: 'Records JSON before/after snapshots on all mutation requests.',
    status: 'ENABLED',
    rolloutPercentage: 100,
    targetRoles: ['SUPER_ADMIN', 'ADMIN'],
    module: 'System',
    updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    updatedBy: 'Sarah Connor',
  },
];

const DEFAULT_SECURITY_POLICY: SecurityPolicy = {
  minPasswordLength: 12,
  requireSpecialChar: true,
  requireNumbers: true,
  requireUppercase: true,
  passwordExpiryDays: 90,
  mfaEnforcement: 'MANDATORY',
  maxLoginAttempts: 5,
  sessionTimeoutMinutes: 30,
  ipWhitelist: ['192.168.1.0/24', '10.0.0.0/16', '52.14.88.92'],
  ssoEnabled: true,
  ssoProvider: 'Okta SAML 2.0 / Azure AD',
};

const DEFAULT_ROLES: SystemRole[] = [
  {
    id: 'role-1',
    roleCode: 'SUPER_ADMIN',
    name: 'Super Administrator',
    description: 'Full unconstrained system control over all clusters, databases, and policies.',
    isSystem: true,
    permissions: ['all:access', 'manage:system', 'view:reports', 'manage:users'],
    userCount: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role-2',
    roleCode: 'ADMIN',
    name: 'Corporate Administrator',
    description: 'Full operational access to store settings, users, and product catalog.',
    isSystem: true,
    permissions: ['manage:catalog', 'manage:orders', 'view:reports', 'manage:crm'],
    userCount: 5,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role-3',
    roleCode: 'MANAGER',
    name: 'Operations Manager',
    description: 'Manages order fulfillment, inventory adjustments, and customer support.',
    isSystem: false,
    permissions: ['view:orders', 'edit:orders', 'view:inventory', 'edit:inventory'],
    userCount: 14,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role-4',
    roleCode: 'ACCOUNTANT',
    name: 'Finance & Tax Analyst',
    description: 'Read-only access to order billing, tax reports, and financial exports.',
    isSystem: false,
    permissions: ['view:finance', 'export:reports', 'view:tax'],
    userCount: 4,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role-5',
    roleCode: 'OPERATOR',
    name: 'Warehouse Operator',
    description: 'Access restricted to picking, packing, stock transfers, and barcode scanning.',
    isSystem: false,
    permissions: ['view:inventory', 'manage:stock'],
    userCount: 28,
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_USERS: SystemUser[] = [
  {
    id: 'u-1',
    email: 'ykgupta042@gmail.com',
    firstName: 'Yash',
    lastName: 'Gupta',
    roleCode: 'SUPER_ADMIN',
    department: 'Executive Engineering',
    status: 'ACTIVE',
    mfaEnabled: true,
    lastLoginAt: new Date(Date.now() - 8 * 60000).toISOString(),
    ipAddress: '192.168.1.101',
    avatarUrl: 'https://picsum.photos/seed/yash/80',
    createdAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 'u-2',
    email: 'admin@enterprise.com',
    firstName: 'Sarah',
    lastName: 'Connor',
    roleCode: 'ADMIN',
    department: 'IT SecOps',
    status: 'ACTIVE',
    mfaEnabled: true,
    lastLoginAt: new Date(Date.now() - 32 * 60000).toISOString(),
    ipAddress: '192.168.1.105',
    avatarUrl: 'https://picsum.photos/seed/sarah/80',
    createdAt: '2024-02-01T09:30:00.000Z',
  },
  {
    id: 'u-3',
    email: 'michael.scott@enterprise.com',
    firstName: 'Michael',
    lastName: 'Scott',
    roleCode: 'MANAGER',
    department: 'Regional Operations',
    status: 'ACTIVE',
    mfaEnabled: true,
    lastLoginAt: new Date(Date.now() - 140 * 60000).toISOString(),
    ipAddress: '10.0.4.12',
    avatarUrl: 'https://picsum.photos/seed/michael/80',
    createdAt: '2024-03-10T11:20:00.000Z',
  },
  {
    id: 'u-4',
    email: 'dwight.schrute@enterprise.com',
    firstName: 'Dwight',
    lastName: 'Schrute',
    roleCode: 'OPERATOR',
    department: 'Scranton Warehouse 1',
    status: 'INACTIVE',
    mfaEnabled: false,
    lastLoginAt: new Date(Date.now() - 86400 * 3000).toISOString(),
    ipAddress: '10.0.4.55',
    avatarUrl: 'https://picsum.photos/seed/dwight/80',
    createdAt: '2024-04-05T14:10:00.000Z',
  },
  {
    id: 'u-5',
    email: 'finance.analyst@enterprise.com',
    firstName: 'Oscar',
    lastName: 'Martinez',
    roleCode: 'ACCOUNTANT',
    department: 'Corporate Finance',
    status: 'ACTIVE',
    mfaEnabled: true,
    lastLoginAt: new Date(Date.now() - 50 * 60000).toISOString(),
    ipAddress: '192.168.1.188',
    avatarUrl: 'https://picsum.photos/seed/oscar/80',
    createdAt: '2024-05-20T10:00:00.000Z',
  },
];

const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    userEmail: 'ykgupta042@gmail.com',
    userName: 'Yash Gupta',
    role: 'SUPER_ADMIN',
    action: 'UPDATE_FEATURE_FLAG',
    module: 'System Administration',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'SUCCESS',
    details: 'Enabled feature flag ENABLE_AI_RECOMMENDATIONS to 100%',
    changesJson: JSON.stringify({ previous: '50%', current: '100%' }, null, 2),
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    userEmail: 'admin@enterprise.com',
    userName: 'Sarah Connor',
    role: 'ADMIN',
    action: 'FLUSH_SYSTEM_CACHE',
    module: 'Cache Manager',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'SUCCESS',
    details: 'Executed manual invalidation of CATALOG cache entries',
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    userEmail: 'michael.scott@enterprise.com',
    userName: 'Michael Scott',
    role: 'MANAGER',
    action: 'FAILED_LOGIN_ATTEMPT',
    module: 'Authentication',
    ipAddress: '10.0.4.12',
    userAgent: 'AeroMobile/2.4 Android',
    status: 'WARNING',
    details: 'Invalid password entered. Attempt 2 of 5.',
  },
  {
    id: 'log-104',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    userEmail: 'ykgupta042@gmail.com',
    userName: 'Yash Gupta',
    role: 'SUPER_ADMIN',
    action: 'CREATE_SYSTEM_BACKUP',
    module: 'Disaster Recovery',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'SUCCESS',
    details: 'Manual snapshot backup_2026_07_22_1200.sql generated (124.8 MB)',
  },
];

const DEFAULT_HEALTH_METRICS: SystemHealthMetrics = {
  uptimeSeconds: 1248900, // ~14.4 days
  cpuUsagePercent: 18.4,
  memoryUsagePercent: 42.1,
  diskUsagePercent: 31.8,
  activeDbConnections: 48,
  maxDbConnections: 200,
  queuePendingJobs: 14,
  queueFailedJobs: 0,
  avgResponseMs: 142,
  cacheHitRatioPercent: 94.8,
  lastUpdated: new Date().toISOString(),
};

const DEFAULT_CACHE_STATUS: CacheEntryStatus[] = [
  { key: 'catalog:products:*', category: 'CATALOG', itemsCount: 4500, sizeKb: 12400, lastFlushedAt: new Date(Date.now() - 25 * 60000).toISOString() },
  { key: 'user:sessions:*', category: 'SESSIONS', itemsCount: 142, sizeKb: 850, lastFlushedAt: new Date(Date.now() - 3600 * 1000).toISOString() },
  { key: 'app:route:static:*', category: 'ROUTES', itemsCount: 88, sizeKb: 3400, lastFlushedAt: new Date(Date.now() - 86400 * 1000).toISOString() },
  { key: 'reports:sales:aggregated', category: 'REPORTS', itemsCount: 12, sizeKb: 8900, lastFlushedAt: new Date(Date.now() - 7200 * 1000).toISOString() },
  { key: 'tax:matrix:rules', category: 'TAX', itemsCount: 15, sizeKb: 120, lastFlushedAt: new Date(Date.now() - 43200 * 1000).toISOString() },
];

const DEFAULT_BACKUPS: SystemBackup[] = [
  {
    id: 'bak-1',
    filename: 'aero_backup_2026_07_22_1200.sql.gz',
    sizeMb: 124.8,
    type: 'MANUAL',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    downloadUrl: '#',
  },
  {
    id: 'bak-2',
    filename: 'aero_auto_backup_2026_07_22_0000.sql.gz',
    sizeMb: 122.4,
    type: 'AUTOMATED',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    downloadUrl: '#',
  },
  {
    id: 'bak-3',
    filename: 'aero_auto_backup_2026_07_21_0000.sql.gz',
    sizeMb: 120.1,
    type: 'AUTOMATED',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 38 * 3600 * 1000).toISOString(),
    downloadUrl: '#',
  },
];

const DEFAULT_LICENSE_INFO: SystemLicenseInfo = {
  licenseKey: 'AERO-ENT-2026-9984-XXXX-PROD',
  edition: 'Enterprise Cluster Edition',
  companyName: 'Aero Enterprise Global Inc.',
  validUntil: '2028-12-31T23:59:59.000Z',
  maxUserSeats: 500,
  activeUserSeats: 53,
  installedVersion: 'v15.4.2-enterprise',
  buildHash: 'git-3f8a91c',
  updateAvailable: false,
  latestVersion: 'v15.4.2-enterprise',
};

export const useSystemStore = create<SystemState>((set, get) => ({
  companyProfile: DEFAULT_COMPANY_PROFILE,
  stores: DEFAULT_STORES,
  themeConfig: DEFAULT_THEME,
  localization: DEFAULT_LOCALIZATION,
  taxRules: DEFAULT_TAX_RULES,
  gateways: DEFAULT_GATEWAYS,
  integrations: DEFAULT_INTEGRATIONS,
  webhooks: DEFAULT_WEBHOOKS,
  featureFlags: DEFAULT_FEATURE_FLAGS,
  securityPolicy: DEFAULT_SECURITY_POLICY,
  roles: DEFAULT_ROLES,
  users: DEFAULT_USERS,
  auditLogs: DEFAULT_AUDIT_LOGS,
  healthMetrics: DEFAULT_HEALTH_METRICS,
  cacheStatus: DEFAULT_CACHE_STATUS,
  backups: DEFAULT_BACKUPS,
  licenseInfo: DEFAULT_LICENSE_INFO,

  updateCompanyProfile: (profile) =>
    set((state) => ({ companyProfile: { ...state.companyProfile, ...profile } })),

  updateStoreSetting: (id, store) =>
    set((state) => ({
      stores: state.stores.map((s) => (s.id === id ? { ...s, ...store } : s)),
    })),

  addStoreSetting: (storeData) => {
    const newStore: StoreSetting = {
      ...storeData,
      id: `st-${Date.now()}`,
    };
    set((state) => ({ stores: [...state.stores, newStore] }));
  },

  deleteStoreSetting: (id) =>
    set((state) => ({ stores: state.stores.filter((s) => s.id !== id) })),

  updateThemeConfig: (theme) =>
    set((state) => ({ themeConfig: { ...state.themeConfig, ...theme } })),

  updateLocalization: (loc) =>
    set((state) => ({ localization: { ...state.localization, ...loc } })),

  addTaxRule: (rule) => {
    const newRule: TaxRule = { ...rule, id: `tax-${Date.now()}` };
    set((state) => ({ taxRules: [newRule, ...state.taxRules] }));
  },

  updateTaxRule: (id, rule) =>
    set((state) => ({
      taxRules: state.taxRules.map((r) => (r.id === id ? { ...r, ...rule } : r)),
    })),

  deleteTaxRule: (id) =>
    set((state) => ({ taxRules: state.taxRules.filter((r) => r.id !== id) })),

  updateGatewayConfig: (type, config) =>
    set((state) => ({
      gateways: state.gateways.map((g) => (g.type === type ? { ...g, ...config } : g)),
    })),

  updateIntegration: (id, data) =>
    set((state) => ({
      integrations: state.integrations.map((i) => (i.id === id ? { ...i, ...data } : i)),
    })),

  addWebhook: (webhook) => {
    const newWh: WebhookEndpoint = {
      ...webhook,
      id: `wh-${Date.now()}`,
      failureCount: 0,
      lastTriggeredAt: new Date().toISOString(),
    };
    set((state) => ({ webhooks: [newWh, ...state.webhooks] }));
  },

  deleteWebhook: (id) =>
    set((state) => ({ webhooks: state.webhooks.filter((w) => w.id !== id) })),

  toggleFeatureFlag: (id) =>
    set((state) => ({
      featureFlags: state.featureFlags.map((ff) =>
        ff.id === id
          ? {
              ...ff,
              status: ff.status === 'ENABLED' ? 'DISABLED' : 'ENABLED',
              updatedAt: new Date().toISOString(),
            }
          : ff
      ),
    })),

  updateFeatureFlag: (id, flag) =>
    set((state) => ({
      featureFlags: state.featureFlags.map((ff) =>
        ff.id === id ? { ...ff, ...flag, updatedAt: new Date().toISOString() } : ff
      ),
    })),

  addFeatureFlag: (flag) => {
    const newFF: FeatureFlag = {
      ...flag,
      id: `ff-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ featureFlags: [newFF, ...state.featureFlags] }));
  },

  updateSecurityPolicy: (policy) =>
    set((state) => ({ securityPolicy: { ...state.securityPolicy, ...policy } })),

  addRole: (role) => {
    const newRole: SystemRole = {
      ...role,
      id: `role-${Date.now()}`,
      userCount: 0,
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ roles: [...state.roles, newRole] }));
  },

  updateRole: (id, role) =>
    set((state) => ({
      roles: state.roles.map((r) =>
        r.id === id ? { ...r, ...role, updatedAt: new Date().toISOString() } : r
      ),
    })),

  deleteRole: (id) =>
    set((state) => ({ roles: state.roles.filter((r) => r.id !== id && !r.isSystem) })),

  addUser: (userData) => {
    const newUser: SystemUser = {
      ...userData,
      id: `u-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: 'Never',
      ipAddress: 'N/A',
    };
    set((state) => ({ users: [newUser, ...state.users] }));
  },

  updateUser: (id, user) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)),
    })),

  toggleUserStatus: (id, status) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, status } : u)),
    })),

  deleteUser: (id) =>
    set((state) => ({ users: state.users.filter((u) => u.id !== id) })),

  addAuditLog: (log) => {
    const newLog: AuditLogItem = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
  },

  clearAuditLogs: () => set({ auditLogs: [] }),

  flushCache: (category) => {
    set((state) => ({
      cacheStatus: state.cacheStatus.map((c) =>
        category === 'ALL' || c.category === category
          ? { ...c, itemsCount: 0, sizeKb: 0, lastFlushedAt: new Date().toISOString() }
          : c
      ),
    }));
  },

  createBackup: (type) => {
    const newBackup: SystemBackup = {
      id: `bak-${Date.now()}`,
      filename: `aero_${type.toLowerCase()}_backup_${new Date().toISOString().replace(/[:.]/g, '_')}.sql.gz`,
      sizeMb: parseFloat((120 + Math.random() * 15).toFixed(1)),
      type,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      downloadUrl: '#',
    };
    set((state) => ({ backups: [newBackup, ...state.backups] }));
    return newBackup;
  },

  deleteBackup: (id) =>
    set((state) => ({ backups: state.backups.filter((b) => b.id !== id) })),

  refreshHealthMetrics: () =>
    set((state) => ({
      healthMetrics: {
        ...state.healthMetrics,
        cpuUsagePercent: parseFloat((15 + Math.random() * 20).toFixed(1)),
        memoryUsagePercent: parseFloat((38 + Math.random() * 10).toFixed(1)),
        activeDbConnections: Math.floor(40 + Math.random() * 20),
        lastUpdated: new Date().toISOString(),
      },
    })),
}));
