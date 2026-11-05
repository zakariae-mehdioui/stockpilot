import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Package,
  PackageX,
  AlertCircle,
} from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/services';
import {
  formatCurrency,
  formatDate,
  paginate,
  totalPages,
  PRODUCT_STATUS_STYLES,
  PRODUCT_STATUS_LABELS,
} from '@/lib/format';
import type { Product, ProductInput, ProductStatus } from '@/types';

const PER_PAGE = 8;
const CATEGORIES = ['Electronics', 'Apparel', 'Home', 'Sports', 'Beauty', 'Books'];
const STATUSES: ProductStatus[] = ['active', 'out_of_stock', 'discontinued'];

const emptyForm: ProductInput = {
  name: '',
  sku: '',
  category: CATEGORIES[0],
  price: 0,
  cost: 0,
  stock: 0,
  description: '',
  image_url: '',
  status: 'active',
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const pages = totalPages(filtered.length, PER_PAGE);
  const currentItems = paginate(filtered, page, PER_PAGE);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  const openCreate = () => {
    setFormMode('create');
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (p: Product) => {
    setFormMode('edit');
    setEditingId(p.id);
    setForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: Number(p.price),
      cost: Number(p.cost),
      stock: p.stock,
      description: p.description ?? '',
      image_url: p.image_url ?? '',
      status: p.status,
    });
    setFormError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.name.trim() || !form.sku.trim()) {
      setFormError('Name and SKU are required.');
      return;
    }
    setSaving(true);
    try {
      const payload: ProductInput = {
        ...form,
        price: Number(form.price),
        cost: Number(form.cost),
        stock: Number(form.stock),
        description: form.description || null,
        image_url: form.image_url || null,
      };
      if (formMode === 'edit' && editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your catalog, stock levels, and pricing.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <Card>
        <CardHeader
          title={`All Products (${filtered.length})`}
          subtitle="Search, filter, and manage your inventory"
        />
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, SKU, or category..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/10"
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="sm:w-40"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="sm:w-40"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {PRODUCT_STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner label="Loading products..." />
          </div>
        ) : currentItems.length === 0 ? (
          <EmptyState
            icon={<PackageX className="h-6 w-6" />}
            title="No products found"
            description="Try adjusting your search or filters, or add a new product."
            action={
              <Button onClick={openCreate} size="sm">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentItems.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                              <Package className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">{p.name}</p>
                          <p className="truncate text-xs text-slate-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{p.category}</td>
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {formatCurrency(Number(p.price))}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          p.stock < 10 ? 'font-semibold text-rose-600' : 'text-slate-600'
                        }
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={PRODUCT_STATUS_STYLES[p.status]}>
                        {PRODUCT_STATUS_LABELS[p.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailProduct(p)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          aria-label="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

      {/* Create / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={formMode === 'create' ? 'Add Product' : 'Edit Product'}
        description={formMode === 'create' ? 'Create a new product in your catalog.' : 'Update product details.'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button form="product-form" type="submit" loading={saving}>
              {formMode === 'create' ? 'Create Product' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
            </div>
          )}
          <Input
            label="Name"
            name="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Product name"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="SKU"
              name="sku"
              required
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="SKU-1001"
            />
            <Select
              label="Category"
              name="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Price ($)"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
            <Input
              label="Cost ($)"
              name="cost"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
            />
            <Input
              label="Stock"
              name="stock"
              type="number"
              min="0"
              required
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            />
          </div>
          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {PRODUCT_STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
          <Input
            label="Image URL"
            name="image_url"
            value={form.image_url ?? ''}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://..."
          />
          <Textarea
            label="Description"
            name="description"
            rows={3}
            value={form.description ?? ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short product description"
          />
        </form>
      </Modal>

      {/* Details modal */}
      <Modal
        open={!!detailProduct}
        onClose={() => setDetailProduct(null)}
        title="Product Details"
        size="md"
        footer={
          <Button variant="outline" onClick={() => setDetailProduct(null)}>
            Close
          </Button>
        }
      >
        {detailProduct && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {detailProduct.image_url ? (
                  <img
                    src={detailProduct.image_url}
                    alt={detailProduct.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <Package className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-slate-900">{detailProduct.name}</h3>
                <p className="text-sm text-slate-400">{detailProduct.sku}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className={PRODUCT_STATUS_STYLES[detailProduct.status]}>
                    {PRODUCT_STATUS_LABELS[detailProduct.status]}
                  </Badge>
                  <Badge className="bg-slate-100 text-slate-600 ring-slate-500/20">
                    {detailProduct.category}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div>
                <p className="text-xs text-slate-400">Price</p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(Number(detailProduct.price))}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Cost</p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(Number(detailProduct.cost))}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Stock</p>
                <p className="text-sm font-semibold text-slate-900">{detailProduct.stock} units</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Margin</p>
                <p className="text-sm font-semibold text-emerald-600">
                  {Number(detailProduct.price) > 0
                    ? `${Math.round(
                        ((Number(detailProduct.price) - Number(detailProduct.cost)) /
                          Number(detailProduct.price)) *
                          100,
                      )}%`
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Created</p>
                <p className="text-sm text-slate-700">{formatDate(detailProduct.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Updated</p>
                <p className="text-sm text-slate-700">{formatDate(detailProduct.updated_at)}</p>
              </div>
            </div>
            {detailProduct.description && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400">Description</p>
                <p className="mt-1 text-sm text-slate-600">{detailProduct.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-900">{deleteTarget?.name}</span>? This action
          cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
