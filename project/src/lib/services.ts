import type {
  Product,
  ProductInput,
  Order,
  OrderInput,
  DashboardStats,
  RevenuePoint,
  CategoryShare,
} from '@/types';

const PRODUCTS_TABLE = 'products';
const ORDERS_TABLE = 'orders';

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from(PRODUCTS_TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from(ORDERS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createOrder(input: OrderInput): Promise<Order> {
  const { data, error } = await supabase
    .from(ORDERS_TABLE)
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateOrderStatus(id: string, status: OrderInput['status']): Promise<Order> {
  const { data, error } = await supabase
    .from(ORDERS_TABLE)
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [productsRes, ordersRes, lowStockRes] = await Promise.all([
    supabase.from(PRODUCTS_TABLE).select('id', { count: 'exact', head: true }),
    supabase.from(ORDERS_TABLE).select('id', { count: 'exact', head: true }),
    supabase
      .from(PRODUCTS_TABLE)
      .select('id', { count: 'exact', head: true })
      .lt('stock', 10)
      .neq('status', 'discontinued'),
  ]);

  if (productsRes.error) throw new Error(productsRes.error.message);
  if (ordersRes.error) throw new Error(ordersRes.error.message);

  const { data: revenueData, error: revenueError } = await supabase
    .from(ORDERS_TABLE)
    .select('total')
    .neq('status', 'cancelled');

  if (revenueError) throw new Error(revenueError.message);

  const revenue = (revenueData ?? []).reduce((sum, o) => sum + Number(o.total), 0);

  return {
    totalProducts: productsRes.count ?? 0,
    totalOrders: ordersRes.count ?? 0,
    revenue,
    lowStockCount: lowStockRes.count ?? 0,
  };
}

export async function fetchRevenueSeries(days = 14): Promise<RevenuePoint[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from(ORDERS_TABLE)
    .select('total, status, created_at')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  const buckets = new Map<string, { revenue: number; orders: number }>();
  for (let i = 0; i <= days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { revenue: 0, orders: 0 });
  }

  for (const order of data ?? []) {
    if (order.status === 'cancelled') continue;
    const key = order.created_at.slice(0, 10);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.revenue += Number(order.total);
      bucket.orders += 1;
    }
  }

  return Array.from(buckets.entries()).map(([date, v]) => ({
    date,
    revenue: Math.round(v.revenue * 100) / 100,
    orders: v.orders,
  }));
}

export async function fetchCategoryShare(): Promise<CategoryShare[]> {
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select('category');

  if (error) throw new Error(error.message);

  const counts = new Map<string, number>();
  for (const p of data ?? []) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export async function fetchRecentOrders(limit = 5): Promise<Order[]> {
  const { data, error } = await supabase
    .from(ORDERS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}
