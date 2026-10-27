'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CountUp from '@/components/CountUp';

const COLLAB_ITEMS = [
  {
    title: 'Привлечение игроков',
    desc: 'Размещаем квест с вашей задачей — игроки выполняют и получают EXC-токены. Только целевая аудитория, только реальные действия.',
  },
  {
    title: 'Охват аудитории',
    desc: 'Анонс вашего продукта в нашем Telegram-боте. Нативная интеграция без баннерной слепоты, реальные цифры аудитории — на странице «Как мы проверяем результат».',
  },
  {
    title: 'Вход в проект',
    desc: 'Становитесь партнёром EGC: co-branding, совместные турниры, интеграция вашей экономики с нашей токен-системой.',
  },
];

const STEPS = [
  { num: '01', title: 'Пишете нам', desc: 'Связываетесь через Telegram @GressToEx или email. Обсуждаем цели и формат.' },
  { num: '02', title: 'Формируем квест', desc: 'Мы создаём квест под вашу задачу: установить, сыграть, зарегистрироваться, оставить отзыв.' },
  { num: '03', title: 'Игроки выполняют', desc: 'Квест появляется в боте. Игроки выполняют задание, подтверждают скриншотом.' },
  { num: '04', title: 'Отчёт и оплата', desc: 'Вы получаете отчёт о выполнениях и платите только за реальный результат.' },
];

const PRICING_BAD = [
  { text: 'Платите за показы, клики, боты' },
  { text: 'Нет гарантии целевого действия' },
  { text: 'Аудитория случайная' },
  { text: 'Баннерная слепота и скипы' },
  { text: 'Дорого даже на тест' },
];

const PRICING_GOOD = [
  { text: 'Платите только за выполненный квест' },
  { text: 'Целевое действие — обязательное условие награды' },
  { text: 'Только геймеры, заинтересованные в играх' },
  { text: 'Нативный формат в игровом боте' },
  { text: 'Гибкий бюджет от малого бизнеса' },
];

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

const TG_URL = 'https://t.me/GressToEx';
const MAIL_URL = 'mailto:allexperiencetrade@gmail.com';

/** Страница для студий и рекламодателей в стиле главной (hm-* из home.css). */
export default function PartnersPage() {
  const [stats, setStats] = useState<{ total: number; newWeek: number } | null>(null);
  // Цифры проверки результата с сервера (/api/public/proof); null - мало данных или сервер недоступен, такой блок не показываем
  const [proof, setProof] = useState<{ activeWeek: number; autoApprovedPercent: number | null; retention7Percent: number | null } | null>(null);
  // Плитки показываем разом, когда оба запроса отработали: иначе цифры подменялись бы на глазах, а плитки выскакивали по одной и сдвигали страницу
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = (url: string) => fetch(url).then(r => (r.ok ? r.json() : null)).catch(() => null);
    Promise.all([load('/api/stats'), load('/api/public/proof')]).then(([st, pr]) => {
      if (st && st.totalPlayers != null) setStats({ total: st.totalPlayers, newWeek: st.newUsersWeek ?? 0 });
      if (pr) setProof({ activeWeek: pr.activeWeek, autoApprovedPercent: pr.autoApprovedPercent, retention7Percent: pr.retention7Percent });
      setReady(true);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* ── Hero ── */}
      <section className="hm-hero">
        <div className="hm-hero-glow" />
        <div className="relative space-y-5">
          <span className="hm-eyebrow"><i />Партнёрам · игровая аудитория</span>
          <h1 className="font-gaming">
            Работаем с теми, кому нужна <em>игровая аудитория</em>
          </h1>
          <p className="text-lg sm:text-xl max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            Размещайте квесты на нашей платформе: получайте целевых пользователей, реальные действия и измеримый результат.
          </p>
          <div className="hm-cta-row">
            <a href={TG_URL} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Написать в Telegram</a>
            <Link href="/partners/proof" className="hm-btn hm-btn-ghost">Как мы проверяем результат</Link>
          </div>
        </div>
      </section>

      {/* ── Цифры ── */}
      <div className="pt-stats-wrap">
        {ready && (stats || proof) && (
          <section className="hm-stats pt-stats reveal" aria-label="Аудитория в цифрах">
            {stats && (
              <div className="hm-stat"><div className="hm-stat-num"><CountUp value={stats.total} />+</div><div className="hm-stat-label">игроков в базе</div></div>
            )}
            {stats && stats.newWeek > 0 && (
              <div className="hm-stat"><div className="hm-stat-num"><CountUp value={stats.newWeek} />+</div><div className="hm-stat-label">новых за неделю</div></div>
            )}
            {proof && (
              <div className="hm-stat"><div className="hm-stat-num"><CountUp value={proof.activeWeek} /></div><div className="hm-stat-label">активных за неделю</div></div>
            )}
            {proof?.autoApprovedPercent != null && (
              <div className="hm-stat"><div className="hm-stat-num green"><CountUp value={proof.autoApprovedPercent} />%</div><div className="hm-stat-label">результатов подтверждает автоматика</div></div>
            )}
            {proof?.retention7Percent != null && (
              <div className="hm-stat"><div className="hm-stat-num green"><CountUp value={proof.retention7Percent} />%</div><div className="hm-stat-label">новых активны через неделю</div></div>
            )}
          </section>
        )}
      </div>

      {/* ── Форматы ── */}
      <section className="hm-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Форматы</div>
            <h2 className="section-title">Как мы работаем с партнёрами</h2>
          </div>
        </div>
        <div className="hm-features">
          {COLLAB_ITEMS.map(item => (
            <div key={item.title} className="hm-feature">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Процесс ── */}
      <section className="hm-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Четыре шага</div>
            <h2 className="section-title">Как запустить квест-рекламу</h2>
          </div>
        </div>
        <div className="hm-steps four">
          {STEPS.map(step => (
            <div key={step.num} className="hm-step how-step">
              <span className="hm-step-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Сравнение ── */}
      <section className="hm-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Сравнение</div>
            <h2 className="section-title">Обычная реклама и EGC</h2>
          </div>
        </div>
        <div className="pt-compare">
          <div className="pt-col bad">
            <h3>Обычная реклама</h3>
            <ul>{PRICING_BAD.map(r => <li key={r.text}>{r.text}</li>)}</ul>
          </div>
          <div className="pt-col good">
            <h3>EGC квест-реклама</h3>
            <ul>{PRICING_GOOD.map(r => <li key={r.text}>{r.text}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* ── Почему EGC ── */}
      <section className="hm-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Преимущества</div>
            <h2 className="section-title">Почему выбирают EGC</h2>
          </div>
        </div>
        <div className="hm-features">
          {WHY_CARDS.map(card => (
            <div key={card.title} className="hm-feature">
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Аудитория ── */}
      <section className="hm-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Кому подходит</div>
            <h2 className="section-title">Бизнесу, чья аудитория — геймеры</h2>
          </div>
        </div>
        <div className="hm-features">
          {AUDIENCE_CARDS.map(card => (
            <div key={card.title} className="hm-feature">
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Финальный призыв ── */}
      <section className="hm-final reveal">
        <h2 className="font-heading">Готовы привлечь игровую аудиторию?</h2>
        <p>Напишите нам: обсудим формат, запустим квест и замерим результат вместе. Стоимость назовём под вашу задачу.</p>
        <div className="hm-cta-row">
          <a href={TG_URL} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Telegram @GressToEx</a>
          <a href={MAIL_URL} className="hm-btn hm-btn-ghost">Написать на почту</a>
        </div>
      </section>
    </div>
  );
}
