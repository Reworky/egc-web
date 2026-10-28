'use client';

import { useState } from 'react';

/** Место под арт Экси на первом экране: показывается, как только файл public/exi-hero.png появится; пока его нет, блок скрыт и места не занимает. */
export default function HeroArt() {
  const [ok, setOk] = useState(false);
  return (
    <figure className="hm-hero-art" style={{ display: ok ? 'block' : 'none' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={el => { if (el?.complete && el.naturalWidth > 0) setOk(true); }}
        src="/exi-hero.png" alt="Экси, маскот клуба EGC" onLoad={() => setOk(true)}
      />
    </figure>
  );
}
