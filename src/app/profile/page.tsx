'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import ProfileTabs from '@/components/ProfileTabs';
import TelegramLoginButton from '@/components/TelegramLoginButton';
import PageHead from '@/components/PageHead';

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}

function daysSince(iso: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
}

const ICONS: Record<string, ReactNode> = {
  wallet: <path d="M3 7a2 2 0 0 1 2-2h12v3h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm13 6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />,
  check: <path d="M12 2l2.4 1.7 2.9-.1 1 2.8 2.4 1.7-.9 2.8.9 2.8-2.4 1.7-1 2.8-2.9-.1L12 22l-2.4-1.7-2.9.1-1-2.8L3.3 16l.9-2.8-.9-2.8 2.4-1.7 1-2.8 2.9.1L12 2Zm-1.2 12.6 4.6-4.6-1.2-1.2-3.4 3.4-1.6-1.6-1.2 1.2 2.8 2.8Z" />,
  users: <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 13c-2.7 0-6 1.3-6 4v2h12v-2c0-2.7-3.3-4-6-4Zm8 0c-.4 0-.8 0-1.2.1 1.3.9 2.2 2.2 2.2 3.9v2h5v-2c0-2.7-3.3-4-6-4Z" />,
  clock: <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v5.2l3.6 2.1-.8 1.3L11 13V7h2Z" />,
  gear: <path d="M19.4 13a7.6 7.6 0 0 0 0-2l2.1-1.6-2-3.4-2.5 1a7.4 7.4 0 0 0-1.7-1l-.4-2.7h-4l-.4 2.7a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.4L4.6 11a7.6 7.6 0 0 0 0 2l-2.1 1.6 2 3.4 2.5-1c.5.4 1.1.7 1.7 1l.4 2.7h4l.4-2.7c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.4L19.4 13ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />,
};

function Icon({ name }: { name: string }) {
  return <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">{ICONS[name]}</svg>;
}

function StatTile({ icon, value, label }: { icon: string; value: ReactNode; label: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
      <div className="shrink-0 flex items-center justify-center rounded-xl"
        style={{ width: 48, height: 48, background: 'var(--bg3)', color: 'var(--accent2)' }}>
        <Icon name={icon} />
      </div>
      <div className="min-w-0">
        <div className="gradient-text-gold" style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: '1.5rem', lineHeight: 1.1 }}>{value}</div>
        <div className="text-sm" style={{ color: 'var(--muted)' }}>{label}</div>
      </div>
    </div>
  );
}

/** Аватар: фото, загруженное в бота (нужна авторизация, поэтому через blob), иначе первая буква ника. */
function Avatar({ nickname, hasAvatar, frameColor }: { nickname: string; hasAvatar: boolean; frameColor: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!hasAvatar) return;
    let url: string | null = null;
    api.avatarBlob().then(b => { if (b) { url = URL.createObjectURL(b); setSrc(url); } }).catch(() => {});
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [hasAvatar]);
  return (
    <div className="shrink-0 rounded-full overflow-hidden flex items-center justify-center"
      style={{ width: 104, height: 104, border: `3px solid ${frameColor}`, background: 'linear-gradient(135deg,#7c3aed,#22d3ee)' }}>
      {src
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={src} alt="" className="w-full h-full object-cover" />
        : <span className="font-heading text-white" style={{ fontSize: '3rem', textTransform: 'uppercase' }}>{nickname.charAt(0)}</span>}
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading, login, logout, error } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

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
              {error}
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

  const joinedDays = user.joinedAt
    ? daysSince(user.joinedAt)
    : null;
  const exc = (n?: number) => (n === undefined ? '—' : n.toLocaleString('ru'));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">

      {/* Заголовок */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading" style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)', color: '#fff', textTransform: 'none' }}>Мой профиль</h1>
        <button onClick={() => setSettingsOpen(o => !o)} aria-expanded={settingsOpen}
          className="flex items-center gap-2 font-bold" style={{ color: 'var(--accent2)' }}>
          <Icon name="gear" /> Настройки
        </button>
      </div>

      {/* Настройки */}
      {settingsOpen && (
        <div className="hm-panel space-y-3">
          <div className="flex gap-2 text-sm flex-wrap">
            <span style={{ color: 'var(--muted)' }}>Платформы:</span>
            <span className="text-white">{user.platformsCsv || '—'}</span>
          </div>
          <div className="flex gap-2 text-sm flex-wrap">
            <span style={{ color: 'var(--muted)' }}>Интересы:</span>
            <span className="text-white">{user.interestsCsv || '—'}</span>
          </div>
          <div className="flex gap-2 text-sm flex-wrap">
            <span style={{ color: 'var(--muted)' }}>Страна:</span>
            <span className="text-white">{user.country || '—'}</span>
          </div>
          <div className="flex gap-2 text-sm flex-wrap">
            <span style={{ color: 'var(--muted)' }}>Дней подряд:</span>
            <span className="text-white">{user.streakDays}</span>
          </div>
          <div className="flex gap-2 text-sm flex-wrap">
            <span style={{ color: 'var(--muted)' }}>Лимит вывода в месяц:</span>
            <span className="text-white">
              {user.monthlyWithdrawalLimit.toLocaleString('ru')} EXC (доступно {user.remainingWithdrawalLimit.toLocaleString('ru')})
            </span>
          </div>
          <button onClick={logout} className="hm-ghost-btn">Выйти из аккаунта</button>
        </div>
      )}

      {/* Карточки: профиль + статистика */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="hm-panel flex items-center gap-4 sm:gap-6">
          <Avatar nickname={user.nickname} hasAvatar={!!user.hasAvatar} frameColor={user.avatarFrameColor || '#7c3aed'} />
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h2 className="font-heading truncate" style={{ fontSize: '1.7rem', color: '#fff', textTransform: 'none' }}>{user.nickname}</h2>
              {user.profileTitle && <p className="text-sm" style={{ color: 'var(--accent2)' }}>{user.profileTitle}</p>}
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                {joinedDays !== null
                  ? (joinedDays === 0 ? 'С нами с сегодняшнего дня' : `С нами ${joinedDays} ${plural(joinedDays, 'день', 'дня', 'дней')}`)
                  : user.country}
                {' · '}<span className="gradient-text-gold font-bold">{user.coins.toLocaleString('ru')} EXC</span>
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between gap-3 text-sm">
                <span className="font-bold" style={{ color: 'var(--accent2)' }}>Уровень {user.level} · {user.levelName}</span>
                <span className="text-xs self-center" style={{ color: 'var(--muted)' }}>
                  {nextXp ? `${(nextXp - user.xp).toLocaleString('ru')} XP до уровня` : 'Максимальный уровень'}
                </span>
              </div>
              <div className="hm-xp"><i style={{ width: `${xpPercent}%` }} /></div>
            </div>
          </div>
        </div>

        <div className="hm-panel grid grid-cols-2 gap-x-4 gap-y-6 content-center">
          <StatTile icon="wallet" value={<>{exc(user.totalEarnedExc)} <span style={{ fontSize: '1rem' }}>EXC</span></>} label="Всего заработано" />
          <StatTile icon="check" value={user.completedQuests} label="Выполнено квестов" />
          <StatTile icon="users" value={user.invitedFriends ?? 0} label="Приглашено друзей" />
          <StatTile icon="clock" value={<>{exc(user.earnedLast30DaysExc)} <span style={{ fontSize: '1rem' }}>EXC</span></>} label="Заработано за 30 дней" />
        </div>
      </div>

      {/* Вкладки: заработок / начатые квесты */}
      <ProfileTabs />
    </div>
  );
}
