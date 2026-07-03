import { Quest } from '@/lib/api';

const CAT_CLASS: Record<string, string> = {
  'Лёгкие': 'cat-easy',
  'Средние': 'cat-medium',
  'Сложные': 'cat-hard',
};

const CAT_LINE: Record<string, string> = {
  'Лёгкие': '#22c55e',
  'Средние': '#f59e0b',
  'Сложные': '#ef4444',
};

export default function QuestCard({ quest }: { quest: Quest }) {
  const catClass = CAT_CLASS[quest.category] ?? '';
  const lineColor = CAT_LINE[quest.category] ?? '#7c3aed';

  return (
    <div className="card flex flex-col overflow-hidden" style={{ padding: 0 }}>
      {/* цветная полоска */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${lineColor}, transparent)` }} />

      <div className="flex flex-col gap-3 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white text-sm leading-snug">{quest.title}</h3>
          <span className={`text-xs px-2.5 py-0.5 rounded-full shrink-0 font-semibold ${catClass}`}>
            {quest.category}
          </span>
        </div>

        {quest.description && (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
            {quest.description}
          </p>
        )}

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
            <span>⏱ {quest.durationDays} дн.</span>
            <span>🖥 {quest.platform}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="xp-badge">+{quest.rewardXp} XP</span>
            <span className="exc-badge">+{quest.rewardCoins.toLocaleString('ru')} EXC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
