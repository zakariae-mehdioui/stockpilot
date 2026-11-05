import { Navigate, useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Loading..." />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
