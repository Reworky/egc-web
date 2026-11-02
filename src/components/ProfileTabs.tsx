'use client';

import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { api, Submission, RewardRequest, ReferralFriend } from '@/lib/api';

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  APPROVED:  { label: 'Выполнено',   color: '#22c55e' },
  PENDING:   { label: 'На проверке', color: '#f59e0b' },
  REJECTED:  { label: 'Отклонено',   color: '#ef4444' },
  DRAFT:     { label: 'Черновик',    color: '#94a3b8' },
  NEEDS_INFO:{ label: 'Нужна инфо',  color: '#a855f7' },
  CANCELLED: { label: 'Отменено',    color: '#64748b' },
  DELIVERED: { label: 'Выдано',      color: '#22c55e' },
};

const PAGE_SIZE = 10;

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABEL[status] ?? { label: status, color: '#94a3b8' };
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
      style={{ background: s.color + '22', color: s.color }}>
      {s.label}
    </span>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}

/** «dd.MM.yyyy HH:mm» → «7 дней назад» (полная дата в подсказке). */
function RelDate({ value }: { value: string | null }) {
  if (!value) return <span>—</span>;
  const m = value.match(/^(\d{2})\.(\d{2})\.(\d{4})(?: (\d{2}):(\d{2}))?/);
  if (!m) return <span>{value}</span>;
  const d = new Date(+m[3], +m[2] - 1, +m[1], +(m[4] ?? 0), +(m[5] ?? 0));
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  const text = days <= 0 ? 'Сегодня' : days === 1 ? 'Вчера' : `${days} ${plural(days, 'день', 'дня', 'дней')} назад`;
  return <span title={value}>{text}</span>;
}

type Col = { title: string; width: string };

/** Таблица как в референсе: шапка + строки, на телефоне строки превращаются в карточки. */
function DataTable<T>({ cols, rows, render, empty }: {
  cols: Col[];
  rows: T[] | null;
  render: (row: T) => ReactNode[];
  empty: string;
}) {
  // Страница хранится вместе со списком, к которому относится: сменился список (вкладка, фильтр) - снова первая.
  const [pageState, setPageState] = useState<{ rows: T[] | null; page: number }>({ rows, page: 1 });
  const page = pageState.rows === rows ? pageState.page : 1;
  const setPage = (n: number) => setPageState({ rows, page: n });

  if (!rows) return <div className="py-10 text-center" style={{ color: 'var(--muted)' }}>Загрузка...</div>;
  if (!rows.length) return <div className="py-10 text-center" style={{ color: 'var(--muted)' }}>{empty}</div>;

  const pages = Math.ceil(rows.length / PAGE_SIZE);
  const slice = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const template = cols.map(c => c.width).join(' ');

  return (
    <div>
      <div className="hidden md:grid gap-4 px-4 py-3 text-xs font-bold uppercase tracking-wide"
        style={{ gridTemplateColumns: template, color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
        {cols.map(c => <div key={c.title}>{c.title}</div>)}
      </div>
      {slice.map((row, i) => (
        <div key={i}
          className="grid gap-x-4 gap-y-1 px-4 py-3.5 items-center text-sm md:[grid-template-columns:var(--cols)]"
          style={{ ['--cols' as string]: template, borderBottom: '1px solid var(--border)' }}>
          {render(row).map((cell, j) => (
            <div key={j} className={j === 0 ? 'min-w-0' : 'min-w-0 text-[13px] md:text-sm'} style={j === 0 ? undefined : { color: 'var(--muted)' }}>
              {j > 0 && <span className="md:hidden">{cols[j].title}: </span>}
              {cell}
            </div>
          ))}
        </div>
      ))}
      {pages > 1 && (
        <div className="flex justify-center gap-2 pt-5">
          {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)}
              className={`hm-pill${n === page ? ' on' : ''}`} style={{ padding: '6px 14px' }}>
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none text-sm font-semibold text-white">
      {label}
      <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)}
        className="relative shrink-0 rounded-full transition-colors"
        style={{ width: 44, height: 24, background: on ? 'var(--accent)' : 'var(--bg3)', border: '1px solid var(--border)' }}>
        <span className="absolute top-[2px] rounded-full bg-white transition-all"
          style={{ width: 18, height: 18, left: on ? 22 : 2 }} />
      </button>
    </label>
  );
}

const MAIN_TABS = [
  { id: 'earnings', label: 'Заработок' },
  { id: 'started', label: 'Начатые квесты' },
] as const;

const SUB_TABS = [
  { id: 'quests', label: 'Квесты' },
  { id: 'rewards', label: 'Награды' },
  { id: 'referrals', label: 'Рефералы' },
] as const;

type MainTab = typeof MAIN_TABS[number]['id'];
type SubTab = typeof SUB_TABS[number]['id'];

const STARTED = new Set(['DRAFT', 'NEEDS_INFO', 'PENDING']);

export default function ProfileTabs() {
  const [main, setMain] = useState<MainTab>('earnings');
  const [sub, setSub] = useState<SubTab>('quests');
  const [pendingOnly, setPendingOnly] = useState(false);
  const [filter, setFilter] = useState('');

  const [subs, setSubs] = useState<Submission[] | null>(null);
  const [rewards, setRewards] = useState<RewardRequest[] | null>(null);
  const [friends, setFriends] = useState<ReferralFriend[] | null>(null);

  useEffect(() => {
    api.submissions().then(setSubs).catch(() => setSubs([]));
    api.rewards().then(setRewards).catch(() => setRewards([]));
    api.referralFriends().then(setFriends).catch(() => setFriends([]));
  }, []);

  const questRows = useMemo(() => {
    if (!subs) return null;
    let r = main === 'started'
      ? subs.filter(s => STARTED.has(s.status))
      : subs.filter(s => s.status !== 'DRAFT');
    if (pendingOnly) r = r.filter(s => s.status === 'PENDING');
    if (filter) r = r.filter(s => s.gameName === filter);
    return r;
  }, [subs, main, pendingOnly, filter]);

  const rewardRows = useMemo(() => {
    if (!rewards) return null;
    let r = rewards;
    if (pendingOnly) r = r.filter(x => x.status === 'PENDING');
    if (filter) r = r.filter(x => x.category === filter);
    return r;
  }, [rewards, pendingOnly, filter]);

  const filterOptions = useMemo(() => {
    if (main === 'started' || sub === 'quests') return Array.from(new Set((subs ?? []).map(s => s.gameName))).sort();
    if (sub === 'rewards') return Array.from(new Set((rewards ?? []).map(r => r.category))).sort();
    return [];
  }, [subs, rewards, main, sub]);

  const showQuests = main === 'started' || sub === 'quests';

  return (
    <div className="space-y-5">
      {/* Основные вкладки */}
      <div className="inline-flex gap-1 p-1.5 rounded-2xl" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
        {MAIN_TABS.map(t => (
          <button key={t.id} onClick={() => { setMain(t.id); setFilter(''); }}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
            style={main === t.id
              ? { background: 'var(--bg3)', color: 'var(--accent2)' }
              : { color: '#fff' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Подвкладки и фильтры */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {main === 'earnings' ? (
          <div className="flex gap-2 flex-wrap">
            {SUB_TABS.map(t => (
              <button key={t.id} onClick={() => { setSub(t.id); setFilter(''); }} className={`hm-pill${sub === t.id ? ' on' : ''}`}>
                {t.label}
              </button>
            ))}
          </div>
        ) : <div />}
        {(showQuests || sub === 'rewards') && (
          <div className="flex flex-wrap items-center gap-4">
            {main === 'earnings' && <Toggle on={pendingOnly} onChange={setPendingOnly} label="Только на проверке" />}
            <select value={filter} onChange={e => setFilter(e.target.value)}
              className="rounded-xl px-4 py-2.5 text-sm"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
              <option value="">{showQuests ? 'Все игры' : 'Все категории'}</option>
              {filterOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="hm-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {showQuests && (
          <DataTable<Submission>
            cols={[
              { title: 'Квест', width: 'minmax(0,2.2fr)' },
              { title: 'Награда', width: 'minmax(0,1.2fr)' },
              { title: 'Статус', width: 'minmax(0,1fr)' },
              { title: 'Игра', width: 'minmax(0,1.2fr)' },
              { title: 'Дата', width: 'minmax(0,1fr)' },
            ]}
            rows={questRows}
            empty={main === 'started' ? 'Начатых квестов нет' : 'Квестов ещё не было'}
            render={s => [
              <div key="t">
                <p className="font-medium text-white">{s.questTitle}</p>
                {s.moderatorComment && (
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Модератор: {s.moderatorComment}</p>
                )}
              </div>,
              s.status === 'APPROVED'
                ? <span key="r"><span className="text-yellow-400 font-semibold">+{s.rewardCoins.toLocaleString('ru')} EXC</span> <span className="text-purple-400">+{s.rewardXp} XP</span></span>
                : <span key="r">{s.rewardCoins.toLocaleString('ru')} EXC</span>,
              <StatusBadge key="s" status={s.status} />,
              <span key="g">{s.gameName}</span>,
              <RelDate key="d" value={s.createdAt} />,
            ]}
          />
        )}

        {!showQuests && sub === 'rewards' && (
          <DataTable<RewardRequest>
            cols={[
              { title: 'Награда', width: 'minmax(0,2.2fr)' },
              { title: 'Цена', width: 'minmax(0,1.2fr)' },
              { title: 'Статус', width: 'minmax(0,1fr)' },
              { title: 'Категория', width: 'minmax(0,1.2fr)' },
              { title: 'Дата', width: 'minmax(0,1fr)' },
            ]}
            rows={rewardRows}
            empty="Заявок на награды ещё не было"
            render={r => [
              <div key="t">
                <p className="font-medium text-white">{r.rewardTitle}</p>
                {r.adminComment && (
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Администратор: {r.adminComment}</p>
                )}
              </div>,
              <span key="p" className="text-yellow-400 font-semibold">{r.priceCoins.toLocaleString('ru')} EXC</span>,
              <StatusBadge key="s" status={r.status} />,
              <span key="c">{r.category}</span>,
              <RelDate key="d" value={r.createdAt} />,
            ]}
          />
        )}

        {!showQuests && sub === 'referrals' && (
          <DataTable<ReferralFriend>
            cols={[
              { title: 'Друг', width: 'minmax(0,2.2fr)' },
              { title: 'Квестов выполнено', width: 'minmax(0,1.6fr)' },
              { title: 'Вступил', width: 'minmax(0,1.2fr)' },
            ]}
            rows={friends}
            empty="Ты пока никого не приглашал"
            render={f => [
              <p key="n" className="font-medium text-white">{f.nickname}</p>,
              <span key="q">{f.completedQuests}</span>,
              <RelDate key="d" value={f.joinedAt} />,
            ]}
          />
        )}
      </div>
    </div>
  );
}
