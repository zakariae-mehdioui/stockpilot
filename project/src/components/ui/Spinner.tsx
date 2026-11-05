import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  className?: string;
  label?: string;
}

export default function Spinner({ className = '', label }: SpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-2 text-slate-500 ${className}`}>
      <Loader2 className="h-5 w-5 animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
