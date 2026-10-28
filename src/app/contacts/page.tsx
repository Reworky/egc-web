import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import { BOT_URL, PARTNER_TG, PARTNER_TG_NAME, PARTNER_MAIL, CHANNEL_URL, PAYOUTS_URL } from '@/lib/contacts';

export const metadata: Metadata = { title: 'Контакты · EGC' };

const CARDS = [
  { title: 'Поддержка игроков', text: 'Квест не засчитался, вопрос по выплате или аккаунту: напишите в боте, раздел «Помощь» → «Поддержка». Отвечаем там же.', href: BOT_URL, label: 'Открыть бота' },
  { title: 'Партнёры и реклама', text: 'Студиям, издателям и рекламодателям: обсудим формат и стоимость под вашу задачу.', href: PARTNER_TG, label: `Telegram ${PARTNER_TG_NAME}` },
  { title: 'Почта', text: 'Для партнёров, документов и официальных запросов.', href: `mailto:${PARTNER_MAIL}`, label: PARTNER_MAIL },
  { title: 'Канал клуба', text: 'Новости, квесты и анонсы.', href: CHANNEL_URL, label: 'Канал в Telegram' },
  { title: 'Канал выплат и отзывов', text: 'Реальные выплаты и отзывы игроков.', href: PAYOUTS_URL, label: 'Канал выплат' },
];

export default function ContactsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <PageHead kicker="Связь" title="Контакты" text="Игрокам отвечает поддержка в боте, партнёрам и рекламодателям — по Telegram или почте." />
      <div className="hm-features">
        {CARDS.map(c => (
          <div key={c.title} className="hm-feature">
            <h3>{c.title}</h3>
            <p>{c.text}</p>
            <a href={c.href} target="_blank" rel="noopener noreferrer" className="hm-feature-cta">{c.label}</a>
          </div>
        ))}
      </div>
    </div>
  );
}
