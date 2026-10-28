'use client';

import { useState } from 'react';
import GameBanner from '@/components/GameBanner';
import type { Cs2Case, RewardItem } from '@/lib/api';

const UNIT: Record<string, string> = { Gems: 'Гемы', UC: 'UC', 'G-Coin': 'G-Coin', 'Пополнение': 'Пополнение Steam' };

interface Card {
  name: string;
  kinds: { label: string; soon: boolean }[];
}

/** Что есть в магазине по категории в общем виде: «Гемы», «UC», «Пополнение Steam», «Кейсы». Конкретные наборы и цены на сайте не показываем. */
function buildCards(items: RewardItem[], cases: Cs2Case[]): Card[] {
  const map = new Map<string, Map<string, boolean>>();
  for (const it of items) {
    if (!it.category || it.category === 'Кастомизация') continue;
    const kinds = map.get(it.category) ?? new Map<string, boolean>();
    const unit = it.title.split(' - ')[1]?.split(' ')[0];
    const label = unit ? (UNIT[unit] ?? unit) : 'Награды';
    kinds.set(label, (kinds.get(label) ?? true) && !!it.locked);
    map.set(it.category, kinds);
  }
  if (cases.length) {
    const kinds = map.get('CS2') ?? new Map<string, boolean>();
    kinds.set('Кейсы', false);
    map.set('CS2', kinds);
  }
  return [...map.entries()].map(([name, kinds]) => ({
    name,
    kinds: [...kinds.entries()].map(([label, soon]) => ({ label, soon })),
  }));
}

/** Витрина магазина для гостя: карточки игр общим списком. При наведении (на телефоне по нажатию) на карточке раскрывается, что доступно в этой категории. */
export default function ShopShowcase({ items, cases }: { items: RewardItem[]; cases: Cs2Case[] }) {
  const cards = buildCards(items, cases);
  const [pinned, setPinned] = useState<string | null>(null);
  if (!cards.length) return null;

  return (
    <div className="gm-grid sw-grid">
      {cards.map(c => (
        <div
          key={c.name}
          role="button"
          tabIndex={0}
          className={`sw-card${pinned === c.name ? ' open' : ''}`}
          aria-expanded={pinned === c.name}
          onClick={() => setPinned(p => (p === c.name ? null : c.name))}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPinned(p => (p === c.name ? null : c.name)); } }}
          onBlur={() => setPinned(p => (p === c.name ? null : p))}
        >
          <GameBanner name={c.name} />
          <span className="sw-over">
            <b>{c.name}</b>
            <span className="sw-kinds">
              {c.kinds.map(k => (
                <span key={k.label}>{k.label}{k.soon && <em>скоро</em>}</span>
              ))}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
