'use client';

import { useState, useMemo } from 'react';
import { Quest } from '@/lib/api';
import QuestCard from './QuestCard';

type Sort = 'reward' | 'short' | 'default';

const SORTS: { id: Sort; label: string }[] = [
  { id: 'default', label: 'По порядку' },
  { id: 'reward', label: '💰 Больше награда' },
  { id: 'short', label: '⏱ Короче срок' },
];

const STATIC_GAMES = ['Brawl Stars', 'Clash Royale', 'Clash of Clans', 'PUBG Mobile', 'PUBG PC', 'CS2', 'Dota 2'];

export default function QuestFilter({ quests, games: apiGames }: { quests: Quest[]; games: string[] }) {
  const games = apiGames.length > 0 ? apiGames : STATIC_GAMES;
  const [search, setSearch] = useState('');
  const [game, setGame] = useState('Все');
  const [autoOnly, setAutoOnly] = useState(false);
  const [sort, setSort] = useState<Sort>('default');

  const filtered = useMemo(() => {
    const list = quests.filter(q => {
      if (game !== 'Все' && q.gameName !== game) return false;
      if (autoOnly && !q.brawlAutoVerify) return false;
      if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    if (sort === 'reward') list.sort((a, b) => b.rewardCoins - a.rewardCoins);
    if (sort === 'short') list.sort((a, b) => (a.durationDays || 999) - (b.durationDays || 999));
    return list;
  }, [quests, game, autoOnly, search, sort]);

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
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none" aria-hidden="true">🔍</span>
        <input
          type="text"
          placeholder="Поиск по названию квеста..."
          aria-label="Поиск по названию квеста"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="hm-search"
        />
      </div>

      {/* Фильтры */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="hm-filter-label">Игра</div>
          <div className="flex gap-2 flex-wrap">
            {['Все', ...games].map(g => (
              <button key={g} onClick={() => setGame(g)} className={`hm-pill${game === g ? ' on' : ''}`}>{g}</button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <div className="space-y-2">
            <div className="hm-filter-label">Проверка</div>
            <div className="flex gap-2">
              <button onClick={() => setAutoOnly(false)} className={`hm-pill${!autoOnly ? ' on' : ''}`}>Все</button>
              <button onClick={() => setAutoOnly(true)} className={`hm-pill${autoOnly ? ' on' : ''}`}>⚡ Автопроверка</button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="hm-filter-label">Сортировка</div>
            <div className="flex gap-2 flex-wrap">
              {SORTS.map(s => (
                <button key={s.id} onClick={() => setSort(s.id)} className={`hm-pill${sort === s.id ? ' on' : ''}`}>{s.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Счётчик */}
      <div className="hm-count"><span>{filtered.length} квестов</span></div>

      {/* Результаты */}
      {Object.entries(byGame).map(([g, list]) => (
        <section key={g} className="space-y-4">
          <div className="hm-subhead">
            <h2 className="font-heading">{g}</h2>
            <span>{list.length}</span>
          </div>
          <div className="hm-quests">
            {list.map(q => <QuestCard key={q.id} quest={q} />)}
          </div>
        </section>
      ))}

      {filtered.length === 0 && (
        <div className="hm-empty">
          <div className="text-4xl">🔍</div>
          <b>Ничего не найдено</b>
          <p>Попробуй изменить фильтры или поисковый запрос</p>
        </div>
      )}
    </div>
  );
}
