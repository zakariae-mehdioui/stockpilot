import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import axios from 'axios';

interface User {
  id?: number;
  email: string;
  role?: string;
  name?: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);

      return { error: null };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Email ou mot de passe incorrect';

      return { error: message };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);

      return { error: null };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Erreur lors de la création du compte';

      return { error: message };
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    token,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}