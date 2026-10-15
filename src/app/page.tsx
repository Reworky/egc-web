import Link from 'next/link';
import { api, Quest } from '@/lib/api';
import LeaderboardTabs from '@/components/LeaderboardTabs';
import CountUp from '@/components/CountUp';
import PayoutTicker from '@/components/PayoutTicker';
import './home.css';

export const revalidate = 60;

const STEPS = [
  { icon: '🎯', title: 'Выбери квест', text: 'Игры, которые ты любишь: Brawl Stars, Clash Royale, Clash of Clans, PUBG и другие. Награда видна до старта.' },
  { icon: '⚔️', title: 'Играй и выполняй', text: 'Для многих квестов прогресс считается сам по твоему игровому тегу, остальные подтверждаются скриншотом.' },
  { icon: '💸', title: 'Получай EXC и выводи', text: 'EXC тратятся в магазине или выводятся на карту, по СБП, в Telegram Stars или GRAM.' },
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

export default async function Home() {
  const [stats, leaderboard, quests, games] = await Promise.all([
    api.stats().catch(() => null),
    api.leaderboard('overall').catch(() => ({ entries: [], me: null })),
    api.quests().catch(() => [] as Quest[]),
    api.games().catch(() => [] as string[]),
  ]);
  const featured = pickFeatured(quests);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* ── Hero ── */}
      <section className="hm-hero">
        <div className="hm-hero-glow" />
        <div className="relative space-y-5">
          <span className="hm-eyebrow"><i />Квесты · EXC · реальные выплаты</span>
          <h1 className="font-gaming leading-none" style={{ fontSize: 'clamp(2.6rem, 8vw, 5.6rem)' }}>
            <span className="text-white" style={{ display: 'block', letterSpacing: '0.06em' }}>EXPERIENCE</span>
            <span className="hm-shimmer" style={{ display: 'block', letterSpacing: '0.18em', fontSize: '0.55em' }}>— GAMING CLUB —</span>
          </h1>
          <p className="text-lg sm:text-xl max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            Выполняй игровые квесты, зарабатывай <strong className="gradient-text-gold">EXC</strong> и выводи реальные деньги
          </p>
          <div className="hm-cta-row">
            <a href="https://t.me/invitetogamebot" target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">
              🚀 Открыть EGC
            </a>
            <Link href="/quests" className="hm-btn hm-btn-ghost">Смотреть квесты</Link>
          </div>
        </div>
        <PayoutTicker />
      </section>

      {/* ── Клуб в цифрах ── */}
      {stats && (
        <section className="hm-stats reveal" aria-label="Клуб в цифрах">
          <div className="hm-stat"><div className="hm-stat-icon">👥</div><div className="hm-stat-num"><CountUp value={stats.totalPlayers} /></div><div className="hm-stat-label">игроков в клубе</div></div>
          <div className="hm-stat"><div className="hm-stat-icon">✅</div><div className="hm-stat-num"><CountUp value={stats.totalQuestsCompleted} /></div><div className="hm-stat-label">квестов выполнено</div></div>
          <div className="hm-stat"><div className="hm-stat-icon">🪙</div><div className="hm-stat-num gold"><CountUp value={stats.totalExcIssued} /></div><div className="hm-stat-label">EXC выдано</div></div>
          <div className="hm-stat"><div className="hm-stat-icon">🎮</div><div className="hm-stat-num">{stats.topGame || '—'}</div><div className="hm-stat-label">топ игра</div></div>
          <div className="hm-stat"><div className="hm-stat-icon">📈</div><div className="hm-stat-num green">{stats.healthRatioPercent}%</div><div className="hm-stat-label">здоровье фонда</div></div>
        </section>
      )}

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
              <div className="hm-step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

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
                  {q.brawlAutoVerify && <span className="hm-chip auto">⚡ автопроверка</span>}
                  {q.highlightNew && <span className="hm-chip new">NEW</span>}
                </div>
                <h3>{q.title}</h3>
                <p>{q.description}</p>
                <div className="hm-reward">
                  <b>+{q.rewardCoins.toLocaleString('ru')} EXC</b>
                  <span>+{q.rewardXp} XP{q.ticketReward ? ` · 🎟 ${q.ticketReward}` : ''}{q.durationDays ? ` · ${q.durationDays} дн.` : ''}</span>
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
          <div className="hm-games">
            {games.map(g => (
              <Link key={g} href={`/quests?game=${encodeURIComponent(g)}`} className="hm-game">{g}</Link>
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

      {/* ── Финальный призыв ── */}
      <section className="hm-final reveal">
        <h2 className="font-heading">Готов начать?</h2>
        <p>Открой бота в Telegram, привяжи игровой тег и забери первый квест: награда видна до старта.</p>
        <a href="https://t.me/invitetogamebot" target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">🚀 Открыть EGC в Telegram</a>
      </section>
    </div>
  );
}
