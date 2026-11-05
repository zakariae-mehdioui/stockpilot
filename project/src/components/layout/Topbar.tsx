import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = user?.email?.split('@')[0] ?? 'Admin';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden flex-1 sm:block sm:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search anything..."
          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/10"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-slate-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {initials}
            </div>
            <span className="hidden text-sm font-medium text-slate-700 sm:block">{displayName}</span>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="truncate text-sm font-medium text-slate-900">{displayName}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile');
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <User className="h-4 w-4" /> Profile
              </button>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
