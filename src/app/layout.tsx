import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import './globals.css';
import './home.css';
import './theme.css';
import Navbar from '@/components/Navbar';
import ScrollRevealInit from '@/components/ScrollRevealInit';
import YandexAd from '@/components/YandexAd';
import SocialLinks from '@/components/SocialLinks';
import RouteGuard from '@/components/RouteGuard';
import { AuthProvider } from '@/lib/useAuth';

export const metadata: Metadata = {
  title: 'EXPERIENCE GAMING CLUB',
  description: 'Получай реальные деньги за игры: выполняй квесты, зарабатывай EXC, выводи деньги. Бесплатно',
  icons: {
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png?v=3" />
        <link rel="shortcut icon" href="/favicon-32.png?v=3" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&family=Exo+2:wght@500;600;700;800;900&family=Orbitron:wght@700;800;900&display=swap" rel="stylesheet" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-W5XKYX6MDJ" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-W5XKYX6MDJ');
        `}</Script>
        <Script id="yandex-rtb-init" strategy="afterInteractive">{`
          window.yaContextCb = window.yaContextCb || [];
        `}</Script>
        <Script src="https://yandex.ru/ads/system/context.js" strategy="afterInteractive" async />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          <ScrollRevealInit />
          <main className="flex-1 page-content"><RouteGuard>{children}</RouteGuard></main>
        </AuthProvider>
        <footer className="page-content border-t py-8 text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted)', background: 'var(--bg)' }}>
          <div className="max-w-6xl mx-auto px-4 mb-6">
            <YandexAd blockId="R-A-19801285-1" />
          </div>
          <nav className="ft-links max-w-6xl mx-auto px-4" aria-label="Разделы и документы">
            <Link href="/partners">Партнёрам</Link>
            <Link href="/advertisers">Рекламодателям</Link>
            <Link href="/contacts">Контакты</Link>
            <Link href="/terms">Пользовательское соглашение</Link>
            <Link href="/rules">Правила выплат</Link>
            <Link href="/privacy">Политика конфиденциальности</Link>
          </nav>
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-semibold flex items-center gap-2" style={{ color: 'white' }}>
              <img src="/logo.png" alt="EGC" style={{ width: 28, height: 28, objectFit: 'contain', mixBlendMode: 'screen', flexShrink: 0 }} />
              Experience Gaming Club
            </span>
            <SocialLinks />
            <span>© {new Date().getFullYear()} EGC. Все права защищены.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
