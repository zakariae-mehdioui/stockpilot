import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const textareaId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 focus:border-slate-500 focus:ring-slate-500/20'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
export default Textarea;
