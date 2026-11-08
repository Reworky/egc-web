'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PARTNER_MAIL, PARTNER_TG, PARTNER_TG_NAME } from '@/lib/contacts';

/** Раздел для партнёров (/partners/*, /en/partners/*) живёт отдельно от сайта игроков: своя шапка и свой подвал. */
export function isPartnersPath(pathname: string | null): boolean {
  return !!pathname && (pathname === '/partners' || pathname.startsWith('/partners/') || pathname === '/en/partners' || pathname.startsWith('/en/partners/'));
}

const T = {
  ru: {
    studios: 'Студиям и брендам', proof: 'Как мы проверяем', tg: 'Написать в Telegram', tgShort: 'Telegram',
    players: 'Сайт для игроков', terms: 'Пользовательское соглашение', privacy: 'Политика конфиденциальности',
    studiosShort: 'Студиям', proofShort: 'Проверка', proofHref: '/partners/proof', rights: 'Все права защищены.',
  },
  en: {
    studios: 'Studios & brands', proof: 'How we verify', tg: 'Write on Telegram', tgShort: 'Telegram',
    players: 'Players site', terms: 'Terms of use', privacy: 'Privacy policy',
    studiosShort: 'Studios', proofShort: 'Proof', proofHref: '/en/partners/proof', rights: 'All rights reserved.',
  },
};

function lang(pathname: string | null) {
  return pathname?.startsWith('/en/') ? T.en : T.ru;
}

export function PartnersNav() {
  const pathname = usePathname();
  const t = lang(pathname);
  const studiosHref = '/partners';
  const link = (href: string, label: string, short: string) => {
    const active = pathname === href;
    return (
      <Link href={href} className="px-1.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors"
        style={active ? { background: 'rgba(139,92,246,0.18)', color: '#ddd6fe' } : { color: 'var(--muted)' }}>
        <span className="hidden sm:inline">{label}</span><span className="sm:hidden">{short}</span>
      </Link>
    );
  };
  return (
    <nav className="site-nav" aria-label="Партнёрам"
      style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(20,21,35,0.98)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="max-w-6xl mx-auto h-14 flex items-center justify-between gap-2 sm:gap-3"
        style={{ paddingLeft: 'max(16px, env(safe-area-inset-left))', paddingRight: 'max(16px, env(safe-area-inset-right))' }}>
        <Link href={studiosHref} className="shrink-0 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="EGC" width={36} height={36} style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
          <span className="hidden sm:inline font-semibold text-white">EGC <span style={{ color: 'var(--accent2)' }}>Partners</span></span>
        </Link>
        <div className="flex items-center gap-1 flex-1 justify-center">
          {link(studiosHref, t.studios, t.studiosShort)}
          {link(t.proofHref, t.proof, t.proofShort)}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="hidden md:inline text-xs px-3 py-1.5 rounded-lg" style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}>{t.players}</Link>
          <a href={PARTNER_TG} target="_blank" rel="noopener noreferrer" className="btn-primary px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm inline-block">
            <span className="hidden sm:inline">{t.tg}</span><span className="sm:hidden">{t.tgShort}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

export function PartnersFooter() {
  const pathname = usePathname();
  const t = lang(pathname);
  return (
    <footer className="page-content border-t py-8 text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted)', background: 'var(--bg)' }}>
      <nav className="ft-links max-w-6xl mx-auto px-4" aria-label="Разделы">
        <Link href="/partners">{t.studios}</Link>
        <Link href={t.proofHref}>{t.proof}</Link>
        <Link href="/terms">{t.terms}</Link>
        <Link href="/privacy">{t.privacy}</Link>
        <Link href="/">{t.players}</Link>
      </nav>
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-semibold flex items-center gap-2" style={{ color: 'white' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="EGC" width={28} height={28} style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} />
          Experience Gaming Club
        </span>
        <span>
          <a href={PARTNER_TG} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent2)' }}>{PARTNER_TG_NAME}</a>
          {' · '}
          <a href={`mailto:${PARTNER_MAIL}`} style={{ color: 'var(--accent2)' }}>{PARTNER_MAIL}</a>
        </span>
        <span>© {new Date().getFullYear()} EGC. {t.rights}</span>
      </div>
    </footer>
  );
}
