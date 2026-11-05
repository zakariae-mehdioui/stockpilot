import type {
  ProductStatus,
  OrderStatus,
} from '@/types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return formatCurrency(value);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export const PRODUCT_STATUS_STYLES: Record<ProductStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  out_of_stock: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  discontinued: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  active: 'Active',
  out_of_stock: 'Out of Stock',
  discontinued: 'Discontinued',
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  processing: 'bg-blue-50 text-blue-700 ring-blue-700/20',
  shipped: 'bg-violet-50 text-violet-700 ring-violet-700/20',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  cancelled: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

export function totalPages(total: number, perPage: number): number {
  return Math.max(1, Math.ceil(total / perPage));
}
