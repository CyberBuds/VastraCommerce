import { create } from 'zustand';

interface LayoutState {
  isSidebarCollapsed: boolean;
  isSidebarPinned: boolean;
  isMobileSidebarOpen: boolean;
  globalLoading: boolean;
  activeMenuId: string;
  breadcrumbs: { label: string; href?: string }[];
  toggleSidebarCollapse: () => void;
  setSidebarCollapse: (collapsed: boolean) => void;
  toggleSidebarPin: () => void;
  setSidebarPin: (pinned: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebar: (open: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
  setActiveMenuId: (id: string) => void;
  setBreadcrumbs: (breadcrumbs: { label: string; href?: string }[]) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarCollapsed: false,
  isSidebarPinned: true,
  isMobileSidebarOpen: false,
  globalLoading: false,
  activeMenuId: 'dashboard',
  breadcrumbs: [{ label: 'Dashboard', href: '/dashboard' }],

  toggleSidebarCollapse: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapse: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebarPin: () => set((state) => ({ isSidebarPinned: !state.isSidebarPinned })),
  setSidebarPin: (pinned) => set({ isSidebarPinned: pinned }),
  toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  setMobileSidebar: (open) => set({ isMobileSidebarOpen: open }),
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  setActiveMenuId: (id) => set({ activeMenuId: id }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}));
