import { Quest } from '@/lib/api';

/** Карточка квеста в стиле главной (hm-quest). Сложность показываем только если она задана: у большинства квестов её нет. */
export default function QuestCard({ quest }: { quest: Quest }) {
  return (
    <div className="hm-quest">
      <div className="hm-quest-top">
        {quest.category && <span className="hm-chip">{quest.category}</span>}
        {quest.brawlAutoVerify && <span className="hm-chip auto">⚡ автопроверка</span>}
        {quest.highlightNew && <span className="hm-chip new">NEW</span>}
      </div>
      <h3>{quest.title}</h3>
      {quest.description && <p>{quest.description}</p>}
      <div className="hm-reward">
        <b>+{quest.rewardCoins.toLocaleString('ru')} EXC</b>
        <span>
          +{quest.rewardXp} XP{quest.ticketReward ? ` · 🎟 ${quest.ticketReward}` : ''}
          {quest.durationDays ? ` · ${quest.durationDays} дн.` : ''}
          {quest.platform ? ` · ${quest.platform}` : ''}
        </span>
      </div>
    </div>
  );
}
