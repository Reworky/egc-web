'use client';

import Link from 'next/link';
import { BOT_URL } from '@/lib/contacts';
import '@/app/cashout/cashout.css';

// Метка источника трафика: бот считает клики и регистрации по src_<код> (код заводится в «📈 Трафик»)
const botLink = (src: string) => `${BOT_URL}?start=src_${src}`;

const METHODS = [
  { title: 'Рубли по СБП', sub: 'на карту любого банка', img: '/cashout/sbp.png', bg: '#ffffff', cover: false },
  { title: 'Telegram Stars', sub: 'по юзернейму в Telegram', img: '/cashout/stars.png', bg: '#ffffff', cover: false },
  { title: 'GRAM (TON)', sub: 'на адрес кошелька', img: '/cashout/ton.png', bg: '#ffffff', cover: false },
];

const GAMES = [
  { name: 'Brawl Stars', img: '/games/brawl-stars.jpg' },
  { name: 'Clash Royale', img: '/games/clash-royale.jpg' },
  { name: 'Clash of Clans', img: '/games/clash-of-clans.jpg' },
  { name: 'PUBG Mobile', img: '/games/pubg-mobile.jpg' },
  { name: 'PUBG PC', img: '/games/pubg-pc.jpg' },
  { name: 'CS2: кейсы', img: '/games/cs2.jpg' },
  { name: 'Steam', img: '/shop/steam-balance.jpg' },
];

const STEPS = [
  { title: 'Набери 5 000 EXC', text: 'Выполняй квесты в играх, EXC начисляются после проверки результата.' },
  { title: 'Дождись открытия вывода', text: 'Вывод открывается через 3 дня после регистрации и 3 выполненных квеста.' },
  { title: 'Отправь заявку', text: 'Выбери способ и укажи реквизиты. Выплата в течение 24 часов, одна заявка в сутки.' },
];

/** Страница «Вывод» для гостя: куда можно вывести заработанное и на что потратить EXC. После входа вместо неё открывается кошелёк. */
export default function GuestCashout() {
  return (
    <div>
      {/* ── Первый экран ── */}
      <section className="gc-hero">
        <div className="gc-mosaic" aria-hidden="true" />
        <div className="gc-hero-inner">
          <h1 className="font-gaming">Зарегистрируйся и выводи <em>заработанное</em></h1>
          <p>
            Выполняй квесты в играх, получай <b>EXC</b> и выводи их на карту по СБП, в Telegram Stars или GRAM.
            Или трать в магазине на донат в любимые игры. Бесплатно
          </p>
          <div className="hm-cta-row">
            <a href={botLink('site_cashout')} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Открыть в Telegram</a>
            <Link href="/profile" className="hm-btn hm-btn-ghost">Войти на сайт</Link>
          </div>
        </div>
      </section>

      <div className="home-guest max-w-6xl mx-auto px-4 pb-10">
        {/* ── Способы вывода ── */}
        <section className="hm-section reveal">
          <div className="hm-head">
            <div>
              <div className="hm-kicker">Куда выводить</div>
              <h2 className="section-title">Способы вывода</h2>
            </div>
          </div>
          <div className="gc-methods">
            {METHODS.map(m => (
              <div key={m.title} className="gc-method">
                <div className={`gc-method-art${m.cover ? ' cover' : ''}`} style={{ background: m.bg }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.img} alt={m.title} loading="lazy" decoding="async" />
                </div>
                <b>{m.title}</b>
                <span>{m.sub}</span>
              </div>
            ))}
          </div>
          <p className="gc-note">По номиналу 100 EXC = 1 ₽. Итоговая сумма зависит от курса фонда клуба, он виден в боте перед заявкой.</p>
        </section>

        {/* ── Донат в игры ── */}
        <section className="hm-section reveal">
          <div className="hm-head">
            <div>
              <div className="hm-kicker">Магазин</div>
              <h2 className="section-title">Донат в игры за EXC</h2>
            </div>
          </div>
          <div className="gc-games">
            {GAMES.map(g => (
              <div key={g.name} className="gc-game">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt="" loading="lazy" decoding="async" />
                <span>{g.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Как вывести ── */}
        <section className="hm-section reveal">
          <div className="hm-head">
            <div>
              <div className="hm-kicker">Три шага</div>
              <h2 className="section-title">Как вывести</h2>
            </div>
          </div>
          <div className="hm-steps">
            {STEPS.map((s, i) => (
              <div key={s.title} className="hm-step">
                <span className="hm-step-num">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Финальный призыв ── */}
        <section className="hm-final reveal">
          <h2 className="font-heading">Готов начать?</h2>
          <p>Открой бота, пройди регистрацию и забери первый квест: награда видна до старта. Если ты уже в клубе, войди на сайт через Telegram.</p>
          <div className="hm-cta-row">
            <a href={botLink('site_cashout_final')} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Открыть в Telegram</a>
            <Link href="/profile" className="hm-btn hm-btn-ghost">Войти на сайт</Link>
          </div>
        </section>

        <p className="hm-disclaimer">
          Награды и выплаты зависят от выполнения квестов и проверки результата, они не гарантируются. Суммы в рублях ориентировочные: курс вывода зависит от состояния фонда клуба.
        </p>
      </div>
    </div>
  );
}
