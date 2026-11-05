import { type SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', id, children, ...props }, ref) => {
    const selectId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 focus:border-slate-500 focus:ring-slate-500/20'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
export default Select;
