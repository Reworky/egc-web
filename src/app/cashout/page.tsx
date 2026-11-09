'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { api, Wallet, Withdrawal, StarsItem, TonQuote } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import { DataTable, RelDate, StatusBadge } from '@/components/ProfileTabs';
import GuestCashout from '@/components/GuestCashout';

const MIN_WITHDRAWAL = 5000;

type Method = 'rub' | 'stars' | 'ton';

const METHODS: Record<Method, { title: string; hint: string; img: string; imgBg: string }> = {
  rub:   { title: 'Рубли (СБП)',     hint: 'Любой банк, по номеру телефона', img: '/cashout/sbp.png',   imgBg: '#ffffff' },
  stars: { title: 'Telegram Stars',  hint: 'Отправим по юзернейму',          img: '/cashout/stars.png', imgBg: '#7c4dff' },
  ton:   { title: 'GRAM (TON)',      hint: 'На адрес кошелька TON',          img: '/cashout/ton.png',   imgBg: '#ffffff' },
};

const WITHDRAW_LABELS = { APPROVED: 'Выплачено' };

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}

function Notice({ ok, children }: { ok: boolean; children: ReactNode }) {
  const c = ok ? '#22c55e' : '#ef4444';
  return (
    <div className="text-sm rounded-xl px-4 py-3" style={{ background: c + '1f', border: `1px solid ${c}55`, color: c }}>
      {children}
    </div>
  );
}

/** Карточка способа: картинка, название и полоса «баланс / минимум» как в референсе. */
function MethodCard({ method, wallet, enabled, onOpen }: {
  method: Method; wallet: Wallet; enabled: boolean; onOpen: () => void;
}) {
  const m = METHODS[method];
  const pct = Math.min(100, Math.round((wallet.coins * 100) / MIN_WITHDRAWAL));
  return (
    <button type="button" onClick={onOpen}
      className="text-left rounded-2xl p-4 transition-transform hover:-translate-y-1"
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)', opacity: enabled ? 1 : 0.6, width: '100%' }}>
      <div className="text-center font-bold text-white mb-3">{m.title}</div>
      <div className="flex items-center justify-center rounded-xl overflow-hidden" style={{ height: 130, background: m.imgBg }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.img} alt={m.title} style={{ maxHeight: method === 'rub' ? 80 : 90, maxWidth: '70%', objectFit: 'contain' }} />
      </div>
      <div className="text-xs mt-3 text-center" style={{ color: 'var(--muted)' }}>{m.hint}</div>
      <div className="hm-xp mt-3"><i style={{ width: `${Math.max(pct, 4)}%` }} /></div>
      <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--muted)' }}>
        <span>Минимум</span>
        <span>{Math.min(wallet.coins, MIN_WITHDRAWAL).toLocaleString('ru')} / {MIN_WITHDRAWAL.toLocaleString('ru')} EXC</span>
      </div>
    </button>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      className="w-full rounded-xl px-4 py-3 text-sm text-white"
      style={{ background: 'var(--bg3)', border: '1px solid var(--border)', outline: 'none' }} />
  );
}

function WithdrawForm({ method, wallet, onDone }: { method: Method; wallet: Wallet; onDone: () => void }) {
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [items, setItems] = useState<StarsItem[] | null>(null);
  const [itemId, setItemId] = useState<number | null>(null);
  const [quote, setQuote] = useState<TonQuote | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const available = Math.min(wallet.coins, wallet.remainingWithdrawalLimit);
  const amt = parseInt(amount, 10) || 0;
  const rubApprox = Math.round((amt * wallet.healthRatioPercent) / 10000);

  useEffect(() => {
    if (method !== 'stars') return;
    api.starsItems().then(setItems).catch(() => setItems([]));
  }, [method]);

  // Расчёт в GRAM: запрос с задержкой, чтобы не дёргать API на каждую цифру.
  useEffect(() => {
    if (method !== 'ton' || amt < 1) return;
    const t = setTimeout(() => { api.tonQuote(amt).then(setQuote).catch(() => setQuote(null)); }, 400);
    return () => clearTimeout(t);
  }, [method, amt]);

  async function submit() {
    setResult(null);
    setBusy(true);
    try {
      let res;
      if (method === 'rub') {
        if (!amt) { setResult({ ok: false, text: 'Введите сумму числом.' }); return; }
        res = await api.withdrawRub(amt, details);
      } else if (method === 'ton') {
        if (!amt) { setResult({ ok: false, text: 'Введите сумму числом.' }); return; }
        res = await api.withdrawTon(amt, details);
      } else {
        if (!itemId) { setResult({ ok: false, text: 'Выберите номинал.' }); return; }
        if (!details.trim()) { setResult({ ok: false, text: 'Введите юзернейм получателя.' }); return; }
        res = await api.withdrawStars(itemId, details.trim().replace(/^@/, ''));
      }
      setResult({ ok: res.success, text: res.message });
      if (res.success) { setAmount(''); setDetails(''); setItemId(null); onDone(); }
    } catch {
      setResult({ ok: false, text: 'Не удалось отправить заявку. Попробуй ещё раз чуть позже.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: 'var(--muted)' }}>
        Минимум {MIN_WITHDRAWAL.toLocaleString('ru')} EXC. Доступно сейчас: {available.toLocaleString('ru')} EXC (лимит месяца: ещё {wallet.remainingWithdrawalLimit.toLocaleString('ru')}).
        Заявку обработает администратор в течение 24 часов, 1 заявка в сутки.
      </p>

      {method === 'stars' ? (
        items === null ? <p style={{ color: 'var(--muted)' }}>Загрузка...</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {items.map(it => (
              <button key={it.id} type="button" disabled={it.locked} onClick={() => setItemId(it.id)}
                className="rounded-xl px-3 py-3 text-sm text-center transition-colors"
                style={{
                  background: itemId === it.id ? 'var(--accent)' : 'var(--bg3)',
                  border: '1px solid var(--border)', color: '#fff', opacity: it.locked ? 0.5 : 1,
                }}>
                <div className="font-bold">{it.title.replace(/.*- /, '')}</div>
                <div className="text-xs mt-1" style={{ opacity: 0.8 }}>{it.effectivePrice.toLocaleString('ru')} EXC</div>
              </button>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-2">
          <Field type="number" inputMode="numeric" placeholder="Сумма в EXC" value={amount} onChange={e => setAmount(e.target.value)} />
          <button type="button" className="text-xs font-bold" style={{ color: 'var(--accent2)' }}
            onClick={() => setAmount(String(available))}>
            Всё доступное: {available.toLocaleString('ru')} EXC
          </button>
          {method === 'rub' && amt > 0 && (
            <p className="text-sm" style={{ color: 'var(--muted)' }}>≈ {rubApprox.toLocaleString('ru')} ₽ по курсу фонда ({wallet.healthRatioPercent}%)</p>
          )}
          {method === 'ton' && amt > 0 && quote && (
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              ≈ {quote.rubles.toLocaleString('ru')} ₽ → ≈ {quote.tonAmount} GRAM
              {quote.usingFallback ? ' (курс приблизительный)' : ` (1 GRAM ≈ ${quote.tonRate} ₽)`}
            </p>
          )}
        </div>
      )}

      <Field type="text" value={details} onChange={e => setDetails(e.target.value)}
        placeholder={method === 'rub' ? 'Банк и номер телефона (СБП)' : method === 'ton' ? 'Адрес TON-кошелька (UQ... / EQ...)' : 'Юзернейм получателя (без @)'} />

      <button type="button" className="hm-btn hm-btn-main" disabled={busy} onClick={submit}>
        {busy ? 'Секунду...' : 'Отправить заявку'}
      </button>
      {result && <Notice ok={result.ok}>{result.text}</Notice>}
    </div>
  );
}

function Modal({ title, onClose, children, center }: { title: string; onClose: () => void; children: ReactNode; center?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(8,8,18,0.75)' }} onClick={onClose}>
      <div className="hm-panel w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-4">
          <h2 className={`font-heading text-white${center ? ' flex-1 text-center pl-8' : ''}`} style={{ fontSize: '1.4rem', textTransform: 'none' }}>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="text-2xl leading-none" style={{ color: 'var(--muted)' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function WithdrawalsTable({ rows }: { rows: Withdrawal[] | null }) {
  return (
    <div className="hm-panel" style={{ padding: 0, overflow: 'hidden' }}>
      <DataTable<Withdrawal>
        cols={[
          { title: 'Заявка', width: 'minmax(0,1fr)' },
          { title: 'Способ', width: 'minmax(0,1.3fr)' },
          { title: 'Сумма', width: 'minmax(0,1fr)' },
          { title: 'Статус', width: 'minmax(0,1fr)' },
          { title: 'Дата', width: 'minmax(0,1fr)' },
        ]}
        rows={rows}
        empty="Заявок на вывод ещё не было"
        render={w => [
          <div key="id">
            <p className="font-medium text-white">В-{w.displayId}</p>
            {w.adminComment && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Администратор: {w.adminComment}</p>}
          </div>,
          <span key="m">{w.method}</span>,
          <span key="a" className="text-yellow-400 font-semibold">{w.amountExc.toLocaleString('ru')} EXC</span>,
          <StatusBadge key="s" status={w.status} labels={WITHDRAW_LABELS} />,
          <RelDate key="d" value={w.createdAt} />,
        ]}
      />
    </div>
  );
}

export default function CashoutPage() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<'cashout' | 'mine'>('cashout');
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[] | null>(null);
  const [open, setOpen] = useState<Method | null>(null);
  const [blocked, setBlocked] = useState(false);

  const reload = useCallback(() => {
    api.wallet().then(setWallet).catch(() => {});
    api.withdrawals().then(setWithdrawals).catch(() => setWithdrawals([]));
  }, []);

  useEffect(() => { if (user) reload(); }, [user, reload]);

  // Гостю вместо кошелька - страница о выводе и донате (как у входа: сначала дожидаемся ответа авторизации)
  if (!loading && !user) return <GuestCashout />;
  if (!user || !wallet) {
    return <div className="flex items-center justify-center py-32"><p style={{ color: 'var(--muted)' }}>Загрузка...</p></div>;
  }

  const rub = Math.round((wallet.coins * wallet.healthRatioPercent) / 10000);
  const waiting = wallet.withdrawalQuestsLeft > 0 || wallet.withdrawalDaysLeft > 0;
  const enabled = !waiting && wallet.phoneConfirmed && wallet.coins >= MIN_WITHDRAWAL;

  // Закрыт ли вывод — решаем по клику на карточку: вместо красных плашек игрок видит окно с причиной.
  const pick = (m: Method) => (enabled ? setOpen(m) : setBlocked(true));

  const waitParts: string[] = [];
  if (wallet.withdrawalQuestsLeft > 0) {
    waitParts.push(`${wallet.withdrawalQuestsLeft} ${plural(wallet.withdrawalQuestsLeft, 'одобренный квест', 'одобренных квеста', 'одобренных квестов')}`);
  }
  if (wallet.withdrawalDaysLeft > 0) {
    waitParts.push(wallet.withdrawalDaysLeft > 0 && wallet.withdrawalHoursLeft > 0 && wallet.withdrawalHoursLeft < 24
      ? `${wallet.withdrawalHoursLeft} ч.`
      : `${wallet.withdrawalDaysLeft} ${plural(wallet.withdrawalDaysLeft, 'день', 'дня', 'дней')}`);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex gap-1 p-1.5 rounded-2xl" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
          {([['cashout', 'Вывод'], ['mine', 'Мои заявки']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className="px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
              style={tab === id ? { background: 'var(--bg3)', color: 'var(--accent2)' } : { color: '#fff' }}>
              {label}
            </button>
          ))}
        </div>
        {wallet.coins < MIN_WITHDRAWAL && (
          <div className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            Заработай ещё <span className="gradient-text-gold font-bold">{(MIN_WITHDRAWAL - wallet.coins).toLocaleString('ru')} EXC</span> для первого вывода
          </div>
        )}
      </div>

      {tab === 'mine' ? <WithdrawalsTable rows={withdrawals} /> : (
        <>
          <div className="text-center space-y-1 py-4">
            <div className="text-lg" style={{ color: 'var(--muted)' }}>Доступно к выводу</div>
            <div className="gradient-text-gold" style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 'clamp(2.6rem, 9vw, 4.5rem)', lineHeight: 1.1 }}>
              {wallet.coins.toLocaleString('ru')} <span style={{ fontSize: '0.45em' }}>EXC</span>
            </div>
            <div className="text-base" style={{ color: 'var(--muted)' }}>
              ≈ {rub.toLocaleString('ru')} ₽ · лимит месяца: ещё {wallet.remainingWithdrawalLimit.toLocaleString('ru')} EXC
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="font-heading text-white" style={{ fontSize: '1.5rem', textTransform: 'none' }}>Популярные</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MethodCard method="rub" wallet={wallet} enabled={enabled} onOpen={() => pick('rub')} />
              <MethodCard method="stars" wallet={wallet} enabled={enabled} onOpen={() => pick('stars')} />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-white" style={{ fontSize: '1.5rem', textTransform: 'none' }}>Крипто</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MethodCard method="ton" wallet={wallet} enabled={enabled} onOpen={() => pick('ton')} />
            </div>
          </section>
        </>
      )}

      {blocked && (
        <Modal title={wallet.coins < MIN_WITHDRAWAL ? 'Ты почти у цели!' : 'Вывод пока закрыт'} center onClose={() => setBlocked(false)}>
          <div className="space-y-5 text-center">
            {wallet.coins < MIN_WITHDRAWAL && (
              <>
                <p style={{ color: 'var(--muted)', fontSize: '1.05rem' }}>
                  Продолжай зарабатывать, чтобы набрать минимальную сумму для вывода
                </p>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-3 text-left">
                    <span className="text-white font-semibold">Твой прогресс</span>
                    <span style={{ color: 'var(--muted)' }}>
                      {wallet.coins.toLocaleString('ru')} / <b className="text-white">{MIN_WITHDRAWAL.toLocaleString('ru')} EXC</b>
                    </span>
                  </div>
                  <div className="hm-xp"><i style={{ width: `${Math.max(2, Math.round((wallet.coins * 100) / MIN_WITHDRAWAL))}%` }} /></div>
                </div>
              </>
            )}
            {waiting && (
              <p style={{ color: 'var(--muted)' }}>
                Вывод откроется, когда пройдёт ещё: <b className="text-white">{waitParts.join(' и ')}</b>
                <br />(нужно 3 дня с регистрации и 3 одобренных квеста).
              </p>
            )}
            {!wallet.phoneConfirmed && (
              <p style={{ color: 'var(--muted)' }}>
                Один раз подтверди номер телефона в боте: открой «Вывод» и поделись контактом.
              </p>
            )}
            <button type="button" className="hm-btn hm-btn-ghost" onClick={() => setBlocked(false)}>Понятно</button>
          </div>
        </Modal>
      )}

      {open && (
        <Modal title={`Вывод: ${METHODS[open].title}`} onClose={() => setOpen(null)}>
          <WithdrawForm method={open} wallet={wallet} onDone={reload} />
        </Modal>
      )}
    </div>
  );
}
