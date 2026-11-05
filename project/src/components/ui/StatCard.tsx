import { type LucideIcon } from 'lucide-react';
import Card from './Card';

interface StatCardProps {
  label: string;
  value: string;
  delta?: { value: string; positive: boolean };
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export default function StatCard({ label, value, delta, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <Card className="p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      {delta && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={`text-xs font-medium ${
              delta.positive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {delta.positive ? '↑' : '↓'} {delta.value}
          </span>
          <span className="text-xs text-slate-400">vs last period</span>
        </div>
      )}
    </Card>
  );
}
