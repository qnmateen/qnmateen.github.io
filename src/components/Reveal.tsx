'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Scroll-reveal: adds `.is-visible` when the element enters the viewport.
 * Motion values (easing, blur, translate) live in globals.css `.reveal`.
 * `delay` staggers grouped children (keep to 30–80ms per Emil's stagger rule).
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'span';
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  const Component = Tag as 'div';
  return (
    <Component ref={ref as React.Ref<HTMLDivElement>} className={`reveal ${className}`}>
      {children}
    </Component>
  );
}
