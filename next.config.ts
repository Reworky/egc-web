import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
