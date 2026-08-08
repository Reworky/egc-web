'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';

const links = [
  { href: '/',         label: 'Главная'     },
  { href: '/quests',   label: 'Квесты'      },
  { href: '/shop',     label: 'Магазин'     },
  { href: '/wheel',    label: '🎰 Колесо'   },
  { href: '/about',    label: 'О платформе' },
  { href: '/partners', label: 'Партнёрам'   },
  { href: '/profile',  label: 'Профиль'     },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Закрываем меню при смене страницы
  useEffect(() => { setOpen(false); }, [pathname]);

  // Блокируем скролл body когда меню открыто
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const activeStyle = {
    background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(168,85,247,0.2))',
    border: '1px solid rgba(168,85,247,0.4)',
    color: '#c084fc',
    boxShadow: '0 0 12px rgba(124,58,237,0.25)',
  };
  const idleStyle = { color: 'var(--muted)', border: '1px solid transparent' };

  return (
    <>
      <nav
        className="sticky top-0 z-50 page-content"
        style={{
          background: 'rgba(5,5,15,0.85)',
          borderBottom: '1px solid rgba(124,58,237,0.2)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Логотип */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <img
              src="/logo.png"
              alt="EGC"
              style={{ width: 36, height: 36, objectFit: 'contain', mixBlendMode: 'screen', flexShrink: 0 }}
            />
          </Link>

          {/* Десктоп-навигация */}
          <div className="hidden md:flex gap-1 flex-1 justify-center">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
                style={pathname === l.href ? activeStyle : idleStyle}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth (десктоп) */}
          <div className="hidden md:flex shrink-0 items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2">
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
              </>
            ) : (
              <Link href="/profile" className="btn-primary px-4 py-1.5 text-sm inline-block">
                Войти
              </Link>
            )}
          </div>

          {/* Мобильный правый блок: Auth + бургер */}
          <div className="flex md:hidden items-center gap-3">
            {/* Войти показываем только когда меню закрыто */}
            {!user && !open && (
              <Link href="/profile" className="btn-primary px-3 py-1 text-xs inline-block">
                Войти
              </Link>
            )}

            {/* Бургер-кнопка */}
            <button
              onClick={() => setOpen(v => !v)}
              aria-label="Меню"
              className="flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-1.5"
              style={{ border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)' }}
            >
              <span
                style={{
                  display: 'block', width: 18, height: 2,
                  background: '#c084fc',
                  borderRadius: 2,
                  transition: 'transform 0.2s, opacity 0.2s',
                  transform: open ? 'translateY(5px) rotate(45deg)' : 'none',
                }}
              />
              <span
                style={{
                  display: 'block', width: 18, height: 2,
                  background: '#c084fc',
                  borderRadius: 2,
                  transition: 'opacity 0.2s',
                  opacity: open ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: 'block', width: 18, height: 2,
                  background: '#c084fc',
                  borderRadius: 2,
                  transition: 'transform 0.2s, opacity 0.2s',
                  transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </div>

        </div>
      </nav>

      {/* Мобильное меню-оверлей */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 flex flex-col"
          style={{
            top: 56,
            background: 'rgba(5,5,15,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(124,58,237,0.15)',
          }}
        >
          <div className="flex flex-col p-4 gap-1 overflow-y-auto">
            {/* Блок пользователя вверху меню */}
            {user && (
              <div
                className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl"
                style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--pink))' }}
                >
                  {user.nickname.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold" style={{ color: 'white' }}>{user.nickname}</span>
              </div>
            )}
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-medium transition-all"
                style={pathname === l.href ? {
                  ...activeStyle,
                  fontSize: 16,
                } : {
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid transparent',
                }}
              >
                {l.label}
              </Link>
            ))}

            {user && (
              <button
                onClick={() => { setOpen(false); logout(); }}
                className="mt-4 px-4 py-3 rounded-xl text-base font-medium text-left transition-all"
                style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                Выйти
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
