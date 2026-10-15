'use client';

import { useEffect, useRef, useState } from 'react';

/** Число, которое плавно «набегает» от 0 при появлении на экране. При prefers-reduced-motion и без JS показывает итог сразу. */
export default function CountUp({ value, duration = 1200 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let started = false;
    setShown(0);
    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        observer.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return <span ref={ref}>{shown.toLocaleString('ru')}</span>;
}
