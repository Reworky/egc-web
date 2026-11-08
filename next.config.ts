import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Только для локальной разработки: на сервере /api проксирует nginx, локально пробрасываем на API из NEXT_PUBLIC_API_URL
  async rewrites() {
    if (process.env.NODE_ENV !== 'development' || !process.env.NEXT_PUBLIC_API_URL) return [];
    return [{ source: '/api/:path*', destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*` }];
  },
  // Картинки и шрифты из public/ по умолчанию отдавались с max-age=0: браузер перепроверял каждый файл на каждой странице.
  async headers() {
    const week = 'public, max-age=86400, stale-while-revalidate=604800';
    return [
      { source: '/fonts/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/games/:path*', headers: [{ key: 'Cache-Control', value: week }] },
      { source: '/shop/:path*', headers: [{ key: 'Cache-Control', value: week }] },
      { source: '/cashout/:path*', headers: [{ key: 'Cache-Control', value: week }] },
      { source: '/logos/:path*', headers: [{ key: 'Cache-Control', value: week }] },
      { source: '/:file(logo.png|hero-exi.webp|favicon-32.png|apple-icon.png)', headers: [{ key: 'Cache-Control', value: week }] },
    ];
  },
  async redirects() {
    return [
      // Страницу «О платформе» убрали: всё нужное теперь на главной.
      { source: '/about', destination: '/', permanent: true },
      // «Рекламодателям» слито со страницей «Сотрудничество» (бывшая «Партнёрам»)
      { source: '/advertisers', destination: '/partners', permanent: true },
    ];
  },
};

export default nextConfig;
