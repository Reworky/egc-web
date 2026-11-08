'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { fetchPayoutsFeed } from '@/lib/payoutsFeed';

interface FeedItem { amountText?: string; rub: number; method: string; minutesAgo: number }
type Kind = 'sbp' | 'stars' | 'gems' | 'ton';
interface Variant { amount: string; note: string }

const TICK_MS = 2800;

/** Четыре способа получить деньги или награду: по одному уведомлению на способ, чтобы на картинке были видны все варианты вывода. */
const KINDS: { kind: Kind; label: string; tone: 'green' | 'gold' | 'cyan' | 'blue'; fallback: Variant[] }[] = [
  { kind: 'sbp', label: 'выплата по СБП', tone: 'green', fallback: [{ amount: '+106 ₽', note: 'на карту' }] },
  { kind: 'stars', label: 'вывод в Telegram Stars', tone: 'gold', fallback: [{ amount: '+50 ⭐', note: 'на аккаунт Telegram' }] },
  { kind: 'gems', label: 'гемы в игру из магазина', tone: 'cyan', fallback: [{ amount: '+30 гемов', note: 'за EXC' }, { amount: '+80 гемов', note: 'за EXC' }] },
  { kind: 'ton', label: 'вывод в GRAM (TON)', tone: 'blue', fallback: [{ amount: '+1.2 GRAM', note: 'на кошелёк' }] },
];

function ago(m: number): string {
  if (m < 1) return 'только что';
  if (m < 60) return `${m} мин назад`;
  if (m < 1440) return `${Math.floor(m / 60)} ч назад`;
  return `${Math.floor(m / 1440)} д назад`;
}

/** Варианты по способу: сначала настоящие суммы из публичной ленты выплат (без повторов), потом запасной пример, чтобы уведомление было всегда. */
function variantsFor(kind: Kind, feed: FeedItem[]): Variant[] {
  const spec = KINDS.find(k => k.kind === kind)!;
  const seen = new Set<string>();
  const real: Variant[] = [];
  for (const p of feed) {
    if (p.method !== kind) continue;
    const raw = (p.amountText ?? `${p.rub} ₽`).replace('~', '');
    if (seen.has(raw)) continue;
    seen.add(raw);
    real.push({ amount: `+${raw}`, note: ago(p.minutesAgo) });
  }
  const extra = spec.fallback.filter(f => !seen.has(f.amount.replace('+', '')));
  return [...real.slice(0, 3), ...extra].slice(0, 3);
}

function KindIcon({ kind }: { kind: Kind }) {
  const p = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  const icons: Record<Kind, ReactNode> = {
    sbp: <path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18" />,
    stars: <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" />,
    gems: <><path d="M6 4h12l3 5-9 11L3 9z" /><path d="M3 9h18" /></>,
    ton: <><path d="M12 3l8 4v6c0 4-3.4 6.6-8 8-4.6-1.4-8-4-8-8V7z" /><path d="M12 8v8M9 11l3-3 3 3" /></>,
  };
  return <svg {...p}>{icons[kind]}</svg>;
}

/** Арт первого экрана: Экси играет в телефон, вокруг по очереди вылетают четыре уведомления (СБП, звёзды, гемы, GRAM). Числа берутся из публичной ленты выплат, если способ в ней есть, иначе показывается пример. */
export default function HeroArt() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [tick, setTick] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchPayoutsFeed<{ items?: FeedItem[] }>()
      .then(d => { if (alive && d?.items?.length) setFeed(d.items); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStill(true); return; }
    const t = window.setInterval(() => setTick(v => v + 1), TICK_MS);
    return () => window.clearInterval(t);
  }, []);

  const n = KINDS.length;
  const slots = KINDS.map((spec, s) => {
    // тик, на котором этот слот обновлялся в последний раз: слоты обновляются по очереди, каждый раз с новой суммой
    const last = still ? s : Math.max(tick - ((((tick - s) % n) + n) % n), s);
    const variants = variantsFor(spec.kind, feed);
    const round = Math.floor(last / n);
    return { spec, v: variants[round % variants.length], key: `${s}-${last}` };
  });

  return (
    <figure className="hm-hero-art">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero-exi.webp" alt="Экси, маскот клуба EGC, играет в телефон на кресле-мешке" width={1300} height={1114} fetchPriority="high" />
      <div className="hn-layer" aria-hidden="true">
        {slots.map((s, i) => (
          <div key={s.key} className={`hn-chip hn-s${i} ${s.spec.tone}`}>
            <i className="hn-ic"><KindIcon kind={s.spec.kind} /></i>
            <b>{s.v.amount}</b>
            <span>{s.spec.label}<small>{s.v.note}</small></span>
          </div>
        ))}
      </div>
    </figure>
  );
}
