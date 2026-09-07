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

const DEFAULT_COMPANY_PROFILE: CompanyProfile = {} as CompanyProfile;
const DEFAULT_STORES: StoreSetting[] = [];
const DEFAULT_THEME: ThemeConfig = {} as ThemeConfig;
const DEFAULT_LOCALIZATION: LocalizationConfig = {} as LocalizationConfig;
const DEFAULT_TAX_RULES: TaxRule[] = [];
const DEFAULT_GATEWAYS: CommunicationGatewayConfig[] = [];
const DEFAULT_INTEGRATIONS: ThirdPartyIntegration[] = [];
const DEFAULT_WEBHOOKS: WebhookEndpoint[] = [];
const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [];
const DEFAULT_SECURITY_POLICY: SecurityPolicy = {} as SecurityPolicy;
const DEFAULT_ROLES: SystemRole[] = [];
const DEFAULT_USERS: SystemUser[] = [];
const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [];
const DEFAULT_HEALTH_METRICS: SystemHealthMetrics = {} as SystemHealthMetrics;
const DEFAULT_CACHE_STATUS: CacheEntryStatus[] = [];
const DEFAULT_BACKUPS: SystemBackup[] = [];
const DEFAULT_LICENSE_INFO: SystemLicenseInfo = {} as SystemLicenseInfo;

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
