import Link from 'next/link';
import { api, Quest, RewardItem } from '@/lib/api';
import { CHANNEL_URL, PAYOUTS_URL } from '@/lib/contacts';
import LeaderboardTabs from '@/components/LeaderboardTabs';
import PayoutFeed from '@/components/PayoutFeed';
import Reviews from '@/components/Reviews';
import HomeSwitch from '@/components/HomeSwitch';
import GameBanner from '@/components/GameBanner';
import TrustStats from '@/components/TrustStats';
import HeroArt from '@/components/HeroArt';

export const revalidate = 60;

const BOT_URL = 'https://t.me/invitetogamebot';
// Метки источника трафика: бот (handleStart) считает клики и регистрации по src_<код>, коды заводятся в «📈 Трафик»
const botLink = (src: string) => `${BOT_URL}?start=src_${src}`;
const REVIEWS_URL = 'https://t.me/egc_payouts';
// Цель первого вывода и стартовый бонус: те же числа, что в боте (WalletController.MIN_WITHDRAWAL, WELCOME_BONUS_EXC)
const FIRST_WITHDRAWAL_EXC = 5000;
const WELCOME_BONUS_EXC = 200;

const FAQ = [
  { q: 'Это правда бесплатно?', a: 'Да. Вступить и играть в клубе бесплатно, регистрация проходит через Telegram. За регистрацию бот сразу начисляет 200 EXC стартового капитала.' },
  { q: 'Что такое EXC?', a: 'Внутренняя валюта клуба. EXC начисляются за выполненные квесты сразу после засчёта. Их можно потратить в магазине на донат и награды или вывести деньгами: по номиналу 100 EXC = 1 ₽, итоговая сумма зависит от курса фонда, он виден в боте перед заявкой.' },
  { q: 'Как выводятся деньги?', a: 'EXC можно вывести на карту по СБП, в Telegram Stars или в GRAM. Актуальные лимиты и курс всегда показывает бот, а последние выплаты видны выше на этой странице.' },
  { q: 'Нужен ли пароль от игрового аккаунта?', a: 'Нет. Достаточно игрового тега или скриншота. Никому не передавай вход в аккаунт: ни клубу, ни «помощникам».' },
  { q: 'Как быстро приходят деньги?', a: 'После заявки на вывод её проверяет администратор, затем выплата уходит выбранным способом. Статус заявки виден в боте, а готовые выплаты появляются в ленте выше.' },
  { q: 'Безопасны ли мои данные?', a: 'Мы работаем только с твоим Telegram-аккаунтом и игровым тегом. Пароли, коды подтверждения и вход в игровой аккаунт нам не нужны, и мы их никогда не просим.' },
  { q: 'Есть ли реферальная программа?', a: 'Да. Приглашай друзей по своей ссылке из раздела «Рефералы» в боте. Когда друг выполнит 3 квеста и проведёт 3 дня в клубе, ты получишь 2 500 EXC, а друг 3 000 EXC. Дальше ты получаешь 10% от EXC с его квестов, пока он активен (12% с EGC Pass).' },
  { q: 'Что такое мини-апп?', a: 'Это клуб внутри Telegram: квесты и отчёты, профиль и рейтинг, магазин, вывод и рефералы в одном окне. Открывается кнопкой в боте после регистрации.' },
  { q: 'Как связаться с поддержкой?', a: 'Напиши в раздел поддержки в боте: ответим там же. Если вопрос про сотрудничество, смотри страницу «Партнёрам».' },
  { q: 'Квест не засчитался, что делать?', a: 'Подожди немного: автоматическая проверка идёт с небольшой задержкой, обычно несколько минут, а отчёты по скриншотам модератор смотрит до 24 часов. Если баланс не обновился дольше, напиши в поддержку в боте («Помощь» → «Поддержка») и укажи название квеста и время отправки.' },
  { q: 'Почему аккаунт могут заблокировать?', a: 'Чаще всего за мультиаккаунты: один человек — один аккаунт в клубе, один игровой аккаунт — одна привязка. Такие аккаунты блокируются, а EXC на них конфискуются. Если считаешь, что блокировка ошибочна, напиши в поддержку в боте.' },
  { q: 'Как проверяются квесты?', a: 'Часть квестов проверяется автоматически по игровому тегу, остальные подтверждаются скриншотом, который смотрит модератор.' },
];

const STEPS = ['Берёшь квест', 'Выполняешь в игре', 'Получаешь EXC', 'Тратишь или выводишь'];

const SHOP_UNITS: Record<string, string> = { Gems: 'Гемы', UC: 'UC', 'G-Coin': 'G-Coin', 'Пополнение': 'Пополнение Steam' };

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

type GameShowcase = { name: string };

/** Витрина игр для гостя: по каждой игре число квестов, вилка наград и пример. Спонсорские, партнёрские, закрытые, «только для совета» и UGC не берём. */
function showcaseGames(quests: Quest[], games: string[]): GameShowcase[] {
  const byGame = new Map<string, Quest[]>();
  for (const q of quests) {
    if (q.councilOnly || q.sponsored || q.externalAutoApprove || q.campaignClosed || !q.gameName || q.gameName.toUpperCase() === 'UGC') continue;
    byGame.set(q.gameName, [...(byGame.get(q.gameName) ?? []), q]);
  }
  return games
    .filter(g => byGame.has(g))
    .map(g => ({ name: g }));
}

type ShopCard = { category: string; units: string; count: number; soon: boolean };

/** Витрина магазина для гостя: по категории (игре) что можно получить; цены не показываем. «Кастомизация» на сайте не выводится. */
function shopShowcase(items: RewardItem[]): ShopCard[] {
  const map = new Map<string, { units: Set<string>; count: number; locked: number }>();
  for (const it of items) {
    if (!it.category || it.category === 'Кастомизация') continue;
    const e = map.get(it.category) ?? { units: new Set<string>(), count: 0, locked: 0 };
    const unit = it.title.split(' - ')[1]?.split(' ')[0];
    if (unit) e.units.add(SHOP_UNITS[unit] ?? unit);
    e.count += 1;
    if ((it as RewardItem & { locked?: boolean }).locked) e.locked += 1;
    map.set(it.category, e);
  }
  return [...map.entries()].map(([category, e]) => ({ category, units: [...e.units].join(', '), count: e.count, soon: e.locked === e.count }));
}

const plural = (n: number, one: string, few: string, many: string) =>
  n % 10 === 1 && n % 100 !== 11 ? one : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? few : many;

export default async function Home() {
  const [stats, leaderboard, quests, games, shopItems] = await Promise.all([
    api.stats().catch(() => null),
    api.leaderboard('overall').catch(() => ({ entries: [], me: null })),
    api.quests().catch(() => [] as Quest[]),
    api.games().catch(() => [] as string[]),
    api.shopItems().catch(() => [] as RewardItem[]),
  ]);
  const featured = pickFeatured(quests);
  const typical = typicalReward(quests);
  const showcase = showcaseGames(quests, games);
  const shopCards = shopShowcase(shopItems);
  const questsToFirst = typical > 0 ? Math.ceil((FIRST_WITHDRAWAL_EXC - WELCOME_BONUS_EXC) / typical) : 0;

  const guest = (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* ── Первый экран ── */}
      <section className="hm-hero">
        <div className="hm-hero-glow" />
        <div className="relative space-y-5">
          <span className="hm-eyebrow"><i />Experience Gaming Club · реальные выплаты</span>
          <h1 className="font-gaming">
            Занимайтесь <em>любимым делом</em>.<br />Мы вас за это <em>вознаградим</em>.
          </h1>
          <p className="text-lg sm:text-xl max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            Выполняй квесты в играх, получай <strong className="gradient-text-gold">EXC</strong>, трать в магазине или выводи деньгами. Бесплатно
          </p>
          <div className="hm-cta-row">
            <a href={botLink('site_hero')} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Открыть в Telegram</a>
            <Link href="/profile" className="hm-btn hm-btn-ghost">Войти на сайт</Link>
          </div>
          <HeroArt />
        </div>
      </section>

      {/* ── Три цифры доверия ── */}
      {stats && <TrustStats players={stats.totalPlayers} />}


      {/* ── Как это работает ── */}
      <section className="hm-section reveal">
        <div className="hm-head">
          <div>
            <div className="hm-kicker">Четыре шага</div>
            <h2 className="section-title">Как это работает</h2>
          </div>
        </div>
        <div className="hm-steps four">
          {STEPS.map((title, i) => (
            <div key={title} className="hm-step how-step">
              <span className="hm-step-num">0{i + 1}</span>
              <h3>{title}</h3>
            </div>
          ))}
        </div>
        {questsToFirst > 0 && (
          <div className="hm-path">
            <div className="hm-path-top">
              <b>Путь до первой выплаты</b>
              <span>≈ {questsToFirst} {plural(questsToFirst, 'квест', 'квеста', 'квестов')} по {typical.toLocaleString('ru')} EXC</span>
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


      {/* ── Игры и квесты ── */}
      {showcase.length > 0 && (
        <section className="hm-section reveal">
          <div className="hm-head">
            <div>
              <div className="hm-kicker">Во что играем</div>
              <h2 className="section-title">Игры и квесты</h2>
            </div>
          </div>
          <div className="gm-grid">
            {showcase.map(g => (
              <div key={g.name} className="gm-card">
                <GameBanner name={g.name} />
                <div className="gm-info">
                  <b>{g.name}</b>
                </div>
              </div>
            ))}
          </div>
          <div className="hm-section-cta">
            <Link href="/quests" className="hm-btn hm-btn-ghost">Смотреть все квесты</Link>
          </div>
        </section>
      )}


      {/* ── Выплаты ── */}
      <PayoutFeed />


      {/* ── Магазин и награды ── */}
      {shopCards.length > 0 && (
        <section className="hm-section reveal">
          <div className="hm-head">
            <div>
              <div className="hm-kicker">Трать внутри клуба</div>
              <h2 className="section-title">Магазин и награды</h2>
            </div>
          </div>
          <div className="gm-grid">
            {shopCards.map(c => (
              <div key={c.category} className="gm-card">
                <GameBanner name={c.category} />
                <div className="gm-info">
                  <b>{c.units || 'Награды'}</b>
                  <span>{c.soon ? 'скоро' : `${c.count} ${plural(c.count, 'вариант', 'варианта', 'вариантов')}`}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
            Подписка EGC Pass даёт бонусы к награде и донат по закупочной цене. Цены в EXC и остаток лимита видны в магазине после входа.
          </p>
        </section>
      )}


      {/* ── Отзывы ── */}
      <Reviews channelUrl={REVIEWS_URL} />


      {/* ── Сообщество ── */}
      <section className="hm-section reveal">
        <div className="hm-partner hm-community">
          <div>
            <h2 className="section-title">Мы в Telegram</h2>
            <p>Новости и анонсы квестов в канале клуба, реальные выплаты и отзывы игроков в канале выплат.</p>
          </div>
          <div className="hm-partner-btns">
            <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Канал клуба</a>
            <a href={PAYOUTS_URL} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-ghost">Канал выплат</a>
          </div>
        </div>
      </section>


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
        <p>Открой бота, пройди регистрацию и забери первый квест: награда видна до старта. Если ты уже в клубе, войди на сайт через Telegram.</p>
        <div className="hm-cta-row">
          <a href={botLink('site_final')} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Открыть в Telegram</a>
          <Link href="/profile" className="hm-btn hm-btn-ghost">Войти на сайт</Link>
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
