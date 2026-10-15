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
  reviewsUrl?: string;
}

const METHOD: Record<string, { icon: string; label: string }> = {
  sbp: { icon: '💳', label: 'СБП' },
  stars: { icon: '⭐', label: 'Telegram Stars' },
  ton: { icon: '💎', label: 'GRAM' },
};

function ago(m: number): string {
  if (m < 0) return '';
  if (m < 1) return 'только что';
  if (m < 60) return `${m} мин назад`;
  if (m < 1440) return `${Math.floor(m / 60)} ч назад`;
  return `${Math.floor(m / 1440)} д назад`;
}

const rub = (n: number) => `${n.toLocaleString('ru-RU')} ₽`;

/** Лента выплат карточками + итоги за сутки и неделю (публичный /api/payouts/feed: ники замаскированы). Если эндпоинт недоступен, блок скрывается. */
export default function PayoutFeed() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch('/api/payouts/feed')
      .then(r => (r.ok ? r.json() : null))
      .then((d: Feed | null) => {
        if (d?.items?.length) setFeed(d);
        else setFailed(true);
      })
      .catch(() => setFailed(true));
  }, []);

  if (failed) return null;

  return (
    <section className="hm-section reveal" aria-label="Последние выплаты игрокам">
      <div className="hm-head">
        <div>
          <div className="hm-kicker">Деньги — не обещание</div>
          <h2 className="section-title">Последние выплаты</h2>
        </div>
        <span className="hm-live"><i />LIVE</span>
      </div>

      <div className="hm-pay-totals">
        <div className="hm-pay-total">
          <b>{feed ? rub(feed.weekRub) : '…'}</b>
          <span>выплачено за 7 дней{feed ? ` · ${feed.weekCount} выплат` : ''}</span>
        </div>
        <div className="hm-pay-total">
          <b>{feed ? rub(feed.dayRub) : '…'}</b>
          <span>выплачено за 24 часа{feed ? ` · ${feed.dayCount} выплат` : ''}</span>
        </div>
      </div>

      <div className="hm-pay-grid">
        {feed
          ? feed.items.map((it, i) => {
              const m = METHOD[it.method] ?? { icon: '💸', label: it.method };
              return (
                <div key={i} className="hm-pay">
                  <div className="hm-pay-amount">{it.amountText ?? rub(it.rub)}</div>
                  <div className="hm-pay-method"><span>{m.icon}</span>{m.label}</div>
                  <div className="hm-pay-meta">
                    <span>{it.name}</span>
                    <em>{ago(it.minutesAgo)}</em>
                  </div>
                </div>
              );
            })
          : Array.from({ length: 8 }).map((_, i) => <div key={i} className="hm-pay hm-pay-skel" />)}
      </div>

      {feed?.reviewsUrl && (
        <a href={feed.reviewsUrl} target="_blank" rel="noopener noreferrer" className="hm-link hm-pay-more">
          Все выплаты и отзывы в Telegram →
        </a>
      )}
    </section>
  );
}
