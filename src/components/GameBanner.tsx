'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gamePhotoUrl } from '@/lib/api';

/** Баннер игры, который сам является кнопкой: ссылкой (href) или переключателем (onClick); без обоих - просто картинка (витрина для гостей). Если у игры нет обложки, показывается заглушка с названием. */
export default function GameBanner({ name, href, onClick, active }: {
  name: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const inner = (
    <>
      {!broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={el => { if (el?.complete && el.naturalWidth > 0) setLoaded(true); }}
          src={gamePhotoUrl(name)} alt="" loading="lazy" decoding="async"
          onLoad={() => setLoaded(true)} onError={() => setBroken(true)}
        />
      )}
      <span className="gm-name">{name}</span>
    </>
  );
  const cls = `gm-banner${broken ? ' no-img' : ''}${loaded ? ' loaded' : ''}${active ? ' on' : ''}`;

  if (href) return <Link href={href} className={cls} aria-label={name}>{inner}</Link>;
  if (!onClick) return <div className={`${cls} static`} role="img" aria-label={name}>{inner}</div>;
  return <button type="button" onClick={onClick} className={cls} aria-pressed={active} aria-label={name}>{inner}</button>;
}
