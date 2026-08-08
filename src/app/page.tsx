import { api } from '@/lib/api';
import StatCard from '@/components/StatCard';
import LeaderboardTabs from '@/components/LeaderboardTabs';

export const revalidate = 60;


export default async function Home() {
  const [stats, leaderboard] = await Promise.all([
    api.stats().catch(() => null),
    api.leaderboard('overall').catch(() => ({ entries: [], me: null })),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-20">

      {/* ── Hero ── */}
      <section className="relative text-center space-y-6 py-16">
        {/* внутренние орбы секции */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div style={{
            position: 'absolute', top: '10%', left: '20%',
            width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '5%', right: '15%',
            width: 250, height: 250,
            background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
        </div>

        <div className="relative space-y-4">
          <h1 className="font-gaming leading-none" style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)' }}>
            <span className="text-white" style={{ display: 'block', letterSpacing: '0.06em' }}>EXPERIENCE</span>
            <span className="gradient-text" style={{ display: 'block', letterSpacing: '0.18em', fontSize: '0.55em' }}>— GAMING CLUB —</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-lg mx-auto" style={{ color: 'var(--muted)' }}>
            Выполняй игровые квесты, зарабатывай <strong className="gradient-text-gold">EXC</strong> и выводи реальные деньги
          </p>

          <div className="flex gap-4 justify-center flex-wrap pt-2">
            <a
              href="https://t.me/invitetogamebot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)',
                boxShadow: '0 0 30px rgba(168,85,247,0.5), 0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              Открыть EGC
            </a>
            <a
              href="/quests"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(168,85,247,0.5)',
                color: 'white',
                boxShadow: '0 0 20px rgba(168,85,247,0.15)',
                backdropFilter: 'blur(10px)',
              }}
            >
              Смотреть квесты
            </a>
          </div>
        </div>
      </section>

      {/* ── Статистика ── */}
      {stats && (
        <section className="space-y-6" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="section-glow-blob" style={{ width: 360, height: 360, background: 'rgba(155,58,237,0.10)', top: '50%', right: -80, transform: 'translateY(-50%)' }} />
          <h2 className="section-title" style={{ position: 'relative' }}>Статистика клуба</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" style={{ position: 'relative' }}>
            <div className="stat-item"><StatCard label="Игроков в клубе"      value={stats.totalPlayers.toLocaleString('ru')}          icon="👥" /></div>
            <div className="stat-item"><StatCard label="Квестов выполнено"     value={stats.totalQuestsCompleted.toLocaleString('ru')}  icon="✅" /></div>
            <div className="stat-item"><StatCard label="EXC выдано"            value={stats.totalExcIssued.toLocaleString('ru')}        icon="🪙" accent="#fbbf24" /></div>
            <div className="stat-item"><StatCard label="Топ игра"              value={stats.topGame || '—'}                             icon="🎮" /></div>
            <div className="stat-item"><StatCard label="Здоровье фонда"        value={`${stats.healthRatioPercent}%`}                   icon="📈" accent="#4ade80" /></div>
          </div>
        </section>
      )}

      {/* ── Рейтинг ── */}
      <section className="space-y-6" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="section-glow-blob" style={{ width: 500, height: 500, background: 'rgba(58,100,237,0.08)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        <h2 className="section-title" style={{ position: 'relative' }}>Рейтинг игроков</h2>
        <div style={{ position: 'relative' }}>
          <LeaderboardTabs initial={leaderboard.entries} />
        </div>
      </section>

    </div>
  );
}
