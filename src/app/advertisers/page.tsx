import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/PageHead';
import CountUp from '@/components/CountUp';
import { api } from '@/lib/api';
import { PARTNER_TG, PARTNER_TG_NAME, PARTNER_MAIL } from '@/lib/contacts';

export const metadata: Metadata = { title: 'Рекламодателям · EGC' };
export const revalidate = 300;

const FORMATS = [
  { title: 'Квест от спонсора', desc: 'Игрок получает награду EXC за действие: подписку, регистрацию, установку. Вы платите за проверенный результат, а не за показы.' },
  { title: 'Пост в канале клуба', desc: 'Размещение в канале EGC в контент-плане клуба. Аудитория канала — игроки Brawl Stars, Clash Royale, CS2, Dota 2 и других игр.' },
  { title: 'Рассылка игрокам', desc: 'Сообщение в боте активным игрокам с кнопкой-ссылкой. Показываем тем, кто заходил в бот недавно.' },
  { title: 'Отчёт по результату', desc: 'Сколько игроков выполнили задание, как быстро и сколько осталось через неделю. Цифры без чёрных ящиков.' },
];

export default async function AdvertisersPage() {
  const stats = await api.stats().catch(() => null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <PageHead
        kicker="Рекламодателям"
        title="Реклама в игровой аудитории"
        text="Размещения в боте, канале и квестах клуба. Стоимость называем под вашу задачу, оплата за подтверждённый результат."
        chips={stats ? <span className="pg-chip"><b><CountUp value={stats.totalPlayers} /></b> игроков в базе</span> : undefined}
        actions={<>
          <a href={PARTNER_TG} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Написать в Telegram</a>
          <a href={`mailto:${PARTNER_MAIL}`} className="hm-btn hm-btn-ghost">Написать на почту</a>
        </>}
      />

      <section className="hm-section reveal" style={{ marginTop: 40 }}>
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Форматы</div>
            <h2 className="section-title">Что можно разместить</h2>
          </div>
        </div>
        <div className="hm-features">
          {FORMATS.map(f => (
            <div key={f.title} className="hm-feature">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hm-section reveal">
        <div className="hm-partner">
          <div>
            <div className="hm-kicker">Для студий и издателей</div>
            <h2 className="section-title">Нужны установки или игроки в вашу игру?</h2>
            <p>Для этого есть отдельная страница: модели оплаты CPI и CPL, пилотный квест и прозрачная проверка результата.</p>
          </div>
          <div className="hm-partner-btns">
            <Link href="/partners" className="hm-btn hm-btn-main">Страница для студий</Link>
            <Link href="/partners/proof" className="hm-btn hm-btn-ghost">Как мы проверяем</Link>
          </div>
        </div>
      </section>

      <section className="hm-final reveal">
        <h2 className="font-heading">Обсудим размещение?</h2>
        <p>Напишите задачу и бюджет, ответим со стоимостью и форматом.</p>
        <div className="hm-cta-row">
          <a href={PARTNER_TG} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Telegram {PARTNER_TG_NAME}</a>
          <a href={`mailto:${PARTNER_MAIL}`} className="hm-btn hm-btn-ghost">{PARTNER_MAIL}</a>
        </div>
      </section>
    </div>
  );
}
