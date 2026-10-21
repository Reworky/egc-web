'use client';

import { useEffect, useState } from 'react';

interface Review {
  stars: number;
  text: string;
  name: string;
}

/** Отзывы игроков из бота (публичный /api/public/reviews: только опубликованные в канале выплат, ники замаскированы). Нет отзывов или эндпоинт недоступен: блок скрывается. */
export default function Reviews() {
  const [items, setItems] = useState<Review[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch('/api/public/reviews')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (d?.items?.length) setItems(d.items);
        else setFailed(true);
      })
      .catch(() => setFailed(true));
  }, []);

  if (failed) return null;

  return (
    <section className="hm-section reveal" aria-label="Отзывы игроков">
      <div className="hm-head">
        <div>
          <div className="hm-kicker">Говорят игроки</div>
          <h2 className="section-title">Отзывы</h2>
        </div>
      </div>
      <div className="hm-reviews">
        {items
          ? items.map((r, i) => (
              <figure key={i} className="hm-review">
                <div className="hm-review-stars" aria-label={`Оценка ${r.stars} из 5`}>{'★'.repeat(r.stars)}</div>
                <blockquote>{r.text}</blockquote>
                <figcaption>{r.name}</figcaption>
              </figure>
            ))
          : Array.from({ length: 3 }).map((_, i) => <div key={i} className="hm-review hm-pay-skel" />)}
      </div>
    </section>
  );
}
