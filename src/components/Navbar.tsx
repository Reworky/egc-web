'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

const links = [
  { href: '/',        label: 'Главная' },
  { href: '/quests',  label: 'Квесты'  },
  { href: '/shop',    label: 'Магазин' },
  { href: '/profile', label: 'Профиль' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <nav
      className="sticky top-0 z-50 page-content"
      style={{
        background: 'rgba(5,5,15,0.75)',
        borderBottom: '1px solid rgba(124,58,237,0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
        {/* Логотип */}
        <Link href="/" className="shrink-0 flex items-center gap-2 group">
          <img src="/logo.png" alt="EGC" style={{ width: 36, height: 36, objectFit: 'contain', mixBlendMode: 'screen', flexShrink: 0 }} />
          <div className="hidden sm:flex flex-col leading-none">
            <span style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              fontSize: '0.95rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'white',
            }}>
              EXPERIENCE
            </span>
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #a855f7, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              GAMING CLUB
            </span>
          </div>
        </Link>

        {/* Навигация */}
        <div className="flex gap-1">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(168,85,247,0.2))',
                  border: '1px solid rgba(168,85,247,0.4)',
                  color: '#c084fc',
                  boxShadow: '0 0 12px rgba(124,58,237,0.25)',
                } : {
                  color: 'var(--muted)',
                  border: '1px solid transparent',
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Auth */}
        <div className="shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--pink))' }}
                >
                  {user.nickname.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium" style={{ color: 'white' }}>{user.nickname}</span>
              </div>
              <button
                onClick={logout}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link
              href="/profile"
              className="btn-primary px-4 py-1.5 text-sm inline-block"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
