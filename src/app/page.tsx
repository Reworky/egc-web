import Link from 'next/link';
import { api, Quest } from '@/lib/api';
import LeaderboardTabs from '@/components/LeaderboardTabs';
import CountUp from '@/components/CountUp';
import PayoutFeed from '@/components/PayoutFeed';
import Reviews from '@/components/Reviews';
import HomeSwitch from '@/components/HomeSwitch';
import GameBanner from '@/components/GameBanner';

export const revalidate = 60;

const BOT_URL = 'https://t.me/invitetogamebot';
// Метки источника трафика: бот (handleStart) считает клики и регистрации по src_<код>, коды заводятся в «📈 Трафик»
const botLink = (src: string) => `${BOT_URL}?start=src_${src}`;
const REVIEWS_URL = 'https://t.me/egc_payouts';
// Цель первого вывода и стартовый бонус: те же числа, что в боте (WalletController.MIN_WITHDRAWAL, WELCOME_BONUS_EXC)
const FIRST_WITHDRAWAL_EXC = 5000;
const WELCOME_BONUS_EXC = 200;

const FEATURES = [
  { title: 'Квесты по играм', text: 'Brawl Stars, Clash Royale, Clash of Clans, PUBG и другие. Награда в EXC видна до старта, а для многих квестов прогресс считается сам.' },
  { title: 'Магазин наград', text: 'Тратить EXC можно на донат в играх, подарочные карты и бусты, а не только выводить деньгами.' },
  { title: 'Колесо фортуны', text: 'Крути колесо и забирай призы: EXC, буст опыта, рамку профиля. Попытки даёт активность в клубе.' },
  { title: 'Отряды', text: 'Собери команду из друзей: в отряде играть веселее, а за состав из 3–5 человек клуб даёт бонус.' },
  { title: 'Турниры и рейтинг', text: 'Соревнуйся с другими игроками: недельный и общий рейтинг, турниры с призами и повышение уровня за опыт.' },
  { title: 'EGC Pass', text: 'Подписка с перками для тех, кто играет много: больше возможностей и приятные бонусы к награде.' },
];

const FAQ = [
  { q: 'Это правда бесплатно?', a: 'Да. Вступить и играть в клубе бесплатно, регистрация проходит через Telegram. За регистрацию бот сразу начисляет 200 EXC стартового капитала.' },
  { q: 'Как выводятся деньги?', a: 'EXC можно вывести на карту по СБП, в Telegram Stars или в GRAM. Актуальные лимиты и курс всегда показывает бот, а последние выплаты видны выше на этой странице.' },
  { q: 'Нужен ли пароль от игрового аккаунта?', a: 'Нет. Достаточно игрового тега или скриншота. Никому не передавай вход в аккаунт: ни клубу, ни «помощникам».' },
  { q: 'Как быстро приходят деньги?', a: 'После заявки на вывод её проверяет администратор, затем выплата уходит выбранным способом. Статус заявки виден в боте, а готовые выплаты появляются в ленте выше.' },
  { q: 'Безопасны ли мои данные?', a: 'Мы работаем только с твоим Telegram-аккаунтом и игровым тегом. Пароли, коды подтверждения и вход в игровой аккаунт нам не нужны, и мы их никогда не просим.' },
  { q: 'Есть ли реферальная программа?', a: 'Да. Приглашай друзей по своей ссылке из раздела «Рефералы» в боте. Когда друг выполнит 3 квеста и проведёт 3 дня в клубе, ты получишь 2 500 EXC, а друг 3 000 EXC. Дальше ты получаешь 10% от EXC с его квестов, пока он активен (12% с EGC Pass).' },
  { q: 'Что такое мини-апп?', a: 'Это клуб внутри Telegram: квесты и отчёты, профиль и рейтинг, магазин, вывод и рефералы в одном окне. Открывается кнопкой в боте после регистрации.' },
  { q: 'Как связаться с поддержкой?', a: 'Напиши в раздел поддержки в боте: ответим там же. Если вопрос про сотрудничество, смотри страницу «Партнёрам».' },
  { q: 'Как проверяются квесты?', a: 'Часть квестов проверяется автоматически по игровому тегу, остальные подтверждаются скриншотом, который смотрит модератор.' },
];

const STEPS = [
  { title: 'Выбери квест', text: 'Игры, которые ты любишь: Brawl Stars, Clash Royale, Clash of Clans, PUBG и другие. Награда видна до старта.' },
  { title: 'Играй и выполняй', text: 'Для многих квестов прогресс считается сам по твоему игровому тегу, остальные подтверждаются скриншотом.' },
  { title: 'Получай EXC и выводи', text: 'EXC тратятся в магазине или выводятся на карту, по СБП, в Telegram Stars или GRAM.' },
];

/** До 6 квестов: по одному лучшему (по награде) на игру, чтобы блок не состоял из одной игры. Спонсорские, партнёрские (внешние офферы, часто с покупкой), закрытые и «только для совета» не берём. */
function pickFeatured(quests: Quest[]): Quest[] {
  const best = new Map<string, Quest>();
  for (const q of quests) {
    if (q.councilOnly || q.sponsored || q.externalAutoApprove || q.campaignClosed || !q.gameName || q.gameName.toUpperCase() === 'UGC') continue;
    const cur = best.get(q.gameName);
    if (!cur || q.rewardCoins > cur.rewardCoins) best.set(q.gameName, q);
  }
  return [...best.values()].sort((a, b) => b.rewardCoins - a.rewardCoins).slice(0, 6);
}

/** Типичная награда за квест (медиана по обычным квестам): на ней считаем «путь до первой выплаты». */
function typicalReward(quests: Quest[]): number {
  const r = quests
    .filter(q => !q.councilOnly && !q.sponsored && !q.externalAutoApprove && !q.campaignClosed && q.rewardCoins > 0)
    .map(q => q.rewardCoins)
    .sort((a, b) => a - b);
  return r.length ? r[Math.floor(r.length / 2)] : 0;
}

export default async function Home() {
  const [stats, leaderboard, quests, games] = await Promise.all([
    api.stats().catch(() => null),
    api.leaderboard('overall').catch(() => ({ entries: [], me: null })),
    api.quests().catch(() => [] as Quest[]),
    api.games().catch(() => [] as string[]),
  ]);
  const featured = pickFeatured(quests);
  const typical = typicalReward(quests);
  const questsToFirst = typical > 0 ? Math.ceil((FIRST_WITHDRAWAL_EXC - WELCOME_BONUS_EXC) / typical) : 0;

  const guest = (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* ── Hero ── */}
      <section className="hm-hero">
        <div className="hm-hero-glow" />
        <div className="relative space-y-5">
          <span className="hm-eyebrow"><i />Experience Gaming Club · реальные выплаты</span>
          <h1 className="font-gaming">
            Занимайтесь <em>любимым делом</em>.<br />Мы вас за это <em>вознаградим</em>.
          </h1>
          <p className="text-lg sm:text-xl max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            Получай реальные деньги за игры, в которые уже играешь. Выполняй квесты, зарабатывай <strong className="gradient-text-gold">EXC</strong> и выводи деньги. Бесплатно
          </p>
          <div className="hm-cta-row">
            <Link href="/profile" className="hm-btn hm-btn-main">Войти через Telegram</Link>
            <a href={botLink('site_hero')} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-ghost">Открыть бота</a>
          </div>
        </div>
      </section>


      {/* ── Клуб в цифрах ── */}
      {stats && (
        <section className="hm-stats reveal" aria-label="Клуб в цифрах">
          <div className="hm-stat"><div className="hm-stat-num"><CountUp value={stats.totalPlayers} /></div><div className="hm-stat-label">игроков в клубе</div></div>
          <div className="hm-stat"><div className="hm-stat-num"><CountUp value={stats.totalQuestsCompleted} /></div><div className="hm-stat-label">квестов выполнено</div></div>
          <div className="hm-stat"><div className="hm-stat-num gold"><CountUp value={stats.totalExcIssued} /></div><div className="hm-stat-label">EXC выдано</div></div>
          <div className="hm-stat"><div className="hm-stat-num">{stats.topGame || '—'}</div><div className="hm-stat-label">топ игра</div></div>
          <div className="hm-stat"><div className="hm-stat-num green">{stats.healthRatioPercent}%</div><div className="hm-stat-label">здоровье фонда</div></div>
        </section>
      )}


      {/* ── Последние выплаты ── */}
      <PayoutFeed />


      {/* ── Как это работает ── */}
      <section className="hm-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Три шага</div>
            <h2 className="section-title">Как это работает</h2>
          </div>
        </div>
        <div className="hm-steps">
          {STEPS.map((s, i) => (
            <div key={s.title} className="hm-step how-step">
              <span className="hm-step-num">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        {questsToFirst > 0 && (
          <div className="hm-path">
            <div className="hm-path-top">
              <b>Путь до первой выплаты</b>
              <span>≈ {questsToFirst} {questsToFirst % 10 === 1 && questsToFirst % 100 !== 11 ? 'квест' : [2, 3, 4].includes(questsToFirst % 10) && ![12, 13, 14].includes(questsToFirst % 100) ? 'квеста' : 'квестов'} по {typical.toLocaleString('ru')} EXC</span>
            </div>
            <div className="hm-path-bar" aria-hidden="true"><i /></div>
            <div className="hm-path-scale">
              <span>{WELCOME_BONUS_EXC} EXC в подарок</span>
              <span>{FIRST_WITHDRAWAL_EXC.toLocaleString('ru')} EXC — можно выводить</span>
            </div>
            <p>Расчёт по типичной награде за квест сейчас. Реальный путь зависит от выбранных квестов и твоей активности.</p>
          </div>
        )}
      </section>


      {/* ── Что внутри клуба ── */}
      <section className="hm-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Не только квесты</div>
            <h2 className="section-title">Что внутри клуба</h2>
          </div>
        </div>
        <div className="hm-features">
          {FEATURES.map(f => (
            <div key={f.title} className="hm-feature">
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ── Отзывы ── */}
      <Reviews channelUrl={REVIEWS_URL} />


      {/* ── Партнёрам ── */}
      <section className="hm-section reveal">
        <div className="hm-partner">
          <div>
            <div className="hm-kicker">Для игровых студий</div>
            <h2 className="section-title">Живые игроки и проверенный результат</h2>
            <p>Размещаем квесты на установку и достижение уровней в вашей игре. Каждое выполнение проверяется, а цифры проверки открыты: смотрите сами.</p>
          </div>
          <div className="hm-partner-btns">
            <Link href="/partners" className="hm-btn hm-btn-main">Стать партнёром</Link>
            <Link href="/partners/proof" className="hm-btn hm-btn-ghost">Как мы проверяем</Link>
          </div>
        </div>
      </section>


      {/* ── Вопросы ── */}
      <section className="hm-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Коротко о главном</div>
            <h2 className="section-title">Частые вопросы</h2>
          </div>
        </div>
        <div className="hm-faq">
          {FAQ.map(f => (
            <details key={f.q} className="hm-faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>


      {/* ── Финальный призыв ── */}
      <section className="hm-final reveal">
        <h2 className="font-heading">Готов начать?</h2>
        <p>Войди через Telegram и забери первый квест: награда видна до старта. Если ты ещё не в клубе, сначала открой бота и пройди регистрацию.</p>
        <div className="hm-cta-row">
          <Link href="/profile" className="hm-btn hm-btn-main">Войти через Telegram</Link>
          <a href={botLink('site_final')} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-ghost">Открыть бота</a>
        </div>
      </section>


      <p className="hm-disclaimer">
        Награды и выплаты зависят от выполнения квестов и проверки результата, они не гарантируются. Суммы в рублях ориентировочные: курс вывода зависит от состояния фонда клуба. Цифры на странице обновляются автоматически.
      </p>

    </div>
  );

  const member = (
    <>
      {/* ── Последние выплаты ── */}
      <PayoutFeed />


      {/* ── Горячие квесты ── */}
      {featured.length > 0 && (
        <section className="hm-section reveal">
          <div className="hm-head">
            <div>
              <div className="hm-kicker">Прямо сейчас</div>
              <h2 className="section-title">Горячие квесты</h2>
            </div>
            <Link href="/quests" className="hm-link">Все квесты →</Link>
          </div>
          <div className="hm-quests">
            {featured.map(q => (
              <Link key={q.id} href="/quests" className="hm-quest">
                <div className="hm-quest-top">
                  <span className="hm-chip">{q.gameName}</span>
                  {q.brawlAutoVerify && <span className="hm-chip auto">автопроверка</span>}
                  {q.highlightNew && <span className="hm-chip new">NEW</span>}
                </div>
                <h3>{q.title}</h3>
                <p>{q.description}</p>
                <div className="hm-reward">
                  <b>+{q.rewardCoins.toLocaleString('ru')} EXC</b>
                  <span>+{q.rewardXp} XP{q.ticketReward ? ` · ${q.ticketReward} бил.` : ''}{q.durationDays ? ` · ${q.durationDays} дн.` : ''}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}


      {/* ── Игры ── */}
      {games.length > 0 && (
        <section className="hm-section reveal">
          <div className="hm-head">
            <div>
              <div className="hm-kicker">Во что играем</div>
              <h2 className="section-title">Игры клуба</h2>
            </div>
          </div>
          <div className="gm-grid">
            {games.map(g => (
              <GameBanner key={g} name={g} href={`/quests?game=${encodeURIComponent(g)}`} />
            ))}
          </div>
        </section>
      )}


      {/* ── Рейтинг ── */}
      <section className="hm-section reveal" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Лучшие из лучших</div>
            <h2 className="section-title">Рейтинг игроков</h2>
          </div>
        </div>
        <LeaderboardTabs initial={leaderboard.entries} limit={10} />
      </section>


    </>
  );

  return <HomeSwitch guest={guest} member={member} />;
}
