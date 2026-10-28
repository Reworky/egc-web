'use client';

import { useEffect, useState } from 'react';
import CountUp from '@/components/CountUp';

interface Feed {
  weekRub: number;
  weekCount: number;
  totalRub?: number;
  totalCount?: number;
}

/** Три цифры доверия под заголовком: игроки, выплаты, сумма выплат (публичный /api/payouts/feed). Пока лента грузится, место зарезервировано; без итогов за всё время берём неделю. */
export default function TrustStats({ players }: { players: number }) {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch('/api/payouts/feed')
      .then(r => (r.ok ? r.json() : null))
      .then((d: Feed | null) => (d ? setFeed(d) : setFailed(true)))
      .catch(() => setFailed(true));
  }, []);

  const total = !!feed?.totalRub;
  const count = feed ? (total ? feed.totalCount ?? 0 : feed.weekCount) : 0;
  const rub = feed ? (total ? feed.totalRub ?? 0 : feed.weekRub) : 0;
  const ready = !!feed && count > 0;

  return (
    <div className="pt-stats-wrap">
      <section className="hm-stats pt-stats reveal" aria-label="Клуб в цифрах">
        <div className="hm-stat"><div className="hm-stat-num"><CountUp value={players} /></div><div className="hm-stat-label">игроков в клубе</div></div>
        {ready && (
          <>
            <div className="hm-stat"><div className="hm-stat-num"><CountUp value={count} /></div><div className="hm-stat-label">{total ? 'выплат игрокам' : 'выплат за 7 дней'}</div></div>
            <div className="hm-stat"><div className="hm-stat-num gold"><CountUp value={rub} /> ₽</div><div className="hm-stat-label">{total ? 'выплачено за всё время' : 'выплачено за 7 дней'}</div></div>
          </>
        )}
        {!ready && !failed && (
          <>
            <div className="hm-stat hm-pay-skel" aria-hidden="true" />
            <div className="hm-stat hm-pay-skel" aria-hidden="true" />
          </>
        )}
      </section>
    </div>
  );
}
