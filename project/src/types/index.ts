export type ProductStatus = 'active' | 'out_of_stock' | 'discontinued';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  description: string | null;
  image_url: string | null;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  description?: string | null;
  image_url?: string | null;
  status: ProductStatus;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  status: OrderStatus;
  total: number;
  items_count: number;
  created_at: string;
  updated_at: string;
}

export interface OrderInput {
  order_number: string;
  customer_name: string;
  customer_email?: string | null;
  status: OrderStatus;
  total: number;
  items_count: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  lowStockCount: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryShare {
  category: string;
  count: number;
}
