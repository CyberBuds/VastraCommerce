import { UserPermission } from '@/types/auth';

export interface MenuItem {
  id: string;
  title: string;
  href?: string;
  icon: string; // Dynamic icon string resolved to Lucide component
  permission?: UserPermission;
  children?: MenuItem[];
}

export const SIDEBAR_MENU: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    permission: 'view:dashboard',
  },
  {
    id: 'catalog',
    title: 'Catalog',
    icon: 'ShoppingBag',
    permission: 'view:catalog',
    children: [
      {
        id: 'products',
        title: 'Products List',
        href: '/dashboard/catalog/products',
        icon: 'CircleDot',
        permission: 'view:catalog',
      },
      {
        id: 'categories',
        title: 'Categories',
        href: '/dashboard/catalog/categories',
        icon: 'CircleDot',
        permission: 'view:catalog',
      },
    ],
  },
  {
    id: 'inventory',
    title: 'Inventory',
    icon: 'Warehouse',
    permission: 'view:inventory',
    children: [
      {
        id: 'stock',
        title: 'Stock Control',
        href: '/dashboard/inventory/stock',
        icon: 'CircleDot',
        permission: 'view:inventory',
      },
      {
        id: 'warehouses',
        title: 'Warehouses',
        href: '/dashboard/inventory/warehouses',
        icon: 'CircleDot',
        permission: 'view:inventory',
      },
    ],
  },
  {
    id: 'customers',
    title: 'Customers CRM',
    icon: 'Users',
    permission: 'view:customers',
    children: [
      {
        id: 'customers-list',
        title: 'Directory Ledger',
        href: '/dashboard/customers/list',
        icon: 'CircleDot',
        permission: 'view:customers',
      },
      {
        id: 'customer-groups',
        title: 'Pricing Groups',
        href: '/dashboard/customers/groups',
        icon: 'CircleDot',
        permission: 'view:customers',
      },
      {
        id: 'customer-segments',
        title: 'Dynamic Segments',
        href: '/dashboard/customers/segments',
        icon: 'CircleDot',
        permission: 'view:customers',
      },
      {
        id: 'customer-wallet',
        title: 'Wallets Register',
        href: '/dashboard/customers/wallet',
        icon: 'CircleDot',
        permission: 'view:customers',
      },
      {
        id: 'reward-points',
        title: 'Loyalty points',
        href: '/dashboard/customers/reward-points',
        icon: 'CircleDot',
        permission: 'view:customers',
      },
      {
        id: 'support-tickets',
        title: 'Support SLA Queue',
        href: '/dashboard/customers/support-tickets',
        icon: 'CircleDot',
        permission: 'view:customers',
      },
      {
        id: 'reviews',
        title: 'Review Auditing',
        href: '/dashboard/customers/reviews',
        icon: 'CircleDot',
        permission: 'view:customers',
      },
      {
        id: 'customer-notes',
        title: 'CRM Directives',
        href: '/dashboard/customers/notes',
        icon: 'CircleDot',
        permission: 'view:customers',
      },
      {
        id: 'customer-activity',
        title: 'Audit Stream',
        href: '/dashboard/customers/activity',
        icon: 'CircleDot',
        permission: 'view:customers',
      },
      {
        id: 'customer-reports',
        title: 'Metrics & Reports',
        href: '/dashboard/customers/reports',
        icon: 'CircleDot',
        permission: 'view:customers',
      },
    ],
  },
  {
    id: 'orders',
    title: 'Orders',
    icon: 'ShoppingCart',
    permission: 'view:orders',
    children: [
      {
        id: 'orders-list',
        title: 'Orders Ledger',
        href: '/dashboard/orders/list',
        icon: 'CircleDot',
        permission: 'view:orders',
      },
      {
        id: 'picking-packing',
        title: 'Picking & Packing Queue',
        href: '/dashboard/orders/picking-packing',
        icon: 'CircleDot',
        permission: 'view:orders',
      },
      {
        id: 'shipments',
        title: 'Shipments & Dispatch',
        href: '/dashboard/orders/shipments',
        icon: 'CircleDot',
        permission: 'view:orders',
      },
      {
        id: 'invoices',
        title: 'Invoicing Desk',
        href: '/dashboard/orders/invoices',
        icon: 'CircleDot',
        permission: 'view:orders',
      },
      {
        id: 'returns',
        title: 'Returns & Refunds',
        href: '/dashboard/orders/returns',
        icon: 'CircleDot',
        permission: 'view:orders',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments',
    icon: 'CreditCard',
    permission: 'view:payments',
    children: [
      {
        id: 'transactions',
        title: 'Transactions',
        href: '/dashboard/payments/transactions',
        icon: 'CircleDot',
        permission: 'view:payments',
      },
      {
        id: 'payouts',
        title: 'Payouts',
        href: '/dashboard/payments/payouts',
        icon: 'CircleDot',
        permission: 'view:payments',
      },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing',
    icon: 'Megaphone',
    permission: 'view:marketing',
    children: [
      {
        id: 'campaigns',
        title: 'Campaigns',
        href: '/dashboard/marketing/campaigns',
        icon: 'CircleDot',
        permission: 'view:marketing',
      },
      {
        id: 'coupons',
        title: 'Discount Coupons',
        href: '/dashboard/marketing/coupons',
        icon: 'CircleDot',
        permission: 'view:marketing',
      },
    ],
  },
  {
    id: 'cms',
    title: 'CMS',
    icon: 'FileText',
    permission: 'view:cms',
    children: [
      {
        id: 'pages',
        title: 'Pages',
        href: '/dashboard/cms/pages',
        icon: 'CircleDot',
        permission: 'view:cms',
      },
      {
        id: 'blogs',
        title: 'Blog Posts',
        href: '/dashboard/cms/blogs',
        icon: 'CircleDot',
        permission: 'view:cms',
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: 'BarChart3',
    permission: 'view:reports',
    children: [
      {
        id: 'sales-report',
        title: 'Sales Report',
        href: '/dashboard/reports/sales',
        icon: 'CircleDot',
        permission: 'view:reports',
      },
      {
        id: 'user-activity',
        title: 'User Activity',
        href: '/dashboard/reports/activity',
        icon: 'CircleDot',
        permission: 'view:reports',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'Settings',
    permission: 'view:settings',
    children: [
      {
        id: 'general-settings',
        title: 'General Settings',
        href: '/dashboard/settings/general',
        icon: 'CircleDot',
        permission: 'view:settings',
      },
      {
        id: 'security-settings',
        title: 'Security',
        href: '/dashboard/settings/security',
        icon: 'CircleDot',
        permission: 'view:settings',
      },
    ],
  },
  {
    id: 'administration',
    title: 'Administration',
    icon: 'ShieldCheck',
    permission: 'view:administration',
    children: [
      {
        id: 'user-management',
        title: 'User Management',
        href: '/dashboard/administration/users',
        icon: 'CircleDot',
        permission: 'view:administration',
      },
      {
        id: 'role-permissions',
        title: 'Roles & Permissions',
        href: '/dashboard/administration/roles',
        icon: 'CircleDot',
        permission: 'view:administration',
      },
    ],
  },
  {
    id: 'system',
    title: 'System',
    icon: 'Cpu',
    permission: 'manage:system',
    children: [
      {
        id: 'system-logs',
        title: 'System Logs',
        href: '/dashboard/system/logs',
        icon: 'CircleDot',
        permission: 'manage:system',
      },
      {
        id: 'environment-vars',
        title: 'Environment Vars',
        href: '/dashboard/system/env',
        icon: 'CircleDot',
        permission: 'manage:system',
      },
    ],
  },
];
