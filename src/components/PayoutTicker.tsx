'use client';

import { useEffect, useState } from 'react';

interface FeedItem {
  rub: number;
  amountText?: string;
  method: string;
  minutesAgo: number;
  name: string;
}

const METHOD: Record<string, string> = { stars: 'Telegram Stars', ton: 'крипто', sbp: 'СБП' };

function ago(m: number): string {
  if (m < 0) return '';
  if (m < 1) return 'только что';
  if (m < 60) return `${m} мин назад`;
  if (m < 1440) return `${Math.floor(m / 60)} ч назад`;
  return `${Math.floor(m / 1440)} д назад`;
}

/** Бегущая строка последних выплат (данные публичного /api/payouts/feed: ники замаскированы). Если эндпоинт недоступен - блок не показывается. */
export default function PayoutTicker() {
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    fetch('/api/payouts/feed')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (d?.items?.length) setItems(d.items);
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;
  const row = items.map((it, i) => (
    <span key={i} className="hm-ticker-item">
      <b>{it.amountText ?? `${it.rub} ₽`}</b>
      <span>{METHOD[it.method] ?? it.method}</span>
      <em>{[ago(it.minutesAgo), it.name].filter(Boolean).join(' · ')}</em>
    </span>
  ));

  return (
    <div className="hm-ticker" aria-label="Последние выплаты игрокам">
      <span className="hm-live"><i />LIVE</span>
      <div className="hm-ticker-track">
        <div className="hm-ticker-row">{row}</div>
        <div className="hm-ticker-row" aria-hidden="true">{row}</div>
      </div>
    </div>
  );
}
