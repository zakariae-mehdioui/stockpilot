import { type ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className = '', children }: CardProps) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 ${className}`}>
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className = '', children }: CardProps) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

export default Card;
