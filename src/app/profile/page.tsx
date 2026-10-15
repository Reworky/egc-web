'use client';

import { useAuth } from '@/lib/useAuth';
import ProfileTabs from '@/components/ProfileTabs';
import TelegramLoginButton from '@/components/TelegramLoginButton';
import PageHead from '@/components/PageHead';

export default function ProfilePage() {
  const { user, loading, login, logout, error } = useAuth();


  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p style={{ color: 'var(--muted)' }}>Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-6">
        <PageHead
          kicker="Личный кабинет"
          title="Профиль"
          text="Войди через Telegram, чтобы видеть баланс, историю квестов и заявки на награды. Аккаунт создаётся автоматически через бота."
        />
        <div className="hm-panel space-y-4 text-center">
          <TelegramLoginButton botUsername="invitetogamebot" onAuth={login} />
          {error && (
            <div className="text-xs rounded-lg px-3 py-2 text-left break-all" style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444' }}>
              ❌ {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  const xpForNext: Record<number, number> = { 1: 1000, 2: 5000, 3: 15000, 4: 35000, 5: 75000, 6: 150000, 7: 300000 };
  const nextXp = xpForNext[user.level] ?? null;
  const xpPercent = nextXp
    ? Math.min(100, Math.round((user.xp / nextXp) * 100))
    : 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

      {/* Шапка */}
      <div className="hm-panel space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading" style={{ fontSize: '1.9rem', color: '#fff', textTransform: 'none' }}>{user.nickname}</h1>
            {user.profileTitle && (
              <p className="text-sm mt-0.5" style={{ color: 'var(--accent2)' }}>{user.profileTitle}</p>
            )}
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              {user.levelName} · {user.country}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="gradient-text-gold" style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: '2rem', lineHeight: 1.1 }}>{user.coins.toLocaleString('ru')}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>EXC на балансе</div>
          </div>
        </div>

        {/* XP прогресс */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
            <span>Уровень {user.level} — {user.levelName}</span>
            <span>{user.xp.toLocaleString('ru')} {nextXp ? `/ ${nextXp.toLocaleString('ru')}` : ''} XP</span>
          </div>
          <div className="hm-xp"><i style={{ width: `${xpPercent}%` }} /></div>
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
          <div key={s.label} className="hm-mini">
            <div className="text-lg">{s.icon}</div>
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Платформы и интересы */}
      <div className="hm-row space-y-2">
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
      <button onClick={logout} className="hm-ghost-btn">
        Выйти из аккаунта
      </button>
    </div>
  );
}
