'use client';

import { useEffect, useState } from 'react';

interface FeedItem {
  rub: number;
  amountText?: string;
  method: string;
  minutesAgo: number;
  name: string;
}

interface Feed {
  items: FeedItem[];
  dayRub: number;
  dayCount: number;
  weekRub: number;
  weekCount: number;
  totalRub?: number;
  totalCount?: number;
  reviewsUrl?: string;
}

type Kind = 'bank' | 'star' | 'gem' | 'gift';

const METHOD: Record<string, { label: string; filter: string; kind: Kind; tone: string }> = {
  sbp: { label: 'СБП', filter: 'Рубли', kind: 'bank', tone: 'green' },
  stars: { label: 'Telegram Stars', filter: 'Stars', kind: 'star', tone: 'gold' },
  ton: { label: 'GRAM (TON)', filter: 'GRAM', kind: 'gem', tone: 'blue' },
  reward: { label: 'Награда магазина', filter: 'Награды', kind: 'gift', tone: 'violet' },
};

const PAGE = 6;
const REFRESH_MS = 60_000;

function ago(m: number): string {
  if (m < 0) return '';
  if (m < 1) return 'только что';
  if (m < 60) return `${m} мин назад`;
  if (m < 1440) return `${Math.floor(m / 60)} ч назад`;
  return `${Math.floor(m / 1440)} д назад`;
}

const rub = (n: number) => `${n.toLocaleString('ru-RU')} ₽`;

function Icon({ kind }: { kind: Kind }) {
  const p = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  if (kind === 'star') return <svg {...p}><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" /></svg>;
  if (kind === 'gem') return <svg {...p}><path d="M6 4h12l3 5-9 11L3 9z" /><path d="M3 9h18" /></svg>;
  if (kind === 'gift') return <svg {...p}><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13M3 13h18M8 8a2.5 2.5 0 110-5c2 0 4 2.5 4 5M16 8a2.5 2.5 0 100-5c-2 0-4 2.5-4 5" /></svg>;
  return <svg {...p}><path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18" /></svg>;
}

/** Лента выплат списком: итоги, фильтр по способу, строки с иконкой, суммой, ником и временем (публичный /api/payouts/feed, ники замаскированы). Обновляется раз в минуту. Если эндпоинт недоступен, блок скрывается. */
export default function PayoutFeed() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState('all');
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch('/api/payouts/feed')
        .then(r => (r.ok ? r.json() : null))
        .then((d: Feed | null) => {
          if (!alive) return;
          if (d?.items?.length) setFeed(d);
          else if (!feed) setFailed(true);
        })
        .catch(() => { if (alive && !feed) setFailed(true); });
    load();
    const t = setInterval(load, REFRESH_MS);
    return () => { alive = false; clearInterval(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed) return null;

  const methods = feed ? Array.from(new Set(feed.items.map(i => i.method))).filter(m => METHOD[m]) : [];
  const visible = feed ? feed.items.filter(i => filter === 'all' || i.method === filter) : [];
  const rows = visible.slice(0, shown);
  const newestId = feed && feed.items[0] && feed.items[0].minutesAgo <= 30 ? feed.items[0] : null;

  return (
    <section className="hm-section reveal pf" aria-label="Последние выплаты игрокам">
      <div className="hm-head">
        <div>
          <div className="hm-kicker">Деньги — не обещание</div>
          <h2 className="section-title">Последние выплаты</h2>
        </div>
        <span className="hm-live"><i />LIVE</span>
      </div>

      <div className="pf-tot">
        {(!feed || feed.totalRub) ? (
          <div className="gold">
            <b>{feed?.totalRub ? rub(feed.totalRub) : '…'}</b>
            <span>за всё время{feed?.totalCount ? ` · ${feed.totalCount.toLocaleString('ru-RU')} выплат` : ''}</span>
          </div>
        ) : null}
        <div>
          <b>{feed ? rub(feed.weekRub) : '…'}</b>
          <span>за 7 дней{feed ? ` · ${feed.weekCount} выплат` : ''}</span>
        </div>
        <div>
          <b>{feed ? rub(feed.dayRub) : '…'}</b>
          <span>за 24 часа{feed ? ` · ${feed.dayCount} выплат` : ''}</span>
        </div>
      </div>

      {methods.length > 1 && (
        <div className="pf-chips" role="group" aria-label="Способ выплаты">
          <button type="button" className={filter === 'all' ? 'on' : ''} onClick={() => { setFilter('all'); setShown(PAGE); }}>Все</button>
          {methods.map(m => (
            <button key={m} type="button" className={filter === m ? 'on' : ''} onClick={() => { setFilter(m); setShown(PAGE); }}>{METHOD[m].filter}</button>
          ))}
        </div>
      )}

      <div className="pf-list">
        {feed
          ? rows.map((it, i) => {
              const m = METHOD[it.method] ?? { label: it.method, filter: it.method, kind: 'bank' as Kind, tone: 'violet' };
              const isNew = newestId === it;
              return (
                <div key={`${it.name}-${it.minutesAgo}-${i}`} className={`pf-row${isNew ? ' fresh' : ''}`}>
                  <span className={`pf-ic ${m.tone}`}><Icon kind={m.kind} /></span>
                  <span className="pf-amt">{it.amountText ?? rub(it.rub)}</span>
                  <span className="pf-who">{m.label}<small>{it.name}</small></span>
                  <span className="pf-ago">{ago(it.minutesAgo)}{isNew && <em>новая</em>}</span>
                </div>
              );
            })
          : Array.from({ length: PAGE }).map((_, i) => <div key={i} className="pf-row hm-pay-skel" />)}
      </div>

      {feed && visible.length > shown && (
        <button type="button" className="pf-more" onClick={() => setShown(s => s + PAGE)}>Показать ещё</button>
      )}

      {feed?.reviewsUrl && (
        <a href={feed.reviewsUrl} target="_blank" rel="noopener noreferrer" className="hm-link hm-pay-more">
          Все выплаты и отзывы в Telegram →
        </a>
      )}
    </section>
  );
}
