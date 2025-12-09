import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, users, setAccessToken } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  venmoHandle?: string;
  cashAppHandle?: string;
  paypalHandle?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to refresh token on mount
    auth.refresh()
      .then((res) => {
        setAccessToken(res.accessToken);
        setUser(res.user);
      })
      .catch(() => {
        // Not logged in
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const res = await auth.login({ email, password });
    setAccessToken(res.accessToken);
    setUser(res.user);
  };

  const signup = async (email: string, password: string, name: string) => {
    const res = await auth.signup({ email, password, name });
    setAccessToken(res.accessToken);
    setUser(res.user);
  };

  const logout = async () => {
    await auth.logout();
    setAccessToken(null);
    setUser(null);
  };

  const updateUser = async (data: Partial<User>) => {
    const updated = await users.update(data);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
