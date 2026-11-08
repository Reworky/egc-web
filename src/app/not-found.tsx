import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Страница не найдена · EGC' };

/** Страница 404 в стиле сайта: вместо английской заглушки Next.js. */
export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="hm-kicker">Ошибка 404</div>
      <h1 className="font-gaming" style={{ fontSize: 'clamp(2.4rem, 8vw, 4.5rem)', lineHeight: 1.05, color: '#fff', margin: '14px 0' }}>
        Здесь <em style={{ fontStyle: 'normal', color: 'var(--cyan)' }}>пусто</em>
      </h1>
      <p style={{ color: 'var(--muted)', maxWidth: 480, margin: '0 auto 28px' }}>
        Такой страницы нет или она переехала. Вернись на главную или загляни к студиям.
      </p>
      <div className="hm-cta-row">
        <Link href="/" className="hm-btn hm-btn-main">На главную</Link>
        <Link href="/partners" className="hm-btn hm-btn-ghost">Сотрудничество</Link>
      </div>
    </div>
  );
}
