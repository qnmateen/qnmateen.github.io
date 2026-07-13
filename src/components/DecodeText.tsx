'use client';

import { useEffect, useRef } from 'react';

// pure DNA bases, so the scramble reads unmistakably as a genomic sequence
const CHARS = 'ATGC';

function scramble(text: string, e: number) {
  const locked = Math.floor(e * text.length);
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === ' ' || ch === '\n') {
      out += ch;
    } else if (i < locked) {
      out += ch;
    } else {
      out += CHARS[(Math.random() * CHARS.length) | 0];
    }
  }
  return out;
}

/**
 * Resolves `text` out of scrambling characters once it scrolls into view.
 * Layout is held by a hidden copy so surrounding text never reflows; the real
 * text is exposed to assistive tech via aria-label and shown under reduced motion.
 */
export function DecodeText({
  text,
  className = '',
  delay = 0,
  duration = 950,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const out = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = out.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.textContent = text;
      return;
    }
    // prime to fully scrambled so it doesn't reveal the answer before animating
    el.textContent = scramble(text, 0);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();
        let start = 0;
        const step = (ts: number) => {
          if (!start) start = ts + delay;
          const t = ts - start;
          if (t < 0) {
            requestAnimationFrame(step);
            return;
          }
          const p = Math.min(1, t / duration);
          const e = 1 - Math.pow(1 - p, 3); // ease-out
          el.textContent = scramble(text, e);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = text;
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, delay, duration]);

  return (
    <span className={`relative inline-block ${className}`} aria-label={text}>
      <span aria-hidden style={{ visibility: 'hidden' }}>
        {text}
      </span>
      <span
        ref={out}
        aria-hidden
        className="absolute left-0 top-0"
        style={{ whiteSpace: 'pre', fontVariantLigatures: 'none' }}
      >
        {text}
      </span>
    </span>
  );
}
