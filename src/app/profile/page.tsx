'use client';

import { useAuth } from '@/lib/useAuth';
import ProfileTabs from '@/components/ProfileTabs';
import TelegramLoginButton from '@/components/TelegramLoginButton';

export default function ProfilePage() {
  const { user, loading, login, logout } = useAuth();


  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p style={{ color: 'var(--muted)' }}>Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-2xl font-bold text-white">Личный кабинет</h1>
        <p style={{ color: 'var(--muted)' }}>
          Войди через Telegram чтобы видеть баланс, историю квестов и заявки на награды
        </p>
        <TelegramLoginButton botUsername="invitetogamebot" onAuth={login} />
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Войди через Telegram — аккаунт создаётся автоматически через бота
        </p>
      </div>
    );
  }

  const xpForNext: Record<number, number> = { 1: 1000, 2: 5000, 3: 15000, 4: 35000, 5: 75000, 6: 150000, 7: 300000 };
  const nextXp = xpForNext[user.level] ?? null;
  const xpPercent = nextXp
    ? Math.min(100, Math.round((user.xp / nextXp) * 100))
    : 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

      {/* Шапка */}
      <div className="rounded-2xl p-6 space-y-4"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{user.nickname}</h1>
            {user.profileTitle && (
              <p className="text-sm mt-0.5" style={{ color: 'var(--accent2)' }}>{user.profileTitle}</p>
            )}
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              {user.levelName} · {user.country}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-yellow-400">{user.coins.toLocaleString('ru')}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>EXC на балансе</div>
          </div>
        </div>

        {/* XP прогресс */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
            <span>Уровень {user.level} — {user.levelName}</span>
            <span>{user.xp.toLocaleString('ru')} {nextXp ? `/ ${nextXp.toLocaleString('ru')}` : ''} XP</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${xpPercent}%`, background: 'var(--accent)' }} />
          </div>
          {nextXp && (
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              До следующего уровня: {(nextXp - user.xp).toLocaleString('ru')} XP
            </p>
          )}
        </div>
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Квестов', value: user.completedQuests, icon: '✅' },
          { label: 'Дней подряд', value: user.streakDays, icon: '🔥' },
          { label: 'Лимит/мес', value: `${(user.monthlyWithdrawalLimit / 1000).toFixed(0)}к EXC`, icon: '📤' },
          { label: 'Доступно', value: `${(user.remainingWithdrawalLimit / 1000).toFixed(0)}к EXC`, icon: '💸' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            <div className="text-lg">{s.icon}</div>
            <div className="text-lg font-bold text-white mt-1">{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Платформы и интересы */}
      <div className="rounded-xl p-4 space-y-2"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
        <div className="flex gap-2 text-sm flex-wrap">
          <span style={{ color: 'var(--muted)' }}>🖥 Платформы:</span>
          <span className="text-white">{user.platformsCsv || '—'}</span>
        </div>
        <div className="flex gap-2 text-sm flex-wrap">
          <span style={{ color: 'var(--muted)' }}>🎯 Интересы:</span>
          <span className="text-white">{user.interestsCsv || '—'}</span>
        </div>
      </div>

      {/* Вкладки истории */}
      <ProfileTabs />

      {/* Выйти */}
      <button
        onClick={logout}
        className="w-full py-2.5 rounded-xl text-sm transition-colors"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--muted)' }}
      >
        Выйти из аккаунта
      </button>
    </div>
  );
}
