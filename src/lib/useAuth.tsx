'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api, UserProfile } from './api';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  login: (tgData: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthState | null>(null);

/** Одно состояние входа на весь сайт: меню, главная и закрытые разделы видят одного и того же игрока. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('egc_token');
    if (!token) { setLoading(false); return; }
    api.profile()
      .then(setUser)
      .catch(() => localStorage.removeItem('egc_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (tgData: Record<string, unknown>) => {
    try {
      setError(null);
      const res = await api.authTelegram(tgData);
      if (!res.token) { setError('Нет токена: ' + JSON.stringify(res)); return; }
      localStorage.setItem('egc_token', res.token);
      const profile = await api.profile();
      setUser(profile);
    } catch (e: unknown) {
      setError(String(e));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('egc_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth нужно вызывать внутри AuthProvider');
  return ctx;
}
