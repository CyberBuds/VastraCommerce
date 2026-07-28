import { api, BaseFeatureApi } from './api';
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
} from '@/features/system/types/systemTypes';
import { ApiResponse } from '@/types/common';

export class SystemService {
  static async getCompanyProfile(): Promise<ApiResponse<CompanyProfile>> {
    const res = await api.get<ApiResponse<CompanyProfile>>('/api/system/company');
    return res.data;
  }

  static async updateCompanyProfile(data: Partial<CompanyProfile>): Promise<ApiResponse<CompanyProfile>> {
    const res = await api.put<ApiResponse<CompanyProfile>>('/api/system/company', data);
    return res.data;
  }

  static async getStores(): Promise<ApiResponse<StoreSetting[]>> {
    const res = await api.get<ApiResponse<StoreSetting[]>>('/api/system/stores');
    return res.data;
  }

  static async getThemeConfig(): Promise<ApiResponse<ThemeConfig>> {
    const res = await api.get<ApiResponse<ThemeConfig>>('/api/system/theme');
    return res.data;
  }

  static async updateThemeConfig(data: Partial<ThemeConfig>): Promise<ApiResponse<ThemeConfig>> {
    const res = await api.put<ApiResponse<ThemeConfig>>('/api/system/theme', data);
    return res.data;
  }

  static async getLocalization(): Promise<ApiResponse<LocalizationConfig>> {
    const res = await api.get<ApiResponse<LocalizationConfig>>('/api/system/localization');
    return res.data;
  }

  static async updateLocalization(data: Partial<LocalizationConfig>): Promise<ApiResponse<LocalizationConfig>> {
    const res = await api.put<ApiResponse<LocalizationConfig>>('/api/system/localization', data);
    return res.data;
  }

  static async getTaxRules(): Promise<ApiResponse<TaxRule[]>> {
    const res = await api.get<ApiResponse<TaxRule[]>>('/api/system/tax');
    return res.data;
  }

  static async getGateways(): Promise<ApiResponse<CommunicationGatewayConfig[]>> {
    const res = await api.get<ApiResponse<CommunicationGatewayConfig[]>>('/api/system/gateways');
    return res.data;
  }

  static async getIntegrations(): Promise<ApiResponse<ThirdPartyIntegration[]>> {
    const res = await api.get<ApiResponse<ThirdPartyIntegration[]>>('/api/system/integrations');
    return res.data;
  }

  static async getWebhooks(): Promise<ApiResponse<WebhookEndpoint[]>> {
    const res = await api.get<ApiResponse<WebhookEndpoint[]>>('/api/system/webhooks');
    return res.data;
  }

  static async getFeatureFlags(): Promise<ApiResponse<FeatureFlag[]>> {
    const res = await api.get<ApiResponse<FeatureFlag[]>>('/api/system/feature-flags');
    return res.data;
  }

  static async getSecurityPolicy(): Promise<ApiResponse<SecurityPolicy>> {
    const res = await api.get<ApiResponse<SecurityPolicy>>('/api/system/security');
    return res.data;
  }

  static async updateSecurityPolicy(data: Partial<SecurityPolicy>): Promise<ApiResponse<SecurityPolicy>> {
    const res = await api.put<ApiResponse<SecurityPolicy>>('/api/system/security', data);
    return res.data;
  }

  static async getRoles(): Promise<ApiResponse<SystemRole[]>> {
    const res = await api.get<ApiResponse<SystemRole[]>>('/api/system/roles');
    return res.data;
  }

  static async getUsers(): Promise<ApiResponse<SystemUser[]>> {
    const res = await api.get<ApiResponse<SystemUser[]>>('/api/system/users');
    return res.data;
  }

  static async getAuditLogs(): Promise<ApiResponse<AuditLogItem[]>> {
    const res = await api.get<ApiResponse<AuditLogItem[]>>('/api/system/logs');
    return res.data;
  }

  static async getHealthMetrics(): Promise<ApiResponse<SystemHealthMetrics>> {
    const res = await api.get<ApiResponse<SystemHealthMetrics>>('/api/system/health');
    return res.data;
  }

  static async getCacheStatus(): Promise<ApiResponse<CacheEntryStatus[]>> {
    const res = await api.get<ApiResponse<CacheEntryStatus[]>>('/api/system/cache');
    return res.data;
  }

  static async getBackups(): Promise<ApiResponse<SystemBackup[]>> {
    const res = await api.get<ApiResponse<SystemBackup[]>>('/api/system/backups');
    return res.data;
  }

  static async getLicenseInfo(): Promise<ApiResponse<SystemLicenseInfo>> {
    const res = await api.get<ApiResponse<SystemLicenseInfo>>('/api/system/license');
    return res.data;
  }
}
