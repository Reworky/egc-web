import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Сотрудничество со студиями — EXPERIENCE GAMING CLUB',
  description: 'Квесты на установку и достижение уровней в вашей игре: живые игроки, оплата только за проверенный результат, открытые цифры проверки.',
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
