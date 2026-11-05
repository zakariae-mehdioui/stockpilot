import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  User,
  Settings,
  Boxes,
  X,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">StockPilot</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Inventory Cloud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-slate-50 p-4 ring-1 ring-slate-200/60">
            <p className="text-xs font-semibold text-slate-900">Need help?</p>
            <p className="mt-1 text-xs text-slate-500">Check our docs or contact support.</p>
            <button className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700">
              View docs →
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
