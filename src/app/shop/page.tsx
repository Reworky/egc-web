import { api } from '@/lib/api';
import PageHead from '@/components/PageHead';

export const revalidate = 60;

const BOT_URL = 'https://t.me/invitetogamebot';

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
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <PageHead
        kicker="Награды"
        title="Магазин"
        text="Трать EXC на донат в играх, подарочные карты и бусты или выводи деньгами. Заявки оформляются в боте."
        chips={<>
          <span className="pg-chip gold">100 EXC = <b>1 ₽</b></span>
          {stats && <span className="pg-chip green">Здоровье фонда: <b>{stats.healthRatioPercent}%</b></span>}
          <span className="pg-chip"><b>{items.length}</b> позиций</span>
        </>}
        actions={<a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Открыть магазин в боте</a>}
      />

      {Object.entries(byCategory).map(([category, catItems]) => (
        <section key={category} className="space-y-4">
          <div className="hm-head" style={{ marginBottom: 0 }}>
            <div>
              <div className="hm-kicker">Раздел</div>
              <h2 className="section-title">{category}</h2>
            </div>
          </div>
          <div className="hm-features">
            {catItems.map(item => (
              <div key={item.id} className="hm-item">
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
                <div className="hm-reward">
                  <b>{item.effectivePrice.toLocaleString('ru')} EXC</b>
                  <span>≈ {(item.effectivePrice / 100).toFixed(0)} ₽</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {items.length === 0 && (
        <div className="hm-empty">
          <b>Товары не найдены</b>
          <p>Загляни чуть позже: ассортимент обновляется.</p>
        </div>
      )}

      <section className="hm-final reveal">
        <h2 className="font-heading">Хочешь забрать награду?</h2>
        <p>Заказать награду и вывести EXC можно в боте: на карту по СБП, в Telegram Stars или в GRAM.</p>
        <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Открыть EGC в Telegram</a>
      </section>
    </div>
  );
}
