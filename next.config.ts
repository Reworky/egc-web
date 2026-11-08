import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Только для локальной разработки: на сервере /api проксирует nginx, локально пробрасываем на API из NEXT_PUBLIC_API_URL
  async rewrites() {
    if (process.env.NODE_ENV !== 'development' || !process.env.NEXT_PUBLIC_API_URL) return [];
    return [{ source: '/api/:path*', destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*` }];
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
