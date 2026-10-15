'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Layout живёт между переходами, поэтому запускаем заново при смене страницы: иначе при переходе
// на «Главная» из меню блоки .reveal остаются прозрачными навсегда.
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
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -36px 0px' }
    );

    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
    // Страховка: если наблюдатель не сработал, видимую часть страницы всё равно показываем.
    const fallback = window.setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
      });
    }, 1200);
    return () => { observer.disconnect(); window.clearTimeout(fallback); };
  }, [pathname]);

  return null;
}
