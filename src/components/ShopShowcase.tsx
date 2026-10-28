'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import GameBanner from '@/components/GameBanner';
import type { Cs2Case, RewardItem } from '@/lib/api';

const CASES_TAB = 'Кейсы CS2';
const UNIT: Record<string, string> = { Gems: 'гемов', UC: 'UC', 'G-Coin': 'G-Coin' };

/** «Brawl Stars - Gems 30» → «30 гемов», «PUBG Mobile - UC 60» → «60 UC», «Steam - Пополнение 100» → «Пополнение Steam 100». */
function packLabel(title: string): string {
  const tail = title.split(' - ')[1] ?? title;
  const m = tail.match(/^(\D+?)\s+(\d[\d\s]*)$/);
  if (!m) return tail;
  const unit = m[1].trim();
  const amount = m[2].trim();
  if (unit === 'Пополнение') return `Пополнение Steam ${amount}`;
  return `${amount} ${UNIT[unit] ?? unit}`;
}

/** Витрина магазина для гостя: вкладки по играм, под вкладкой обложка и наборы без цен; отдельная вкладка с кейсами CS2 (картинки, по нажатию состав). */
export default function ShopShowcase({ items, cases }: { items: RewardItem[]; cases: Cs2Case[] }) {
  const byGame = new Map<string, RewardItem[]>();
  for (const it of items) {
    if (!it.category || it.category === 'Кастомизация') continue;
    byGame.set(it.category, [...(byGame.get(it.category) ?? []), it]);
  }
  const tabs = [...byGame.keys(), ...(cases.length ? [CASES_TAB] : [])];
  const [tab, setTab] = useState(tabs[0] ?? '');
  const [open, setOpen] = useState<Cs2Case | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!tabs.length) return null;
  const current = tabs.includes(tab) ? tab : tabs[0];
  const packs = byGame.get(current) ?? [];

  return (
    <div className="sw">
      <div className="sw-tabs" role="tablist" aria-label="Игры магазина">
        {tabs.map(t => (
          <button key={t} type="button" role="tab" aria-selected={t === current} className={t === current ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {current === CASES_TAB ? (
        <div className="sw-cases">
          {cases.map(c => (
            <button key={c.key} type="button" className="sw-case" onClick={() => setOpen(c)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/cases/${c.key}.jpg`} alt="" loading="lazy" />
              <span>{c.name}</span>
              {c.itemId == null && <em>скоро</em>}
            </button>
          ))}
        </div>
      ) : (
        <div className="sw-panel">
          <div className="sw-cover"><GameBanner name={packs[0]?.category ?? current} /></div>
          <ul className="sw-packs">
            {packs.map(p => (
              <li key={p.id}>
                <span>{packLabel(p.title)}</span>
                {p.locked && <em>скоро</em>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {open && createPortal(
        <div className="sw-overlay" onClick={() => setOpen(null)}>
          <div className="sw-modal" role="dialog" aria-modal="true" aria-label={`Кейс ${open.name}`} onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/cases/${open.key}.jpg`} alt="" />
            <h3>Кейс «{open.name}»</h3>
            {open.skins.length > 0 && (
              <>
                <p>Что внутри ({open.skins.length}):</p>
                <ul>{open.skins.map(s => <li key={s}>{s}</li>)}</ul>
                <small>Редкие предметы (ножи, перчатки) в список не входят.</small>
              </>
            )}
            <button type="button" className="hm-btn hm-btn-ghost" onClick={() => setOpen(null)}>Закрыть</button>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
