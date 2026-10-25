import { api } from '@/lib/api';
import QuestFilter from '@/components/QuestFilter';
import PageHead from '@/components/PageHead';

export const revalidate = 60;

const BOT_URL = 'https://t.me/invitetogamebot';

export default async function QuestsPage() {
  const [quests, games] = await Promise.all([
    api.quests().catch(() => []),
    api.games().catch(() => []),
  ]);
  const auto = quests.filter(q => q.brawlAutoVerify).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <PageHead
        kicker="Каталог"
        title="Квесты"
        text="Выбери игру и квест: награда в EXC видна до старта. Для многих квестов прогресс считается сам по твоему игровому тегу, остальные подтверждаются скриншотом."
        chips={<>
          <span className="pg-chip"><b>{quests.length}</b> квестов</span>
          <span className="pg-chip"><b>{games.length}</b> игр</span>
          {auto > 0 && <span className="pg-chip green"><b>{auto}</b> с автопроверкой</span>}
        </>}
        actions={<a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Взять квест в боте</a>}
      />

      <QuestFilter quests={quests} games={games} />

      <section className="hm-final reveal">
        <h2 className="font-heading">Квест выбран?</h2>
        <p>Квесты берутся и сдаются в боте: открой его, привяжи игровой тег и начинай.</p>
        <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="hm-btn hm-btn-main">Открыть EGC в Telegram</a>
      </section>
    </div>
  );
}
