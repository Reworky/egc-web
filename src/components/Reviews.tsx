'use client';

import { useEffect, useState } from 'react';

interface Review {
  stars: number;
  text: string;
  name: string;
  /** ISO yyyy-MM-dd; у ответа старой версии бэкенда может отсутствовать. */
  date?: string;
}

/** Сколько отзывов видно до «Показать все»: при меньшем числе блок не сворачивается. */
const COLLAPSED_FROM = 7;

const AVATAR_TONES = [
  { bg: 'rgba(124,58,237,.28)', fg: '#c4b5fd' },
  { bg: 'rgba(236,72,153,.24)', fg: '#f9a8d4' },
  { bg: 'rgba(34,211,238,.2)', fg: '#67e8f9' },
  { bg: 'rgba(34,197,94,.2)', fg: '#86efac' },
  { bg: 'rgba(251,191,36,.2)', fg: '#fcd34d' },
];

function tone(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)!) % 997;
  return AVATAR_TONES[h % AVATAR_TONES.length];
}

function formatDate(iso?: string): string {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return '';
  return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/\s?г\.$/, '');
}

/** Отзывы игроков из бота (публичный /api/public/reviews: только опубликованные в канале выплат, ники замаскированы).
 *  Три колонки «кирпичиком», внизу затухание и «Показать все». Нет отзывов или эндпоинт недоступен: блок скрывается. */
export default function Reviews({ channelUrl }: { channelUrl: string }) {
  const [items, setItems] = useState<Review[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);

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

  const collapsible = !!items && items.length >= COLLAPSED_FROM;
  const folded = collapsible && !expanded;

  return (
    <section className="hm-section reveal" aria-label="Отзывы игроков">
      <div className="hm-head">
        <div>
          <div className="hm-kicker">Говорят игроки</div>
          <h2 className="section-title">Отзывы</h2>
        </div>
        <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="hm-link">Все отзывы в Telegram →</a>
      </div>

      {items ? (
        <>
          <div className={`rv-wrap${folded ? ' folded' : ''}`}>
            <div className="rv-grid">
              {items.map((r, i) => {
                const t = tone(r.name);
                const date = formatDate(r.date);
                return (
                  <figure key={i} className="hm-review rv-card">
                    <div className="rv-top">
                      <span className="rv-avatar" style={{ background: t.bg, color: t.fg }} aria-hidden="true">
                        {Array.from(r.name)[0]?.toUpperCase() ?? '•'}
                      </span>
                      <div className="rv-who">
                        <b>{r.name}</b>
                        <span><i className="rv-src">Telegram{date ? ' · ' : ''}</i>{date}</span>
                      </div>
                      <div className="hm-review-stars" aria-label={`Оценка ${r.stars} из 5`}>{'★'.repeat(r.stars)}</div>
                    </div>
                    <blockquote>{r.text}</blockquote>
                  </figure>
                );
              })}
            </div>
          </div>
          {collapsible && (
            <div className="rv-more">
              <button type="button" className="hm-btn hm-btn-ghost" onClick={() => setExpanded(e => !e)} aria-expanded={expanded}>
                {expanded ? 'Свернуть отзывы' : `Показать все отзывы (${items.length})`}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rv-grid">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="hm-review rv-card hm-pay-skel" style={{ minHeight: 140 }} />)}
        </div>
      )}
    </section>
  );
}
