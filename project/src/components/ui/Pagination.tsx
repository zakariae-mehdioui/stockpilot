import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  total,
  perPage,
  onPageChange,
}: PaginationProps) {
  if (total === 0) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 sm:flex-row">
      <p className="text-xs text-slate-500">
        Showing <span className="font-medium text-slate-700">{from}</span>–
        <span className="font-medium text-slate-700">{to}</span> of{' '}
        <span className="font-medium text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="h-8 min-w-8 rounded-md px-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-slate-400">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`h-8 min-w-8 rounded-md px-2 text-sm font-medium transition-colors ${
              p === page
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-slate-400">…</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="h-8 min-w-8 rounded-md px-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
