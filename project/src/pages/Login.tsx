import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Boxes, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    if (mode === 'signup') {
      setError(null);
      setMode('signin');
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:flex">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <Boxes className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">StockPilot</p>
            <p className="text-xs text-slate-400">Cloud Inventory Management</p>
          </div>
        </div>

        <div className="relative text-white">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Manage your inventory with precision.
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Real-time product tracking, order management, and revenue insights — all in one
            cloud-native dashboard built for modern teams.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              ['24/7', 'Monitoring'],
              ['Real-time', 'Sync'],
              ['99.9%', 'Uptime'],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="text-2xl font-semibold text-white">{stat}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} StockPilot. All rights reserved.
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Boxes className="h-5 w-5" />
            </div>
            <p className="text-lg font-semibold text-slate-900">StockPilot</p>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            {mode === 'signin'
              ? 'Sign in to your dashboard to continue.'
              : 'Start managing your inventory in minutes.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@stockpilot.io"
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Lock className="pointer-events-none absolute right-3 top-9 h-4 w-4 text-slate-400" />
            </div>

            {mode === 'signin' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
                  Remember me
                </label>
                <button type="button" className="font-medium text-blue-600 hover:text-blue-700">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {mode === 'signin' ? 'Sign in' : 'Create account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="font-medium text-slate-900 hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className="font-medium text-slate-900 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
            <p className="font-medium text-slate-600">Demo access</p>
            <p className="mt-1">
              Create any account with email + a password of 6+ characters. After signing up, switch
              to Sign in to enter the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
