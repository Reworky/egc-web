'use client';

import { useEffect, useState } from 'react';

interface FeedItem { amountText?: string; rub: number; method: string; minutesAgo: number }
interface Notice { id: string; amount: string; label: string; note: string; tone: 'green' | 'gold' | 'cyan' }

const WELCOME_BONUS_EXC = 200; // те же числа, что в боте (WELCOME_BONUS_EXC)
const SLOTS = 3;
const TICK_MS = 2800;

const METHOD_LABEL: Record<string, string> = { sbp: 'выплата по СБП', stars: 'выплата Telegram Stars', ton: 'выплата GRAM', reward: 'награда магазина' };

function ago(m: number): string {
  if (m < 1) return 'только что';
  if (m < 60) return `${m} мин назад`;
  if (m < 1440) return `${Math.floor(m / 60)} ч назад`;
  return `${Math.floor(m / 1440)} д назад`;
}

/** Настоящие выплаты из публичной ленты и пополнения баланса EXC (типичная награда за квест и стартовый подарок), вперемешку. */
function buildNotices(feed: FeedItem[], reward: number): Notice[] {
  const credits: Notice[] = [];
  if (reward > 0) credits.push({ id: 'quest', amount: `+${reward.toLocaleString('ru')} EXC`, label: 'награда за квест', note: 'зачислено на баланс', tone: 'gold' });
  credits.push({ id: 'welcome', amount: `+${WELCOME_BONUS_EXC} EXC`, label: 'подарок за вход', note: 'на старте клуба', tone: 'cyan' });
  // одинаковые суммы по одному способу подряд не повторяем: уведомления должны выглядеть разными
  const seen = new Set<string>();
  const unique = feed.filter(p => { const k = `${p.method}:${p.amountText ?? p.rub}`; if (seen.has(k)) return false; seen.add(k); return true; });
  const payouts: Notice[] = unique.slice(0, 4).map((p, i) => ({
    id: `p${i}`,
    amount: `${p.amountText?.startsWith('~') ? '' : '+'}${p.amountText ?? `${p.rub} ₽`}`,
    label: METHOD_LABEL[p.method] ?? 'выплата',
    note: ago(p.minutesAgo),
    tone: 'green' as const,
  }));
  const out: Notice[] = [];
  for (let i = 0; i < Math.max(credits.length, payouts.length); i++) {
    if (credits[i]) out.push(credits[i]);
    if (payouts[i]) out.push(payouts[i]);
  }
  return out;
}

/** Арт первого экрана: Экси с телефоном и вылетающие уведомления о пополнениях и выплатах. Уведомления берут числа из публичной ленты выплат; если лента недоступна, остаются только пополнения EXC. */
export default function HeroArt({ reward = 0 }: { reward?: number }) {
  const [notices, setNotices] = useState<Notice[]>(() => buildNotices([], reward));
  const [tick, setTick] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/api/payouts/feed')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (alive && d?.items?.length) setNotices(buildNotices(d.items, reward)); })
      .catch(() => {});
    return () => { alive = false; };
  }, [reward]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStill(true); return; }
    const t = window.setInterval(() => setTick(v => v + 1), TICK_MS);
    return () => window.clearInterval(t);
  }, []);

  // В слоте A, B, C по очереди появляется следующее уведомление, поэтому на экране всегда три разных
  const slots = Array.from({ length: SLOTS }, (_, s) => {
    // последний тик, на котором этот слот получил уведомление (слоты 1 и 2 в начале берут тики 1 и 2)
    const last = still ? s : Math.max(tick - ((((tick - s) % SLOTS) + SLOTS) % SLOTS), s);
    return { notice: notices[last % notices.length], key: `${s}-${last}` };
  });

  return (
    <figure className="hm-hero-art">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero-exi.jpg" alt="Экси, маскот клуба EGC, играет в телефон на кресле-мешке" width={1300} height={1063} fetchPriority="high" />
      <div className="hn-layer" aria-hidden="true">
        {slots.map((s, i) => s.notice && (
          <div key={s.key} className={`hn-chip hn-s${i} ${s.notice.tone}`}>
            <b>{s.notice.amount}</b>
            <span>{s.notice.label}<small>{s.notice.note}</small></span>
          </div>
        ))}
      </div>
    </figure>
  );
}
