'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import YandexAd from '@/components/YandexAd';
import SocialLinks from '@/components/SocialLinks';
import { PartnersFooter, isPartnersPath } from '@/components/PartnersChrome';

/** Подвал сайта игроков; в разделе для партнёров вместо него свой (без рекламы и без ссылок игрового сайта). */
export default function SiteFooter() {
  const pathname = usePathname();
  if (isPartnersPath(pathname)) return <PartnersFooter />;
  return (
    <footer className="page-content border-t py-8 text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted)', background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <YandexAd blockId="R-A-19801285-1" />
      </div>
      <nav className="ft-links max-w-6xl mx-auto px-4" aria-label="Документы">
        <Link href="/contacts">Контакты</Link>
        <Link href="/terms">Пользовательское соглашение</Link>
        <Link href="/rules">Правила выплат</Link>
        <Link href="/privacy">Политика конфиденциальности</Link>
      </nav>
      <nav className="ft-partners max-w-6xl mx-auto px-4" aria-label="Партнёрам">
        <span>Партнёрам и рекламодателям:</span>
        <Link href="/partners">Сотрудничество со студиями и брендами</Link>
      </nav>
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-semibold flex items-center gap-2" style={{ color: 'white' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="EGC" width={28} height={28} style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} />
          Experience Gaming Club
        </span>
        <SocialLinks />
        <span>© {new Date().getFullYear()} EGC. Все права защищены.</span>
      </div>
    </footer>
  );
}
