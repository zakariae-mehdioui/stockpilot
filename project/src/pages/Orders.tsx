import { useEffect, useMemo, useState } from 'react';
import { Search, ShoppingCart, AlertCircle, ChevronDown } from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { fetchOrders, updateOrderStatus } from '@/lib/services';
import {
  formatCurrency,
  formatDateTime,
  paginate,
  totalPages,
  ORDER_STATUS_STYLES,
  ORDER_STATUS_LABELS,
} from '@/lib/format';
import type { Order, OrderStatus } from '@/types';

const PER_PAGE = 10;
const STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders();
      setOrders(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesSearch =
        !q ||
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        (o.customer_email ?? '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const pages = totalPages(filtered.length, PER_PAGE);
  const currentItems = paginate(filtered, page, PER_PAGE);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const totalRevenue = useMemo(
    () =>
      filtered
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.total), 0),
    [filtered],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track and manage customer orders and fulfillment status.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ['Total Orders', filtered.length.toString()],
          ['Filtered Revenue', formatCurrency(totalRevenue)],
          [
            'Pending',
            filtered.filter((o) => o.status === 'pending').length.toString(),
          ],
          [
            'Delivered',
            filtered.filter((o) => o.status === 'delivered').length.toString(),
          ],
        ].map(([label, value]) => (
          <Card key={label} className="p-4">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader
          title={`All Orders (${filtered.length})`}
          subtitle="Search, filter, and update fulfillment status"
        />
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by order number, customer name, or email..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="sm:w-44"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner label="Loading orders..." />
          </div>
        ) : currentItems.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart className="h-6 w-6" />}
            title="No orders found"
            description="Try adjusting your search or status filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentItems.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-slate-900">{order.order_number}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-700">{order.customer_name}</p>
                      <p className="text-xs text-slate-400">{order.customer_email}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDateTime(order.created_at)}</td>
                    <td className="px-5 py-3 text-slate-600">{order.items_count}</td>
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {formatCurrency(Number(order.total))}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Badge className={ORDER_STATUS_STYLES[order.status]}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                        <div className="relative">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="h-7 w-7 cursor-pointer appearance-none rounded-md border border-transparent bg-transparent pl-1 pr-4 text-xs text-slate-400 hover:bg-slate-100 focus:border-slate-300 focus:outline-none disabled:opacity-50"
                            title="Change status"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {ORDER_STATUS_LABELS[s]}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-0.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <Pagination
            page={page}
            totalPages={pages}
            total={filtered.length}
            perPage={PER_PAGE}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  );
}
