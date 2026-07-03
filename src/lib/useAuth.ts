'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, UserProfile } from './api';

export function useAuth() {
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

  return { user, loading, login, logout, error };
}
