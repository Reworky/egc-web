import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Вывод EXC: СБП, Telegram Stars, GRAM — EXPERIENCE GAMING CLUB',
  description: 'Выполняй квесты в играх, получай EXC и выводи их на карту по СБП, в Telegram Stars или GRAM, либо трать на донат в любимые игры. Бесплатно.',
};

export default function CashoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
