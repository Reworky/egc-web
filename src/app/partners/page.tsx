'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import CountUp from '@/components/CountUp';
import './pt.css';

/** Простые контурные иконки (24x24), цвет берут из текста. */
const ICONS: Record<string, ReactNode> = {
  target: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></>),
  channel: (<><path d="M4 11v2a1 1 0 0 0 1 1h2l5 4V6L7 10H5a1 1 0 0 0-1 1Z" /><path d="M16 9a4 4 0 0 1 0 6" /><path d="M18.5 6.5a8 8 0 0 1 0 11" /></>),
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>),
  link: (<><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>),
  api: (<><path d="m8 8-4 4 4 4" /><path d="m16 8 4 4-4 4" /><path d="m13.5 5-3 14" /></>),
  studio: (<><path d="M12 3 4 6v5c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>),
  shot: (<><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="12" cy="12" r="3.2" /><path d="M7 5 8.5 3h7L17 5" /></>),
};

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <span className="pt-ic" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{ICONS[name]}</svg>
    </span>
  );
}

const COLLAB_ITEMS: { icon: keyof typeof ICONS; title: string; desc: string }[] = [
  {
    icon: 'target',
    title: 'Квест под вашу задачу',
    desc: 'Установка, регистрация, уровень в игре или подписка: игроки выполняют задание и получают EXC. Только целевая аудитория, только реальные действия, оплата за проверенный результат.',
  },
  {
    icon: 'channel',
    title: 'Пост в канале клуба',
    desc: 'Размещение в канале EGC в контент-плане клуба. Аудитория: игроки Brawl Stars, Clash Royale, CS2, Dota 2 и других игр.',
  },
  {
    icon: 'mail',
    title: 'Рассылка игрокам',
    desc: 'Сообщение в боте активным игрокам с кнопкой-ссылкой. Нативная интеграция без баннерной слепоты, показываем тем, кто заходил недавно.',
  },
  {
    icon: 'link',
    title: 'Партнёрство',
    desc: 'Co-branding, совместные турниры, интеграция вашей экономики с нашей токен-системой.',
  },
];

const VERIFY: { icon: keyof typeof ICONS; title: string; desc: string }[] = [
  { icon: 'api', title: 'Данные игры по API', desc: 'Прогресс сверяем с официальным API игры. Засчитывается только то, что произошло после взятия квеста. Сейчас так работают Brawl Stars, Clash Royale и Clash of Clans.' },
  { icon: 'studio', title: 'Подтверждение от студии', desc: 'Если у игры нет открытого API, подтверждение даёт студия: файл игроков, промокоды или ваш постбэк. Связку настраиваем под вас.' },
  { icon: 'shot', title: 'Скриншот и модерация', desc: 'Самый слабый способ, поэтому для результатов, за которые платит студия, мы предлагаем первые два. Повторные скриншоты проверяются.' },
];

const PROTECTIONS = ['Прирост от базовой линии', 'Проверка повторных скриншотов', 'Борьба с мультиаккаунтами', 'Кулдауны и лимиты', 'Ручной разбор спорных случаев'];

const STEPS = [
  { num: '01', title: 'Пишете нам', desc: 'Связываетесь через Telegram @GressToEx или email. Обсуждаем цели и формат.' },
  { num: '02', title: 'Формируем квест', desc: 'Мы создаём квест под вашу задачу: установить, сыграть, зарегистрироваться, оставить отзыв.' },
  { num: '03', title: 'Игроки выполняют', desc: 'Квест появляется в боте в течение 24 часов. Игроки выполняют задание, результат проверяется.' },
  { num: '04', title: 'Отчёт и оплата', desc: 'Вы получаете отчёт о выполнениях и платите только за реальный результат.' },
];

const PRICING_BAD = ['Платите за показы, клики, боты', 'Нет гарантии целевого действия', 'Аудитория случайная', 'Баннерная слепота и скипы', 'Дорого даже на тест'];
const PRICING_GOOD = ['Платите только за выполненный квест', 'Целевое действие — обязательное условие награды', 'Только геймеры, заинтересованные в играх', 'Нативный формат в игровом боте', 'Гибкий бюджет от малого бизнеса'];

const WHY_CARDS = [
  { title: 'Только реальные действия', desc: 'Квест выполнен — награда выдана. Бот проверяет факт выполнения, не просто просмотр.' },
  { title: 'Измеримый результат', desc: 'Полная статистика выполнений: сколько человек, когда, как быстро. Никаких чёрных ящиков.' },
  { title: 'Лояльная аудитория', desc: 'Игроки уже вовлечены в платформу. Они доверяют боту и мотивированы выполнять задания.' },
  { title: 'Быстрый запуск', desc: 'Квест появляется в боте в течение 24 часов. Никаких длинных согласований и брифов.' },
];

const AUDIENCE_CARDS = [
  { title: 'Разработчики игр', desc: 'Нужны тестировщики, первые пользователи, обратная связь — запускайте квест и получайте реальный фидбек.' },
  { title: 'Мобильные издатели', desc: 'Продвигаете мобильную игру? Квест «скачай и пройди туториал» приводит целевых игроков.' },
  { title: 'Организаторы турниров', desc: 'Анонс турнира в нашей аудитории геймеров — быстрый набор участников и зрителей.' },
  { title: 'Игровой бизнес', desc: 'Периферия, игровые кресла, подписки, стриминг-сервисы — ваша целевая аудитория уже здесь.' },
];

const PAY_MODELS = [
  { tag: 'CPI', title: 'Оплата за установку', desc: 'Игрок устанавливает вашу игру по ссылке и подтверждает установку. Вы платите за каждого проверенного игрока.' },
  { tag: 'CPL', title: 'Оплата за действие', desc: 'Регистрация, прохождение туториала, достижение уровня или другое целевое действие. Результат подтверждается автоматически или проверкой отчёта.' },
  { tag: 'SUB', title: 'Подписка на канал или сообщество', desc: 'Игрок подписывается, бот автоматически проверяет подписку, а удержание отслеживается неделю. Спонсор получает отчёт.' },
];

const FAQ = [
  { q: 'Как быстро запустится квест?', a: 'После согласования задачи квест появляется в боте в течение 24 часов, без длинных брифов и согласований.' },
  { q: 'За что именно мы платим?', a: 'Только за действия, которые прошли проверку: установку, регистрацию, уровень в игре или подписку с удержанием. Показы и клики не оплачиваются.' },
  { q: 'Как вы подтверждаете, что игрок выполнил задачу?', a: 'По официальному API игры, по подтверждению от вашей студии (файл игроков, промокоды или постбэк) или по скриншоту с проверкой модератора. Подробности и защита от накруток описаны на странице «Как мы проверяем».' },
  { q: 'Какая у вас аудитория?', a: 'Игроки Brawl Stars, Clash Royale, CS2, Dota 2 и других игр. Актуальные цифры по базе и активности видны вверху страницы и обновляются автоматически.' },
  { q: 'Сколько это стоит?', a: 'Бюджет гибкий, можно начать с небольшого теста. Ставку называем после обсуждения вашей игры и задачи, платите только за проверенный результат.' },
  { q: 'Какой отчёт мы получим?', a: 'Статистику выполнений: сколько игроков прошли задачу, когда и как быстро. Без «чёрных ящиков».' },
];

const BRIEF = ['Игра или продукт и ссылка на него', 'Что должен сделать игрок', 'Страны и платформы (iOS, Android, ПК)', 'Примерный бюджет и сроки'];

const TG_URL = 'https://t.me/GressToEx';
const MAIL_URL = 'mailto:allexperiencetrade@gmail.com';

/** Страница для студий и рекламодателей: тема «Игровой неон» (theme.css) и стили pt.css. */
export default function PartnersPage() {
  const [stats, setStats] = useState<{ total: number; newWeek: number } | null>(null);
  // Цифры проверки результата с сервера (/api/public/proof); null - мало данных или сервер недоступен, такой блок не показываем
  const [proof, setProof] = useState<{ activeWeek: number; autoApprovedPercent: number | null; retention7Percent: number | null } | null>(null);
  // Цифры показываем разом, когда оба запроса отработали: иначе они подменялись бы на глазах и сдвигали страницу
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = (url: string) => fetch(url).then(r => (r.ok ? r.json() : null)).catch(() => null);
    Promise.all([load('/api/stats'), load('/api/public/proof')]).then(([st, pr]) => {
      if (st && st.totalPlayers != null) setStats({ total: st.totalPlayers, newWeek: st.newUsersWeek ?? 0 });
      if (pr) setProof({ activeWeek: pr.activeWeek, autoApprovedPercent: pr.autoApprovedPercent, retention7Percent: pr.retention7Percent });
      setReady(true);
    });
  }, []);

  const hasLive = ready && (stats || proof);

  return (
    <div className="pt-page max-w-6xl mx-auto px-4 py-10">

      {/* ── Первый экран ── */}
      <section className="pt-hero">
        <div>
          <span className="hm-eyebrow"><i />Студиям, издателям и рекламодателям</span>
          <h1 className="font-gaming">
            Живые игроки для вашей игры. <em>Платите за результат</em>
          </h1>
          <p className="pt-hero-text">
            Размещайте квесты на нашей платформе: получайте целевых пользователей, реальные действия и измеримый результат.
          </p>
          <div className="hm-cta-row">
            <a href={TG_URL} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Написать в Telegram</a>
            <Link href="/partners/proof" className="hm-btn hm-btn-ghost">Как мы проверяем результат</Link>
          </div>
          <ul className="pt-bullets">
            <li>Оплата только за проверенное действие</li>
            <li>Запуск в течение 24 часов</li>
            <li>Отчёт по выполнениям</li>
          </ul>
        </div>

        <aside className="pt-live" aria-label="Аудитория в цифрах">
          <div className="pt-live-head"><b>Аудитория клуба</b><span className="hm-live"><i />LIVE</span></div>
          {!ready && (<><div className="pt-live-skel" /><div className="pt-live-skel" /><div className="pt-live-skel" /></>)}
          {hasLive && (
            <>
              {stats && <div className="pt-live-row"><span>игроков в базе</span><b><CountUp value={stats.total} /><i>+</i></b></div>}
              {stats && stats.newWeek > 0 && <div className="pt-live-row"><span>новых за неделю</span><b><CountUp value={stats.newWeek} /><i>+</i></b></div>}
              {proof && <div className="pt-live-row"><span>активных за неделю</span><b><CountUp value={proof.activeWeek} /></b></div>}
              {proof?.autoApprovedPercent != null && <div className="pt-live-row"><span>результатов подтверждает автоматика</span><b className="green"><CountUp value={proof.autoApprovedPercent} /><i>%</i></b></div>}
              {proof?.retention7Percent != null && <div className="pt-live-row"><span>новых активны через неделю</span><b className="green"><CountUp value={proof.retention7Percent} /><i>%</i></b></div>}
            </>
          )}
          <div className="pt-live-foot"><span>Цифры обновляются автоматически</span><Link href="/partners/proof">Все цифры проверки →</Link></div>
        </aside>
      </section>

      {/* ── Форматы ── */}
      <section className="pt-section reveal" style={{ marginTop: 28 }}>
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Что можно разместить</div>
            <h2 className="section-title">Форматы сотрудничества</h2>
          </div>
        </div>
        <div className="pt-grid c4">
          {COLLAB_ITEMS.map(item => (
            <div key={item.title} className="pt-card">
              <Icon name={item.icon} />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Проверка результата ── */}
      <section className="pt-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Результат без накруток</div>
            <h2 className="section-title">Как мы проверяем выполнение</h2>
            <p className="pt-sub">Студия платит за подтверждённое событие в игре, а не за публикацию. Игрок получает награду только после подтверждения.</p>
          </div>
        </div>
        <div className="pt-grid c3">
          {VERIFY.map(v => (
            <div key={v.title} className="pt-card">
              <Icon name={v.icon} />
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
        <ul className="pt-proof-list" aria-label="Защита от накруток">
          {PROTECTIONS.map(p => <li key={p}>{p}</li>)}
        </ul>
        <div className="pt-more">
          <Link href="/partners/proof" className="hm-btn hm-btn-ghost">Подробно о проверке и цифры</Link>
        </div>
      </section>

      {/* ── Модели оплаты ── */}
      <section className="pt-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Оплата</div>
            <h2 className="section-title">Модели оплаты</h2>
          </div>
        </div>
        <div className="pt-grid c3">
          {PAY_MODELS.map(m => (
            <div key={m.title} className="pt-card">
              <span className="pt-tag">{m.tag}</span>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
        <p className="pt-note">Ставки обсуждаем под вашу игру и задачу. Платите только за действия, которые прошли проверку.</p>
      </section>

      {/* ── Процесс ── */}
      <section className="pt-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Четыре шага</div>
            <h2 className="section-title">Как запустить квест-рекламу</h2>
          </div>
        </div>
        <div className="pt-steps">
          {STEPS.map(step => (
            <div key={step.num} className="pt-step">
              <div className="pt-step-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Почему EGC ── */}
      <section className="pt-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Преимущества</div>
            <h2 className="section-title">Почему выбирают EGC</h2>
          </div>
        </div>
        <div className="pt-grid c4">
          {WHY_CARDS.map(card => (
            <div key={card.title} className="pt-card">
              <h3 style={{ marginTop: 0 }}>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Сравнение ── */}
      <section className="pt-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Сравнение</div>
            <h2 className="section-title">Обычная реклама и EGC</h2>
          </div>
        </div>
        <div className="pt-vs">
          <div className="pt-col bad">
            <h3>Обычная реклама</h3>
            <ul>{PRICING_BAD.map(r => <li key={r}>{r}</li>)}</ul>
          </div>
          <div className="pt-col good">
            <h3>EGC квест-реклама</h3>
            <ul>{PRICING_GOOD.map(r => <li key={r}>{r}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* ── Аудитория ── */}
      <section className="pt-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Кому подходит</div>
            <h2 className="section-title">Бизнесу, чья аудитория — геймеры</h2>
          </div>
        </div>
        <div className="pt-grid c4">
          {AUDIENCE_CARDS.map(card => (
            <div key={card.title} className="pt-card">
              <h3 style={{ marginTop: 0 }}>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Вопросы ── */}
      <section className="pt-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Коротко о главном</div>
            <h2 className="section-title">Вопросы студий</h2>
          </div>
        </div>
        <div className="pt-faq">
          {FAQ.map(f => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Финальный призыв ── */}
      <section className="pt-cta reveal">
        <div>
          <h2 className="font-heading">Готовы привлечь игровую аудиторию?</h2>
          <p>Напишите нам: обсудим формат, запустим квест и замерим результат вместе. Стоимость назовём под вашу задачу.</p>
          <div className="hm-cta-row">
            <a href={TG_URL} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Telegram @GressToEx</a>
            <a href={MAIL_URL} className="hm-btn hm-btn-ghost">Написать на почту</a>
          </div>
        </div>
        <div className="pt-brief">
          <b>Что написать в первом сообщении</b>
          <ul>{BRIEF.map(b => <li key={b}>{b}</li>)}</ul>
        </div>
      </section>
    </div>
  );
}
