'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gamePhotoUrl } from '@/lib/api';

/** Баннер игры, который сам является кнопкой: ссылкой (href) или переключателем (onClick). Если у игры нет обложки, показывается заглушка с названием. */
export default function GameBanner({ name, href, onClick, active }: {
  name: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const inner = (
    <>
      {!broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={gamePhotoUrl(name)} alt="" loading="lazy" onError={() => setBroken(true)} />
      )}
      <span className="gm-name">{name}</span>
    </>
  );
  const cls = `gm-banner${broken ? ' no-img' : ''}${active ? ' on' : ''}`;

  if (href) return <Link href={href} className={cls} aria-label={name}>{inner}</Link>;
  return <button type="button" onClick={onClick} className={cls} aria-pressed={active} aria-label={name}>{inner}</button>;
}
