export type SystemRoleType = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'OPERATOR' | 'SUPPORT';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'LOCKED';

export type FeatureFlagStatus = 'ENABLED' | 'DISABLED' | 'BETA_ROLLOUT' | 'DEPRECATED';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';

export type GatewayType = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';

export interface CompanyProfile {
  companyName: string;
  legalName: string;
  taxId: string;
  registrationNumber: string;
  supportEmail: string;
  supportPhone: string;
  websiteUrl: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  timezone: string;
  fiscalYearStartMonth: string;
  logoUrl: string;
  faviconUrl: string;
}

export interface StoreSetting {
  id: string;
  storeCode: string;
  name: string;
  domain: string;
  defaultLanguage: string;
  defaultCurrency: string;
  isActive: boolean;
  inventoryStrategy: 'STRICT_ALLOCATION' | 'BACKORDER' | 'MULTI_WAREHOUSE_FULFILLMENT';
  checkoutRequirePhone: boolean;
  minOrderValue: number;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: string;
  enableCustomCss: boolean;
  customCss: string;
}

export interface LocalizationConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
  defaultCurrency: string;
  supportedCurrencies: string[];
  autoSyncExchangeRates: boolean;
  exchangeRateApiProvider: string;
  dateFormat: string;
  timeFormat: string;
  decimalSeparator: '.' | ',';
  thousandSeparator: ',' | '.' | ' ';
}

export interface TaxRule {
  id: string;
  region: string;
  country: string;
  taxName: string;
  ratePercent: number;
  isCompound: boolean;
  vatGstNumber: string;
  appliesToShipping: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CommunicationGatewayConfig {
  type: GatewayType;
  provider: string;
  isEnabled: boolean;
  senderAddress: string;
  senderName: string;
  apiKey: string;
  apiSecret?: string;
  host?: string;
  port?: number;
  useTls?: boolean;
  dailyQuota: number;
  usedToday: number;
}

export interface ThirdPartyIntegration {
  id: string;
  name: string;
  category: 'PAYMENT' | 'SHIPPING' | 'AI' | 'ANALYTICS' | 'MAPS';
  providerKey: string;
  apiKey: string;
  environment: 'PRODUCTION' | 'SANDBOX';
  isEnabled: boolean;
  lastSyncedAt: string;
  healthStatus: 'HEALTHY' | 'DEGRADED' | 'ERROR';
}

export interface WebhookEndpoint {
  id: string;
  name: string;
  targetUrl: string;
  secretKey: string;
  events: string[];
  isEnabled: boolean;
  failureCount: number;
  lastTriggeredAt: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  status: FeatureFlagStatus;
  rolloutPercentage: number;
  targetRoles: SystemRoleType[];
  module: string;
  updatedAt: string;
  updatedBy: string;
}

export interface SecurityPolicy {
  minPasswordLength: number;
  requireSpecialChar: boolean;
  requireNumbers: boolean;
  requireUppercase: boolean;
  passwordExpiryDays: number;
  mfaEnforcement: 'MANDATORY' | 'OPTIONAL' | 'DISABLED';
  maxLoginAttempts: number;
  sessionTimeoutMinutes: number;
  ipWhitelist: string[];
  ssoEnabled: boolean;
  ssoProvider: string;
}

export interface PermissionDefinition {
  id: string;
  module: string;
  action: 'view' | 'create' | 'edit' | 'delete' | 'export' | 'approve';
  label: string;
  description: string;
}

export interface SystemRole {
  id: string;
  roleCode: SystemRoleType;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: string[]; // Permission IDs
  userCount: number;
  updatedAt: string;
}

export interface SystemUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleCode: SystemRoleType;
  department: string;
  status: UserStatus;
  mfaEnabled: boolean;
  lastLoginAt: string;
  ipAddress: string;
  avatarUrl: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  role: SystemRoleType;
  action: string;
  module: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  details: string;
  changesJson?: string;
}

export interface SystemHealthMetrics {
  uptimeSeconds: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  diskUsagePercent: number;
  activeDbConnections: number;
  maxDbConnections: number;
  queuePendingJobs: number;
  queueFailedJobs: number;
  avgResponseMs: number;
  cacheHitRatioPercent: number;
  lastUpdated: string;
}

export interface CacheEntryStatus {
  key: string;
  category: 'CATALOG' | 'SESSIONS' | 'ROUTES' | 'REPORTS' | 'TAX';
  itemsCount: number;
  sizeKb: number;
  lastFlushedAt: string;
}

export interface SystemBackup {
  id: string;
  filename: string;
  sizeMb: number;
  type: 'AUTOMATED' | 'MANUAL';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  createdAt: string;
  downloadUrl: string;
}

export interface SystemLicenseInfo {
  licenseKey: string;
  edition: string;
  companyName: string;
  validUntil: string;
  maxUserSeats: number;
  activeUserSeats: number;
  installedVersion: string;
  buildHash: string;
  updateAvailable: boolean;
  latestVersion: string;
}
