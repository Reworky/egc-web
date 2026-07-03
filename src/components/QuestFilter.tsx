'use client';

import { useState, useMemo } from 'react';
import { Quest } from '@/lib/api';
import QuestCard from './QuestCard';

const CATEGORIES = ['Все', 'Лёгкие', 'Средние', 'Сложные'];

const STATIC_GAMES = ['PUBG', 'CS2', 'Grim Soul', 'EA FC 26', 'Brawl Stars', 'Clash Royale', 'Last Day on Earth'];

const CAT_ACTIVE: Record<string, React.CSSProperties> = {
  'Лёгкие': { background: '#22c55e', color: '#fff', borderColor: '#22c55e' },
  'Средние': { background: '#f59e0b', color: '#fff', borderColor: '#f59e0b' },
  'Сложные': { background: '#ef4444', color: '#fff', borderColor: '#ef4444' },
};
const CAT_INACTIVE: Record<string, React.CSSProperties> = {
  'Лёгкие': { color: '#4ade80' },
  'Средние': { color: '#fbbf24' },
  'Сложные': { color: '#f87171' },
};

export default function QuestFilter({ quests, games: apiGames }: { quests: Quest[]; games: string[] }) {
  const games = apiGames.length > 0 ? apiGames : STATIC_GAMES;
  const [search,   setSearch  ] = useState('');
  const [game,     setGame    ] = useState('Все');
  const [category, setCategory] = useState('Все');

  const filtered = useMemo(() => quests.filter(q => {
    if (game !== 'Все' && q.gameName !== game) return false;
    if (category !== 'Все' && q.category !== category) return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [quests, game, category, search]);

  const byGame = useMemo(() => {
    const activeGames = game === 'Все' ? games : [game];
    return activeGames.reduce<Record<string, Quest[]>>((acc, g) => {
      const list = filtered.filter(q => q.gameName === g);
      if (list.length) acc[g] = list;
      return acc;
    }, {});
  }, [filtered, games, game]);

  return (
    <div className="space-y-6">
      {/* Поиск */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: 'var(--muted)' }}>🔍</span>
        <input
          type="text"
          placeholder="Поиск по названию квеста..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
        />
      </div>

      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        <div className="space-y-2 flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Игра</p>
          <div className="flex gap-2 flex-wrap">
            {['Все', ...games].map(g => (
              <button key={g} onClick={() => setGame(g)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={game === g ? {
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  color: 'white', border: '1px solid transparent',
                  boxShadow: '0 2px 10px rgba(124,58,237,0.4)',
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  color: 'var(--muted)',
                }}>
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Сложность</p>
          <div className="flex gap-2">
            {CATEGORIES.map(cat => {
              const active = category === cat;
              const activeStyle: React.CSSProperties = cat === 'Все'
                ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', border: '1px solid transparent' }
                : { border: '1px solid', ...CAT_ACTIVE[cat] };
              const inactiveStyle: React.CSSProperties = {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(124,58,237,0.2)',
                ...(CAT_INACTIVE[cat] ?? { color: 'var(--muted)' }),
              };
              return (
                <button key={cat} onClick={() => setCategory(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={active ? activeStyle : inactiveStyle}>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Счётчик */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
        <span className="text-xs px-3 py-1 rounded-full shrink-0"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
          {filtered.length} квестов
        </span>
        <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
      </div>

      {/* Результаты */}
      {Object.entries(byGame).map(([g, list]) => (
        <section key={g} className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white">{g}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: 'var(--accent3)' }}>
              {list.length}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {list.map(q => <QuestCard key={q.id} quest={q} />)}
          </div>
        </section>
      ))}

      {filtered.length === 0 && (
        <div className="card p-16 text-center space-y-3">
          <div className="text-5xl">🔍</div>
          <p className="font-bold text-white">Ничего не найдено</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Попробуй изменить фильтры или поисковый запрос</p>
        </div>
      )}
    </div>
  );
}
