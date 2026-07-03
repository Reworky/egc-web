import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import BackgroundCanvas from '@/components/BackgroundCanvas';

export const metadata: Metadata = {
  title: 'EXPERIENCE GAMING CLUB',
  description: 'Выполняй квесты, зарабатывай EXC, выводи реальные деньги',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Rajdhani:wght@500;600;700&family=Orbitron:wght@700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <BackgroundCanvas />
        <div className="bg-orbs" />
        <Navbar />
        <main className="flex-1 page-content">{children}</main>
        <footer className="page-content border-t py-8 text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-semibold flex items-center gap-2" style={{ color: 'white' }}>
              <img src="/logo.png" alt="EGC" style={{ width: 24, height: 24, objectFit: 'contain', mixBlendMode: 'screen', flexShrink: 0 }} />
              EXPERIENCE GAMING CLUB
            </span>
<span>© 2025 EGC. Все права защищены.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
