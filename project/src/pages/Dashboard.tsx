import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import {
  fetchDashboardStats,
  fetchRevenueSeries,
  fetchCategoryShare,
  fetchRecentOrders,
} from '@/lib/services';
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  timeAgo,
  ORDER_STATUS_STYLES,
  ORDER_STATUS_LABELS,
} from '@/lib/format';
import type { DashboardStats, RevenuePoint, CategoryShare, Order } from '@/types';

const PIE_COLORS = ['#0f172a', '#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [categories, setCategories] = useState<CategoryShare[]>([]);
  const [recent, setRecent] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [s, r, c, o] = await Promise.all([
          fetchDashboardStats(),
          fetchRevenueSeries(14),
          fetchCategoryShare(),
          fetchRecentOrders(6),
        ]);
        if (!active) return;
        setStats(s);
        setRevenue(r);
        setCategories(c);
        setRecent(o);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner label="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-sm text-rose-600">{error}</p>
      </Card>
    );
  }

  const chartData = revenue.map((p) => ({
    ...p,
    label: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of your inventory and store performance.
          </p>
        </div>
        <Link
          to="/products"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 sm:mt-0"
        >
          Manage products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Products"
          value={stats ? stats.totalProducts.toLocaleString() : '0'}
          delta={{ value: '8.2%', positive: true }}
          icon={Package}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Total Orders"
          value={stats ? stats.totalOrders.toLocaleString() : '0'}
          delta={{ value: '12.5%', positive: true }}
          icon={ShoppingCart}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Revenue"
          value={stats ? formatCompactCurrency(stats.revenue) : '$0'}
          delta={{ value: '5.1%', positive: true }}
          icon={DollarSign}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          label="Low Stock Items"
          value={stats ? stats.lowStockCount.toLocaleString() : '0'}
          delta={{ value: '3', positive: false }}
          icon={AlertTriangle}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Revenue Overview"
            subtitle="Last 14 days"
            action={
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-4 w-4" /> Trending up
              </div>
            }
          />
          <CardBody className="pt-2">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  formatter={(v) => [formatCurrency(Number(v)), 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Products by Category" subtitle="Distribution" />
          <CardBody className="pt-2">
            {categories.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-400">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {categories.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, color: '#64748b' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader
          title="Recent Orders"
          subtitle="Latest 6 transactions"
          action={
            <Link
              to="/orders"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recent.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-medium text-slate-900">{order.order_number}</td>
                  <td className="px-5 py-3 text-slate-600">{order.customer_name}</td>
                  <td className="px-5 py-3">
                    <Badge className={ORDER_STATUS_STYLES[order.status]}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-5 py-3 text-slate-500" title={formatDate(order.created_at)}>
                    {timeAgo(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
