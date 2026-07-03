'use client';

import { useState, useEffect } from 'react';
import { api, LeaderboardEntry } from '@/lib/api';
import LeaderboardTable from './LeaderboardTable';

export default function LeaderboardTabs({ initial }: { initial: LeaderboardEntry[] }) {
  const [tab,     setTab    ] = useState<'overall' | 'weekly'>('overall');
  const [data,    setData   ] = useState<Record<string, LeaderboardEntry[]>>({ overall: initial });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data[tab]) return;
    setLoading(true);
    api.leaderboard(tab)
      .then(d => setData(prev => ({ ...prev, [tab]: d })))
      .finally(() => setLoading(false));
  }, [tab]);

  const entries = data[tab] ?? [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['overall', 'weekly'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'tab-active' : 'tab-inactive'}`}
          >
            {t === 'overall' ? '🏆 Всё время' : '⚡ Эта неделя'}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="card p-10 text-center" style={{ color: 'var(--muted)' }}>
          <div className="skeleton h-4 w-48 mx-auto mb-3" />
          <div className="skeleton h-4 w-36 mx-auto" />
        </div>
      ) : (
        <LeaderboardTable entries={entries} />
      )}
    </div>
  );
}
