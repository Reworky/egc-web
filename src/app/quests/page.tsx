import { api } from '@/lib/api';
import QuestFilter from '@/components/QuestFilter';

export const revalidate = 60;

export default async function QuestsPage() {
  const [quests, games] = await Promise.all([
    api.quests().catch(() => []),
    api.games().catch(() => []),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 10, color: '#a855f7' }}>
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <path d="M12 12h.01M8 12h.01M16 12h.01M12 8v8"/>
          </svg>
          Каталог квестов
        </h1>
        <div className="flex items-center gap-4 mt-2 text-sm" style={{ color: 'var(--muted)' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#4ade80', display: 'inline-block' }} />
            {quests.length} квестов
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#c084fc', display: 'inline-block' }} />
            {games.length} игр
          </span>
        </div>
        <div className="mt-4 h-px" style={{
          background: 'linear-gradient(90deg, rgba(168,85,247,0.6), rgba(236,72,153,0.3), transparent)',
        }} />
      </div>

      <QuestFilter quests={quests} games={games} />
    </div>
  );
}
