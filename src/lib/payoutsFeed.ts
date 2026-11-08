// Лента выплат нужна сразу четырём блокам главной (арт, бегущая строка, цифры доверия, список):
// раньше каждый слал свой запрос, теперь они делят один и тот же ответ.
const FRESH_MS = 20_000;

let cache: { at: number; req: Promise<unknown | null> } | null = null;

export function fetchPayoutsFeed<T>(): Promise<T | null> {
  if (cache && Date.now() - cache.at < FRESH_MS) return cache.req as Promise<T | null>;
  const req = fetch('/api/payouts/feed')
    .then(r => (r.ok ? r.json() : null))
    .catch(() => null);
  const entry = { at: Date.now(), req };
  cache = entry;
  // Неудачный ответ не запоминаем: следующий блок или обновление попробует снова.
  req.then(d => { if (d === null && cache === entry) cache = null; });
  return req as Promise<T | null>;
}
