'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Layout живёт между переходами, поэтому запускаем заново при смене страницы: иначе при переходе
// на «Главная» из меню блоки .reveal остаются прозрачными навсегда.
// Блоки .reveal появляются и без перехода (главная переключается между гостем и кабинетом при входе/выходе),
// поэтому за новыми узлами следит ещё и MutationObserver.
export default function ScrollRevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    const staggerSelectors = ['.how-step', '.stat-item'];

    staggerSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const siblings = Array.from(el.parentElement!.querySelectorAll(sel));
        const idx = siblings.indexOf(el as HTMLElement);
        (el as HTMLElement).style.transitionDelay = Math.min(idx * 80, 400) + 'ms';
        el.classList.add('reveal');
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // Блок, который пролистнули быстрым скроллом (он уже выше экрана), тоже показываем.
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -36px 0px' }
    );

    const watchNew = () => document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
    watchNew();
    const mutations = new MutationObserver(watchNew);
    mutations.observe(document.body, { childList: true, subtree: true });
    // Страховка: если наблюдатель не сработал, видимую часть страницы всё равно показываем.
    const fallback = window.setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
      });
    }, 1200);
    return () => { observer.disconnect(); mutations.disconnect(); window.clearTimeout(fallback); };
  }, [pathname]);

  return null;
}
