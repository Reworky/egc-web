'use client';
import { useEffect } from 'react';

export default function ScrollRevealInit() {
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
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
