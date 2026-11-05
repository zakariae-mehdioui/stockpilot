import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
