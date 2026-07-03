import { api } from '@/lib/api';

export const revalidate = 60;

export default async function ShopPage() {
  const [items, stats] = await Promise.all([
    api.shopItems().catch(() => []),
    api.stats().catch(() => null),
  ]);

  const byCategory = items.reduce<Record<string, (typeof items)[number][]>>((acc, item) => {
    const cat = item.category ?? 'Другое';
    (acc[cat] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* Заголовок */}
      <div className="space-y-3">
        <h1 className="text-3xl font-black text-white">🛍️ Магазин наград</h1>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <span>💱</span>
            <span style={{ color: 'var(--muted)' }}>Курс:</span>
            <strong className="gradient-text-gold">100 EXC = 1 ₽</strong>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)' }}>
            <span>💎</span>
            <span style={{ color: 'var(--muted)' }}>Вывод в</span>
            <strong style={{ color: '#38bdf8' }}>USDT · TON</strong>
          </div>
          {stats && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <span>📈</span>
              <span style={{ color: 'var(--muted)' }}>Здоровье фонда:</span>
              <strong style={{ color: '#4ade80' }}>{stats.healthRatioPercent}%</strong>
            </div>
          )}
        </div>
        <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.6), rgba(236,72,153,0.3), transparent)' }} />
      </div>

      {/* Категории */}
      {Object.entries(byCategory).map(([category, catItems]) => (
        <section key={category} className="space-y-4">
          <h2 className="section-title">{category}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {catItems.map(item => (
              <div key={item.id} className="card p-5 flex flex-col gap-3">
                {/* иконка категории */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-3 flex items-center justify-between"
                  style={{ borderTop: '1px solid rgba(124,58,237,0.15)' }}>
                  <span className="exc-badge text-sm">{item.effectivePrice.toLocaleString('ru')} EXC</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>
                    ≈ {(item.effectivePrice / 100).toFixed(0)} ₽
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {items.length === 0 && (
        <div className="card p-20 text-center space-y-3">
          <div className="text-5xl">🛒</div>
          <p className="font-bold text-white">Товары не найдены</p>
        </div>
      )}

      {/* CTA */}
      <div className="card p-6 text-center space-y-4"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.05))' }}>
        <p className="font-semibold text-white">Хочешь заказать награду или вывести EXC?</p>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Заявки оформляются через бот. Вывод доступен в рублях и USDT (Telegram Wallet, сеть TON)</p>
        <a
          href="https://t.me/EXPERIENCEgamingbot"
          target="_blank" rel="noopener noreferrer"
          className="btn-primary px-8 py-3 text-sm inline-flex items-center gap-2"
        >
          <span>Открыть EGC</span>
        </a>
      </div>
    </div>
  );
}
