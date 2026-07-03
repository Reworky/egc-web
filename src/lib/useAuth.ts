'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, UserProfile } from './api';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('egc_token');
    if (!token) { setLoading(false); return; }
    api.profile()
      .then(setUser)
      .catch(() => localStorage.removeItem('egc_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (tgData: Record<string, string>) => {
    const { token } = await api.authTelegram(tgData);
    localStorage.setItem('egc_token', token);
    const profile = await api.profile();
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('egc_token');
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}
