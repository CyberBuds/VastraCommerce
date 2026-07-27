import { create } from 'zustand';

export interface EnterpriseSettings {
  appName: string;
  currency: string;
  dateFormat: string;
  simulatedLatencyMs: number;
  autoLogoutMinutes: number;
  csvDelimiter: string;
  isMaintenanceMode: boolean;
}

interface SettingsState {
  settings: EnterpriseSettings;
  updateSettings: (settings: Partial<EnterpriseSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: EnterpriseSettings = {
  appName: 'Aero Enterprise',
  currency: 'USD',
  dateFormat: 'MMM dd, yyyy HH:mm',
  simulatedLatencyMs: 400,
  autoLogoutMinutes: 30,
  csvDelimiter: ',',
  isMaintenanceMode: false,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT_SETTINGS,
  updateSettings: (newSettings) =>
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
}));
