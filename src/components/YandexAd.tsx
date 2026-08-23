'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    yaContextCb?: Array<() => void>;
    Ya?: { Context: { AdvManager: { render: (options: { blockId: string; renderTo: string }) => void } } };
  }
}

export default function YandexAd({ blockId }: { blockId: string }) {
  const renderTo = `yandex_rtb_${blockId}`;

  useEffect(() => {
    window.yaContextCb = window.yaContextCb || [];
    window.yaContextCb.push(() => {
      window.Ya?.Context.AdvManager.render({ blockId, renderTo });
    });
  }, [blockId, renderTo]);

  return <div id={renderTo} />;
}
