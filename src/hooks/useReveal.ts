import { useEffect, useRef, useState } from 'react';

export type RevealDirection = 'up' | 'left' | 'right' | 'scale' | 'image';

/**
 * Inicializa a classe `js-reveal-ready` apenas no cliente (nunca bloqueia SSR/crawlers).
 */
export function useGlobalRevealInit(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      document.documentElement.classList.add('js-reveal-ready');
    }
  }, []);
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.02) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const revealIfInOrAboveViewport = () => {
      const rect = el.getBoundingClientRect();
      // Revela se entrou na viewport ou se o usuário já passou dele (ex: clique em âncora)
      if (rect.top <= window.innerHeight + 60) {
        setVisible(true);
        return true;
      }
      return false;
    };

    if (revealIfInOrAboveViewport()) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '60px 0px 60px 0px' },
    );

    observer.observe(el);

    const onScrollFallback = () => {
      if (revealIfInOrAboveViewport()) {
        observer.unobserve(el);
        window.removeEventListener('scroll', onScrollFallback);
      }
    };
    window.addEventListener('scroll', onScrollFallback, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScrollFallback);
    };
  }, [threshold]);

  return { ref, visible };
}
