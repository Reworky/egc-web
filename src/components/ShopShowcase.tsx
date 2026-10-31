'use client';

import { useState } from 'react';
import GameBanner from '@/components/GameBanner';
import type { Cs2Case, RewardItem } from '@/lib/api';

const UNIT: Record<string, string> = { Gems: 'Гемы', UC: 'UC', 'G-Coin': 'G-Coin', 'Пополнение': 'Пополнение Steam' };

/** Баннеры товаров для раскрытия карточки: ключ «категория|вид». Нет файла - вид показывается плиткой с названием.
 *  У игр с двумя товарами плитки стоят рядом и выходят почти квадратными, поэтому их картинки 1:1 (1080×1080); одиночные (PUBG) - 16:9. ?v= - сброс кэша при замене файла. */
const BANNERS: Record<string, string> = {
  'Brawl Stars|Гемы': '/shop/brawl-gems.jpg?v=2',
  'Clash of Clans|Гемы': '/shop/coc-gems.jpg?v=2',
  'Clash Royale|Гемы': '/shop/cr-gems.jpg?v=2',
  'PUBG PC|G-Coin': '/shop/pubg-pc-gcoin.jpg',
  'PUBG Mobile|UC': '/shop/pubg-mobile-uc.jpg',
  'CS2|Пополнение Steam': '/shop/steam-balance.jpg?v=2',
  'CS2|Кейсы': '/shop/cs2-cases.jpg?v=2',
  'Brawl Stars|Brawl Pass': '/shop/brawl-pass.jpg?v=2',
  'Clash Royale|Пропуски': '/shop/cr-pass.jpg?v=2',
  'Clash of Clans|Gold Pass': '/shop/coc-gold.jpg?v=2',
};

/** Что продаётся в боте сверх позиций из публичного списка наград (пропуски приходят не оттуда). */
const EXTRA_KINDS: Record<string, string[]> = {
  'Brawl Stars': ['Brawl Pass'],
  'Clash Royale': ['Пропуски'],
  'Clash of Clans': ['Gold Pass'],
};

/** Порядок карточек на витрине (три в ряд): сначала мобильные игры Supercell, ниже PUBG PC, CS2, PUBG Mobile. Категории вне списка идут после. */
const CARD_ORDER = ['Brawl Stars', 'Clash Royale', 'Clash of Clans', 'PUBG PC', 'CS2', 'PUBG Mobile'];

interface Card {
  name: string;
  kinds: { label: string; soon: boolean; img?: string }[];
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
  for (const [name, extra] of Object.entries(EXTRA_KINDS)) {
    const kinds = map.get(name);
    if (!kinds) continue;
    for (const label of extra) if (!kinds.has(label)) kinds.set(label, false);
  }
  const rank = (name: string) => { const i = CARD_ORDER.indexOf(name); return i < 0 ? CARD_ORDER.length : i; };
  return [...map.entries()]
    .sort(([a], [b]) => rank(a) - rank(b))
    .map(([name, kinds]) => ({
      name,
      kinds: [...kinds.entries()].map(([label, soon]) => ({ label, soon, img: BANNERS[`${name}|${label}`] })),
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
          <span className={`sw-over n${c.kinds.length}`} aria-label={c.kinds.map(k => k.label).join(', ')}>
            {c.kinds.map(k => (
              <span key={k.label} className="sw-tile">
                {k.img
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={k.img} alt="" loading="lazy" />
                  : <b>{c.name}</b>}
                <i>{k.label}{k.soon && <em>скоро</em>}</i>
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
