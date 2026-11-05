import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-sm focus-visible:ring-slate-900',
  secondary:
    'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm focus-visible:ring-blue-600',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-400',
  ghost:
    'text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm focus-visible:ring-rose-600',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  ),
);

Button.displayName = 'Button';
export default Button;
