'use client';

import { useState, useEffect } from 'react';
import { api, Submission, RewardRequest } from '@/lib/api';

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  APPROVED:  { label: 'Одобрено',    color: '#22c55e' },
  PENDING:   { label: 'На проверке', color: '#f59e0b' },
  REJECTED:  { label: 'Отклонено',   color: '#ef4444' },
  DRAFT:     { label: 'Черновик',    color: '#94a3b8' },
  NEEDS_INFO:{ label: 'Нужна инфо',  color: '#a855f7' },
  CANCELLED: { label: 'Отменено',    color: '#64748b' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABEL[status] ?? { label: status, color: '#94a3b8' };
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: s.color + '22', color: s.color }}>
      {s.label}
    </span>
  );
}

function SubmissionsList() {
  const [data, setData] = useState<Submission[] | null>(null);

  useEffect(() => {
    api.submissions().then(setData).catch(() => setData([]));
  }, []);

  if (!data) return <Loader />;
  if (!data.length) return <Empty text="Квестов ещё не было" />;

  return (
    <div className="space-y-2">
      {data.map(s => (
        <div key={s.id} className="rounded-xl p-4 flex flex-col gap-2"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-white text-sm">{s.questTitle}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.gameName} · {s.category}</p>
            </div>
            <StatusBadge status={s.status} />
          </div>
          {s.status === 'APPROVED' && (
            <div className="flex gap-3 text-xs">
              <span className="text-purple-400">+{s.rewardXp} XP</span>
              <span className="text-yellow-400">+{s.rewardCoins.toLocaleString('ru')} EXC</span>
            </div>
          )}
          {s.moderatorComment && (
            <p className="text-xs rounded-lg px-3 py-2" style={{ background: 'var(--bg3)', color: 'var(--muted)' }}>
              💬 {s.moderatorComment}
            </p>
          )}
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{s.createdAt}</p>
        </div>
      ))}
    </div>
  );
}

function RewardsList() {
  const [data, setData] = useState<RewardRequest[] | null>(null);

  useEffect(() => {
    api.rewards().then(setData).catch(() => setData([]));
  }, []);

  if (!data) return <Loader />;
  if (!data.length) return <Empty text="Заявок на награды ещё не было" />;

  return (
    <div className="space-y-2">
      {data.map(r => (
        <div key={r.id} className="rounded-xl p-4 flex flex-col gap-2"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-white text-sm">{r.rewardTitle}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{r.category}</p>
            </div>
            <StatusBadge status={r.status} />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-yellow-400 font-semibold">{r.priceCoins.toLocaleString('ru')} EXC</span>
            <span style={{ color: 'var(--muted)' }}>{r.createdAt}</span>
          </div>
          {r.adminComment && (
            <p className="text-xs rounded-lg px-3 py-2" style={{ background: 'var(--bg3)', color: 'var(--muted)' }}>
              💬 {r.adminComment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Loader() {
  return (
    <div className="py-10 text-center" style={{ color: 'var(--muted)' }}>Загрузка...</div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="py-10 text-center" style={{ color: 'var(--muted)' }}>{text}</div>
  );
}

const TABS = [
  { id: 'quests', label: '📋 Квесты' },
  { id: 'rewards', label: '🎁 Заявки' },
] as const;

export default function ProfileTabs() {
  const [tab, setTab] = useState<'quests' | 'rewards'>('quests');

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: tab === t.id ? 'var(--accent)' : 'var(--bg2)',
              border: `1px solid ${tab === t.id ? 'var(--accent)' : 'var(--border)'}`,
              color: tab === t.id ? 'white' : 'var(--muted)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'quests' ? <SubmissionsList /> : <RewardsList />}
    </div>
  );
}
