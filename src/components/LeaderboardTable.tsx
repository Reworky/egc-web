import { LeaderboardEntry } from '@/lib/api';

const RANK_ICON: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
const RANK_CLASS: Record<number, string> = { 1: 'rank-1', 2: 'rank-2', 3: 'rank-3' };

function Avatar({ name }: { name: string }) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
      style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  if (!entries.length) {
    return (
      <div className="card p-10 text-center" style={{ color: 'var(--muted)' }}>
        Рейтинг пока пуст
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>#</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Игрок</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--muted)' }}>Уровень</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>XP</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--muted)' }}>Квестов</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr
              key={e.telegramId}
              className={RANK_CLASS[e.rank] ?? ''}
              style={{
                background: RANK_CLASS[e.rank] ? undefined : (e.rank % 2 === 0 ? 'var(--bg)' : 'var(--bg2)'),
                borderBottom: '1px solid rgba(124,58,237,0.1)',
                transition: 'background 0.2s',
              }}
            >
              <td className="px-4 py-3 w-12">
                <span className="text-base font-black">
                  {RANK_ICON[e.rank] ?? (
                    <span style={{ color: 'var(--muted)' }}>{e.rank}</span>
                  )}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={e.nickname} />
                  <div>
                    <div className="font-semibold text-white text-sm">{e.nickname}</div>
                    {e.profileTitle && (
                      <div className="text-xs gradient-text">{e.profileTitle}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-right hidden sm:table-cell">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', color: 'var(--accent3)' }}>
                  {e.levelName}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="font-black text-white">{e.xp.toLocaleString('ru')}</span>
              </td>
              <td className="px-4 py-3 text-right hidden md:table-cell">
                <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>{e.completedQuests}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
