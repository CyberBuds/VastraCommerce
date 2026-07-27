export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface QueryParams extends PaginationParams {
  sort?: SortParams;
  filters?: FilterParams;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface QuickAction {
  label: string;
  icon: string;
  href: string;
  permission?: string;
}

export interface ActivityLog {
  id: string;
  user: {
    name: string;
    avatarUrl?: string;
    email: string;
  };
  action: string;
  target: string;
  timestamp: string;
}
