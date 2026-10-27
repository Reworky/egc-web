'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useAuth } from '@/lib/useAuth';
import PageHead from '@/components/PageHead';

/** Главная в двух видах: гостю презентация клуба, вошедшему игроку кабинет. Оба куска приходят с сервера готовыми, здесь только выбор. */
export default function HomeSwitch({ guest, member }: { guest: ReactNode; member: ReactNode }) {
  const { user } = useAuth();

  if (!user) return <>{guest}</>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <PageHead
        kicker="Личный кабинет"
        title={`Привет, ${user.nickname}`}
        chips={<>
          <span className="pg-chip gold"><b>{user.coins.toLocaleString('ru')}</b> EXC · ≈ {Math.floor(user.coins / 100).toLocaleString('ru')} ₽</span>
          <span className="pg-chip">{user.levelName} · ур. <b>{user.level}</b></span>
          <span className="pg-chip"><b>{user.completedQuests}</b> квестов</span>
          {user.streakDays > 0 && <span className="pg-chip green">Серия: <b>{user.streakDays}</b> дн.</span>}
        </>}
        actions={<>
          <Link href="/quests" className="hm-btn hm-btn-main">Квесты</Link>
          <Link href="/shop" className="hm-btn hm-btn-ghost">Магазин</Link>
          <Link href="/wheel" className="hm-btn hm-btn-ghost">Колесо</Link>
          <Link href="/profile" className="hm-btn hm-btn-ghost">Профиль</Link>
        </>}
      />
      {member}
    </div>
  );
}
