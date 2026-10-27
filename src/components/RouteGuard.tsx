'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAuth } from '@/lib/useAuth';
import TelegramLoginButton from '@/components/TelegramLoginButton';
import PageHead from '@/components/PageHead';

/** Разделы, которые видны только после входа. Гость вместо них получает экран входа. */
const MEMBER_ONLY = ['/quests', '/shop', '/wheel'];

export default function RouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading, login, error } = useAuth();

  const closed = MEMBER_ONLY.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (!closed || user) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p style={{ color: 'var(--muted)' }}>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-6">
      <PageHead
        kicker="Только для игроков"
        title="Войди, чтобы продолжить"
        text="Квесты и магазин доступны после входа через Telegram. Если ты ещё не в клубе, сначала открой бота и пройди регистрацию."
      />
      <div className="hm-panel space-y-4 text-center">
        <TelegramLoginButton botUsername="invitetogamebot" onAuth={login} />
        <a href="https://t.me/invitetogamebot?start=src_site_login" target="_blank" rel="noopener noreferrer" className="hm-ghost-btn inline-block">
          Открыть бота
        </a>
        {error && (
          <div className="text-xs rounded-lg px-3 py-2 text-left break-all" style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
