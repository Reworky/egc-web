'use client';

import { useEffect, useState } from 'react';
import './landing.css';

const STAGGER_GROUPS = ['.step', '.game-card', '.eco-feature', '.shop-card', '.faq-item'];
const SOLO_ITEMS = ['.exc-card', '.referral-inner', '.section-title', '.section-sub'];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const scope = '.landing-page ';

    STAGGER_GROUPS.forEach(sel => {
      document.querySelectorAll<HTMLElement>(scope + sel).forEach(el => {
        el.classList.add('reveal');
        const siblings = Array.from(el.parentElement!.querySelectorAll<HTMLElement>(sel));
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = Math.min(idx * 75, 360) + 'ms';
      });
    });

    SOLO_ITEMS.forEach(sel => {
      document.querySelectorAll(scope + sel).forEach(el => el.classList.add('reveal'));
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    );

    document.querySelectorAll('.landing-page .reveal').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  function toggleFaq(index: number) {
    setOpenFaq(prev => (prev === index ? null : index));
  }

  return (
    <main className="landing-page">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="hero" id="top">
        <div className="hero-badge">EXPERIENCE GAMING CLUB</div>

        <div className="hero-logo-wrap">
          <div className="hero-ring" />
          <div className="hero-ring" />
          <div className="hero-ring" />
          <img
            src="/logo.png"
            alt="EGC Logo"
            className="hero-logo"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        <h1>
          Играй.<br />
          <span className="accent">Получай EXC.</span><br />
          Трать или выводи.
        </h1>

        <p>
          Выполняй квесты в своих любимых играх — PUBG, CS2, Clash of Clans и множество других.
          Получай EXC за то, что и так делаешь каждый день, и обменивай на награды, рубли или GRAM.
        </p>

        <div className="hero-actions">
          <a href="https://t.me/invitetogamebot" target="_blank" rel="noopener" className="btn-primary">
            <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor" style={{ flexShrink: 0 }}>
              <polygon points="2,1 10,6 2,11" />
            </svg>
            &nbsp; Начать получать EXC
          </a>
          <a href="https://t.me/exgamingclub" target="_blank" rel="noopener" className="btn-secondary">
            📣&nbsp; Telegram-канал
          </a>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">11</div>
            <div className="label">игр в каталоге</div>
          </div>
          <div className="hero-stat">
            <div className="num">120<span>+</span></div>
            <div className="label">активных квестов</div>
          </div>
          <div className="hero-stat">
            <div className="num">100</div>
            <div className="label">EXC = 1 ₽</div>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section id="how">
        <div className="dot-grid" />
        <div className="section-glow" style={{ width: 500, height: 500, background: 'rgba(124,58,237,0.10)', top: -100, left: -150 }} />
        <div className="section-glow" style={{ width: 400, height: 400, background: 'rgba(58,100,237,0.08)', bottom: -100, right: -100 }} />
        <div className="container">
          <span className="section-tag">Как это работает</span>
          <h2 className="section-title">Четыре шага<br />до первой выплаты</h2>
          <p className="section-sub">Никаких скрытых условий — только квесты, которые ты и так делаешь каждый день.</p>

          <div className="steps">
            <div className="step" style={{ background: 'linear-gradient(135deg, #0f0f22 0%, #1a1040 100%)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
              <div className="step-left">
                <div className="step-num">01</div>
                <div className="step-icon">🎮</div>
              </div>
              <div className="step-content">
                <h3>Регистрация в боте</h3>
                <p>Открой Telegram-бот, пройди короткую анкету — укажи страну, платформу и возраст.</p>
              </div>
            </div>
            <div className="step" style={{ background: 'linear-gradient(135deg, #0e1020 0%, #0d1a35 100%)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'radial-gradient(circle,rgba(58,100,237,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
              <div className="step-left">
                <div className="step-num">02</div>
                <div className="step-icon">🎯</div>
              </div>
              <div className="step-content">
                <h3>Выбери квест</h3>
                <p>В боте или Mini App — открой каталог, выбери игру и уровень сложности: лёгкие, средние или сложные.</p>
              </div>
            </div>
            <div className="step" style={{ background: 'linear-gradient(135deg, #0f1020 0%, #1a1535 100%)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'radial-gradient(circle,rgba(168,58,237,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
              <div className="step-left">
                <div className="step-num">03</div>
                <div className="step-icon">📸</div>
              </div>
              <div className="step-content">
                <h3>Выполни и отправь доказательство</h3>
                <p>Сделай задание в игре, отправь скриншот прямо в Mini App или боте — по инструкции к квесту.</p>
              </div>
            </div>
            <div className="step" style={{ background: 'linear-gradient(135deg, #0d1020 0%, #1a1240 100%)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'radial-gradient(circle,rgba(124,58,237,0.25) 0%,transparent 70%)', pointerEvents: 'none' }} />
              <div className="step-left">
                <div className="step-num">04</div>
                <div className="step-icon">💸</div>
              </div>
              <div className="step-content">
                <h3>Получи EXC и выводи</h3>
                <p>После проверки EXC зачислятся на баланс. Трать в магазине, переводи другу или выводи — в рублях или GRAM через Telegram Wallet.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Games ───────────────────────────────────────────────── */}
      <section id="games">
        <div className="dot-grid" />
        <div className="section-glow" style={{ width: 600, height: 600, background: 'rgba(58,100,237,0.09)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <div className="section-glow" style={{ width: 300, height: 300, background: 'rgba(155,58,237,0.10)', bottom: -50, right: '10%' }} />
        <div className="container">
          <div className="games-header">
            <div>
              <span className="section-tag">Каталог игр</span>
              <h2 className="section-title">Популярные игры —<br />и список постоянно растёт</h2>
            </div>
            <p className="section-sub" style={{ maxWidth: 320, fontSize: 15 }}>
              Квесты для ПК, мобильных и консолей. Новые игры добавляются регулярно — следи за обновлениями в канале.
            </p>
          </div>

          <div className="games-grid">
            {[
              { img: '/logos/pubg.png', name: 'PUBG PC', platform: 'PC', quests: '6 квестов', fallback: '🔫' },
              { img: '/logos/pubg.png', name: 'PUBG Mobile', platform: 'iOS · Android', quests: '12 квестов', fallback: '🔫' },
              { img: '/logos/cs2.png', name: 'CS2', platform: 'PC', quests: '20 квестов', fallback: '💣' },
              { img: '/logos/brawlstars.png', name: 'Brawl Stars', platform: 'iOS · Android', quests: '27 квестов', fallback: '⭐' },
              { img: '/logos/coc.png', name: 'Clash of Clans', platform: 'iOS · Android', quests: '9 квестов', fallback: '🏰' },
              { img: '/logos/clashroyale.png', name: 'Clash Royale', platform: 'iOS · Android', quests: '9 квестов', fallback: '💎' },
              { img: '/logos/mlbb.png', name: 'Mobile Legends', platform: 'iOS · Android', quests: '10 квестов', fallback: '⚔️' },
              { img: '/logos/eafc25.png', name: 'EA FC 26', platform: 'PC · PS · Xbox', quests: '10 квестов', fallback: '⚽' },
              { img: null, name: 'Dota 2', platform: 'PC', quests: '12 квестов', fallback: '🛡️' },
              { img: '/logos/grimsoul.png', name: 'Grim Soul', platform: 'iOS · Android', quests: '10 квестов', fallback: '💀' },
              { img: null, name: 'GTA V Online', platform: 'PC · PS4/5 · Xbox', quests: '4 квеста', fallback: '🚗' },
            ].map(game => (
              <div className="game-card" key={game.name}>
                <div className="game-emoji">
                  {game.img
                    ? <img src={game.img} alt={game.name} onError={e => { (e.currentTarget.parentElement as HTMLElement).innerText = game.fallback; }} />
                    : game.fallback
                  }
                </div>
                <div className="game-name">{game.name}</div>
                <div className="game-platform">{game.platform}</div>
                <div className="game-quests">{game.quests}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Economy ─────────────────────────────────────────────── */}
      <section id="economy">
        <div className="dot-grid" />
        <div className="section-glow" style={{ width: 500, height: 500, background: 'rgba(155,58,237,0.12)', top: -80, right: -100 }} />
        <div className="section-glow" style={{ width: 350, height: 350, background: 'rgba(58,100,237,0.08)', bottom: -80, left: -80 }} />
        <div className="container">
          <span className="section-tag">Экономика EXC</span>
          <h2 className="section-title">Прозрачная система<br />без обмана</h2>

          <div className="economy-grid">
            <div className="exc-card">
              <div className="exc-icon">🪙</div>
              <h3>Что такое EXC?</h3>
              <p>EXC — внутренняя валюта клуба, которую ты зарабатываешь за выполнение квестов. Это не баллы и не очки — это реальная стоимость, которую можно вывести в рубли или GRAM.</p>
              <div className="exc-rate">💱 &nbsp;Базовый курс: 100 EXC = 1 ₽</div>
            </div>

            <div className="economy-features">
              <div className="eco-feature">
                <div className="eco-feature-icon">📊</div>
                <div>
                  <h4>Health Ratio</h4>
                  <p>Курс вывода зависит от состояния фонда клуба — полностью честно и открыто. При 100% фонде курс максимальный.</p>
                </div>
              </div>
              <div className="eco-feature">
                <div className="eco-feature-icon">📤</div>
                <div>
                  <h4>Лимит вывода растёт с уровнем</h4>
                  <p>Новичок выводит до 10 000 EXC в месяц, Амбассадор EXPERIENCE — до 150 000 EXC. Чем активнее играешь, тем выше уровень и больше лимит. Минимальная сумма вывода — 5 000 EXC.</p>
                </div>
              </div>
              <div className="eco-feature">
                <div className="eco-feature-icon">🎁</div>
                <div>
                  <h4>Магазин наград</h4>
                  <p>Трать EXC на подарочные карты Steam, PSN и другие товары — не только выводи деньгами.</p>
                </div>
              </div>
              <div className="eco-feature">
                <div className="eco-feature-icon">⚡</div>
                <div>
                  <h4>Бусты и предметы клуба</h4>
                  <p>Покупай бусты на XP и EXC, дополнительные слоты квестов и другие игровые улучшения.</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 48, background: 'var(--bg3)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--purple-light)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Награды за квесты</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center' }}>
              <div style={{ padding: '32px 16px', borderRight: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Лёгкие</div>
                <div style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>1&nbsp;500</div>
                <div style={{ fontSize: 14, color: 'var(--purple-light)', marginTop: 4 }}>EXC за квест</div>
              </div>
              <div style={{ padding: '32px 16px', borderRight: '1px solid var(--border-subtle)', background: 'rgba(124,58,237,0.05)' }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Средние</div>
                <div style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>4&nbsp;000</div>
                <div style={{ fontSize: 14, color: 'var(--purple-light)', marginTop: 4 }}>EXC за квест</div>
              </div>
              <div style={{ padding: '32px 16px' }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Сложные</div>
                <div style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, color: 'var(--purple-light)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>10&nbsp;000</div>
                <div style={{ fontSize: 14, color: 'var(--purple-light)', marginTop: 4 }}>EXC за квест</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Shop ────────────────────────────────────────────────── */}
      <section id="shop">
        <div className="dot-grid" />
        <div className="section-glow" style={{ width: 450, height: 450, background: 'rgba(124,58,237,0.09)', top: -60, left: -80 }} />
        <div className="section-glow" style={{ width: 350, height: 350, background: 'rgba(58,100,237,0.09)', bottom: -60, right: -60 }} />
        <div className="container">
          <span className="section-tag">Магазин наград</span>
          <h2 className="section-title">На что тратить EXC</h2>
          <p className="section-sub">Выводи деньги или обменивай на товары — выбор за тобой.</p>

          <div className="shop-cards">
            {[
              { icon: '💸', title: 'Вывод в рубли', text: 'Отправь заявку прямо в боте или Mini App — администратор переведёт деньги в течение 24 часов. Минимум 5 000 EXC.' },
              { icon: '💎', title: 'Вывод в GRAM (TON)', text: 'Получай выплаты в GRAM через Telegram Wallet. Курс: 100 EXC = 1 ₽ → GRAM по рыночному курсу. Кошелёк уже есть в Telegram.' },
              { icon: '🔄', title: 'Перевод EXC другу', text: 'Переводи EXC другому игроку прямо в боте или Mini App. Комиссия 10% (мин. 200 EXC). Лимит: 1 перевод в сутки, от 1 000 до 10 000 EXC.' },
              { icon: '🎁', title: 'Gift Cards', text: 'Подарочные карты Steam и PSN — обменяй EXC на пополнение игрового кошелька. Скоро в магазине.' },
              { icon: '⚡', title: 'Бусты XP и EXC', text: '+20% к XP или EXC на 24 или 72 часа — прокачивайся быстрее и зарабатывай больше с каждого квеста.' },
              { icon: '👑', title: 'Рамки аватара', text: 'Огонь, лёд, фиолет, золото — эксклюзивные рамки для профиля в Mini App. Покупаются за EXC, без лимитов.' },
              { icon: '🎲', title: 'Управление квестами', text: 'Переброс квеста, страховка от провала, дополнительный слот или снятие кулдауна — управляй квестами гибко.' },
            ].map(card => (
              <div className="shop-card" key={card.title}>
                <div className="shop-card-top">
                  <div className="shop-card-icon">{card.icon}</div>
                  <div><h3>{card.title}</h3></div>
                </div>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mini App ─────────────────────────────────────────────── */}
      <section id="miniapp" style={{ background: 'rgba(14, 14, 26, 0.82)', position: 'relative', overflow: 'hidden' }}>
        <div className="dot-grid" />
        <div className="section-glow" style={{ width: 500, height: 500, background: 'rgba(155,58,237,0.12)', top: '50%', right: -100, transform: 'translateY(-50%)' }} />
        <div className="container">
          <span className="section-tag">Telegram Mini App</span>
          <h2 className="section-title">Весь клуб<br />прямо в Telegram</h2>

          <div className="miniapp-grid">
            <div className="miniapp-features">
              {[
                { icon: '🎯', title: 'Квесты и отчёты', text: 'Бери квесты, загружай скриншоты и отправляй отчёты прямо из Mini App — без переключения в бота.' },
                { icon: '👤', title: 'Профиль и рейтинг', text: 'Смотри свой уровень, XP, баланс EXC, рамку аватара и место в рейтинге клуба.' },
                { icon: '🛍️', title: 'Магазин и переводы', text: 'Покупай товары, переводи EXC другу и подавай заявки на вывод — всё в одном месте.' },
                { icon: '🤝', title: 'Рефералы', text: 'Копируй реферальную ссылку и отслеживай бонусы за приглашённых друзей.' },
              ].map(f => (
                <div className="eco-feature" key={f.title}>
                  <div className="eco-feature-icon">{f.icon}</div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="miniapp-cta-card">
              <div style={{ fontSize: 64, marginBottom: 24 }}>📱</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Открой Mini App</h3>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>
                Доступен прямо внутри Telegram — нажми кнопку «🌐 Открыть Mini App» в боте после регистрации.
              </p>
              <a href="https://t.me/invitetogamebot" target="_blank" rel="noopener" className="btn-primary" style={{ display: 'inline-flex' }}>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor" style={{ flexShrink: 0 }}>
                  <polygon points="2,1 10,6 2,11" />
                </svg>
                &nbsp; Открыть EGC
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Referral ─────────────────────────────────────────────── */}
      <section id="referral">
        <div className="dot-grid" />
        <div className="section-glow" style={{ width: 600, height: 600, background: 'rgba(58,100,237,0.10)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <div className="section-glow" style={{ width: 300, height: 300, background: 'rgba(155,58,237,0.09)', top: -60, right: '5%' }} />
        <div className="container">
          <span className="section-tag">Реферальная программа</span>
          <h2 className="section-title">Зови друзей —<br />зарабатывай вместе</h2>

          <div className="referral-inner">
            <div className="referral-text">
              <h3>Приглашай игроков<br />и получай бонусы</h3>
              <p>Делись своей реферальной ссылкой из бота. Как только приглашённый друг зарегистрируется и станет активным — ты получишь бонус на счёт.</p>

              <div className="referral-bonuses">
                <div className="ref-bonus">
                  <div className="dot" />
                  <div>Ты получаешь <strong style={{ whiteSpace: 'nowrap' }}>3% от EXC</strong> друга в первые <strong style={{ whiteSpace: 'nowrap' }}>14 дней</strong> его игры</div>
                </div>
                <div className="ref-bonus">
                  <div className="dot" />
                  <div>Твой друг получает <strong style={{ whiteSpace: 'nowrap' }}>3&nbsp;000 EXC</strong> за первый выполненный квест</div>
                </div>
                <div className="ref-bonus">
                  <div className="dot" />
                  <div>Реферальная ссылка — в разделе «Рефералы» в боте</div>
                </div>
              </div>
            </div>

            <div className="referral-visual">
              <div className="ref-big">3 000</div>
              <div className="ref-caption">EXC другу<br />за первый квест</div>
              <a href="https://t.me/invitetogamebot" target="_blank" rel="noopener" className="btn-primary" style={{ marginTop: 8, fontSize: 14, padding: '12px 24px' }}>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor" style={{ flexShrink: 0 }}>
                  <polygon points="2,1 10,6 2,11" />
                </svg>
                {' '}Открыть EGC
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section id="faq">
        <div className="dot-grid" />
        <div className="section-glow" style={{ width: 500, height: 500, background: 'rgba(124,58,237,0.09)', top: -100, right: -100 }} />
        <div className="section-glow" style={{ width: 300, height: 300, background: 'rgba(58,100,237,0.07)', bottom: -60, left: '10%' }} />
        <div className="container">
          <span className="section-tag">Частые вопросы</span>
          <h2 className="section-title">Остались вопросы?</h2>
          <p className="section-sub">Отвечаем на самое главное. Остальное — в Telegram-канале.</p>

          <div className="faq-list">
            {[
              {
                q: 'Сколько можно заработать в месяц?',
                a: 'Зависит от уровня активности. Лёгкие квесты приносят 1 500 EXC, средние — 4 000 EXC, сложные — 10 000 EXC. Активный игрок с миксом заданий накапливает 50 000–100 000 EXC в месяц. Сколько из этого можно вывести — зависит от уровня в клубе: лимит растёт по мере прокачки от 10 000 (Новичок) до 150 000 EXC в месяц (Амбассадор EXPERIENCE).',
              },
              {
                q: 'Как быстро проверяются квесты?',
                a: 'Модераторы проверяют скриншоты вручную, как правило, в течение нескольких часов. В выходные или при высокой нагрузке может занять до 24 часов. После одобрения EXC зачисляются на баланс мгновенно.',
              },
              {
                q: 'Что такое Health Ratio и как он влияет на вывод?',
                a: 'Health Ratio — это отношение реального фонда клуба к совокупному балансу всех игроков. При 100% курс максимальный: 100 EXC = 1 ₽. Если фонд ниже — курс пересчитывается пропорционально. Всё прозрачно и видно в боте перед выводом.',
              },
              {
                q: 'Нужно платить, чтобы начать?',
                a: 'Нет. Регистрация и выполнение квестов абсолютно бесплатны. Платные предметы в магазине (бусты, инструменты) — опционально, они ускоряют прогресс, но не обязательны.',
              },
              {
                q: 'Могут ли заблокировать мой аккаунт в игре?',
                a: 'Нет. Квесты выполняются в рамках обычного геймплея — мы не просим использовать читы, баги или сторонние программы. Требования к квестам — это обычные игровые достижения, подтверждённые скриншотом.',
              },
              {
                q: 'Как происходит выплата — в рублях или GRAM?',
                a: 'В боте открываешь раздел «Кошелёк» → «Вывод EXC», выбираешь способ: рубли или GRAM. Минимум 5 000 EXC. При выводе в рублях — администратор переводит на реквизиты в течение 24 часов. При выводе в GRAM — средства отправляются в Telegram Wallet (TON) автоматически. Курс: 100 EXC = 1 ₽, затем ₽ → GRAM по рыночному курсу на момент вывода.',
              },
              {
                q: 'Можно выполнять квесты на нескольких играх одновременно?',
                a: 'Да. Ты можешь брать квесты из разных игр одновременно — в рамках лимита активных квестов на твоём аккаунте. Дополнительные слоты можно купить в разделе «Предметы клуба».',
              },
            ].map((item, i) => (
              <div className={`faq-item${openFaq === i ? ' open' : ''}`} key={i}>
                <button className="faq-q" onClick={() => toggleFaq(i)}>
                  <span>{item.q}</span>
                  <div className="arrow">+</div>
                </button>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section id="cta">
        <div className="cta-inner">
          <h2>Получай бонусы<br />за то, что уже делаешь</h2>
          <p>Регистрация за 2 минуты — просто открой бот в Telegram и выбери первый квест.</p>
          <div className="cta-buttons">
            <a href="https://t.me/invitetogamebot" target="_blank" rel="noopener" className="btn-primary">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor" style={{ flexShrink: 0 }}>
                <polygon points="2,1 10,6 2,11" />
              </svg>
              &nbsp; Начать получать EXC
            </a>
            <a href="https://t.me/exgamingclub" target="_blank" rel="noopener" className="btn-secondary">
              📣&nbsp; Подписаться на канал
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
