'use client';

import { useEffect, useState } from 'react';
import './partners.css';

const COLLAB_ITEMS = [
  {
    icon: '🎮',
    title: 'Привлечение игроков',
    desc: 'Размещаем квест с вашей задачей — игроки выполняют и получают EXC-токены. Только целевая аудитория, только реальные действия.',
  },
  {
    icon: '📣',
    title: 'Охват аудитории',
    desc: 'Анонс вашего продукта в нашем Telegram-боте с более чем 500 активными игроками. Нативная интеграция без баннерной слепоты.',
  },
  {
    icon: '🤝',
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
  { icon: '❌', text: 'Платите за показы, клики, боты' },
  { icon: '❌', text: 'Нет гарантии целевого действия' },
  { icon: '❌', text: 'Аудитория случайная' },
  { icon: '❌', text: 'Баннерная слепота и скипы' },
  { icon: '❌', text: 'Дорого даже на тест' },
];

const PRICING_GOOD = [
  { icon: '✅', text: 'Платите только за выполненный квест' },
  { icon: '✅', text: 'Целевое действие — обязательное условие награды' },
  { icon: '✅', text: 'Только геймеры, заинтересованные в играх' },
  { icon: '✅', text: 'Нативный формат в игровом боте' },
  { icon: '✅', text: 'Гибкий бюджет от малого бизнеса' },
];

const WHY_CARDS = [
  { icon: '🎯', title: 'Только реальные действия', desc: 'Квест выполнен — награда выдана. Бот проверяет факт выполнения, не просто просмотр.' },
  { icon: '📊', title: 'Измеримый результат', desc: 'Полная статистика выполнений: сколько человек, когда, как быстро. Никаких чёрных ящиков.' },
  { icon: '🔗', title: 'Лояльная аудитория', desc: 'Игроки уже вовлечены в платформу. Они доверяют боту и мотивированы выполнять задания.' },
  { icon: '⚡', title: 'Быстрый запуск', desc: 'Квест появляется в боте в течение 24 часов. Никаких длинных согласований и брифов.' },
];

const AUDIENCE_CARDS = [
  { icon: '🎮', title: 'Разработчики игр', desc: 'Нужны тестировщики, первые пользователи, обратная связь — запускайте квест и получайте реальный фидбек.' },
  { icon: '📱', title: 'Мобильные издатели', desc: 'Продвигаете мобильную игру? Квест «скачай и пройди туториал» приводит целевых игроков.' },
  { icon: '🏆', title: 'Организаторы турниров', desc: 'Анонс турнира в нашей аудитории геймеров — быстрый набор участников и зрителей.' },
  { icon: '💼', title: 'Игровой бизнес', desc: 'Периферия, игровые кресла, подписки, стриминг-сервисы — ваша целевая аудитория уже здесь.' },
];

export default function PartnersPage() {
  const [stats, setStats] = useState({ total: 511, newWeek: 0 });

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setStats({
            total: data.totalPlayers ?? 511,
            newWeek: data.newUsersWeek ?? 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.partners-page .reveal-item');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    items.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = Math.min(i * 60, 360) + 'ms';
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="partners-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">Партнёрам</div>
        <h1>
          Работаем с теми, кому нужна<br />
          <span className="accent">игровая аудитория</span>
        </h1>
        <p>
          Размещайте квесты на нашей платформе — получайте целевых пользователей, реальные действия и измеримый результат.
        </p>
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-num">{stats.total}<span>+</span></div>
            <div className="stat-label">игроков<br />в базе</div>
          </div>
          {stats.newWeek > 0 && (
            <div className="stat-item">
              <div className="stat-num">{stats.newWeek}<span>+</span></div>
              <div className="stat-label">новых<br />за неделю</div>
            </div>
          )}
          <div className="stat-item">
            <div className="stat-num">179</div>
            <div className="stat-label">активных<br />еженедельно</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">88<span>%</span></div>
            <div className="stat-label">успешных<br />выполнений</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">47<span>%</span></div>
            <div className="stat-label">удержание<br />за 7 дней</div>
          </div>
        </div>
      </section>

      {/* Форматы сотрудничества */}
      <section id="collab">
        <div className="container">
          <div className="section-tag">Форматы</div>
          <h2 className="section-title">Как мы работаем с партнёрами</h2>
          <p className="section-sub">
            Три формата на любой бюджет и цель — от разового размещения до глубокой интеграции.
          </p>
          <div className="collab-grid">
            {COLLAB_ITEMS.map((item, i) => (
              <div key={i} className="collab-item">
                <div className="collab-icon">{item.icon}</div>
                <div className="collab-body">
                  <div className="collab-title">{item.title}</div>
                  <div className="collab-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section id="how">
        <div className="container">
          <div className="section-tag">Процесс</div>
          <h2 className="section-title">Как запустить квест-рекламу</h2>
          <p className="section-sub">
            От первого контакта до живых пользователей — 4 шага.
          </p>
          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Сравнение цен */}
      <section id="pricing">
        <div className="container">
          <div className="section-tag">Сравнение</div>
          <h2 className="section-title">Обычная реклама vs EGC</h2>
          <p className="section-sub">
            Традиционные форматы продвижения в играх давно не работают так, как раньше.
          </p>
          <div className="pricing-compare">
            <div className="pricing-col pricing-col-bad">
              <div className="pricing-col-head">Обычная реклама</div>
              {PRICING_BAD.map((row, i) => (
                <div key={i} className="pricing-row">
                  <span className="pricing-icon">{row.icon}</span>
                  <span>{row.text}</span>
                </div>
              ))}
            </div>
            <div className="pricing-col pricing-col-good">
              <div className="pricing-col-head">EGC квест-реклама</div>
              {PRICING_GOOD.map((row, i) => (
                <div key={i} className="pricing-row">
                  <span className="pricing-icon">{row.icon}</span>
                  <span>{row.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pricing-callout">
            <div className="pricing-callout-text">
              <strong>Готовы обсудить ваш проект?</strong><br />
              Напишите нам — расскажем форматы и назовём стоимость под вашу задачу.
            </div>
            <a href="https://t.me/GressToEx" target="_blank" rel="noopener noreferrer" className="btn-pricing-cta">
              Написать в Telegram
            </a>
          </div>
        </div>
      </section>

      {/* Почему EGC */}
      <section id="why">
        <div className="container">
          <div className="section-tag">Преимущества</div>
          <h2 className="section-title">Почему выбирают EGC</h2>
          <div className="why-grid">
            {WHY_CARDS.map((card, i) => (
              <div key={i} className="why-card">
                <div className="why-icon">{card.icon}</div>
                <div>
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Аудитория */}
      <section id="audience">
        <div className="container">
          <div className="section-tag">Аудитория</div>
          <h2 className="section-title">Кому подходит EGC</h2>
          <p className="section-sub">
            Наша платформа подойдёт любому бизнесу, чья аудитория — геймеры.
          </p>
          <div className="audience-grid">
            {AUDIENCE_CARDS.map((card, i) => (
              <div key={i} className="audience-card">
                <div className="audience-icon">{card.icon}</div>
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <div className="container">
          <div className="cta-inner">
            <h2>Готовы привлечь игровую аудиторию?</h2>
            <p>
              Напишите нам — обсудим формат, запустим квест и замерим результат вместе.
            </p>
            <div className="cta-buttons">
              <a href="https://t.me/GressToEx" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Telegram @GressToEx
              </a>
              <a href="mailto:allexperiencetrade@gmail.com" className="btn-secondary">
                Написать на почту
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
