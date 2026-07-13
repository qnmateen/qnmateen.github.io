'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { MediaSlot } from '@/lib/content';

const easeOut = [0.23, 1, 0.32, 1] as const;
const KIND_LABEL: Record<MediaSlot['kind'], string> = { image: 'Photo', video: 'Video', chart: 'Figure' };

function MediaEl({ slot, className, onError }: { slot: MediaSlot; className: string; onError: () => void }) {
  if (slot.kind === 'video') {
    return <video src={slot.src!} muted loop playsInline autoPlay onError={onError} className={className} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={slot.src!} alt={slot.caption} onError={onError} className={className} />;
}

/**
 * Compact, semi-transparent single-image carousel. Shows one image at a time,
 * auto-advancing with a crossfade, so the particle background stays visible
 * around and (faintly) through it. Click to enlarge in the lightbox.
 */
export function MediaMosaic({ media, accent }: { media: MediaSlot[]; accent: string }) {
  const reduce = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const items = useMemo(() => (media.some((m) => m.src) ? media.filter((m) => m.src) : media.slice(0, 1)), [media]);

  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [hover, setHover] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const n = items.length;
  const cur = items[Math.min(idx, n - 1)];
  const ok = !!cur.src && !failed[cur.src!];
  const go = (d: number) => setIdx((i) => (i + d + n) % n);

  // auto-advance images, but pause on a video (let it play), hover, or any overlay
  useEffect(() => {
    if (reduce || n < 2 || hover || open || gallery || cur.kind === 'video') return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 4000);
    return () => clearInterval(t);
  }, [n, hover, open, gallery, reduce, idx, cur.kind]);

  // keyboard nav while lightbox open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, n]);

  return (
    <div className="lg:pl-6">
      <div
        className="mx-auto w-full"
        style={{ maxWidth: 340 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="group relative w-full overflow-hidden rounded-xl border border-white/10" style={{ aspectRatio: '4 / 3' }}>
          <AnimatePresence>
            <motion.div
              key={idx}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: easeOut }}
            >
              {ok ? (
                <MediaEl
                  slot={cur}
                  onError={() => setFailed((f) => ({ ...f, [cur.src!]: true }))}
                  className={`h-full w-full opacity-[0.88] transition-opacity duration-300 group-hover:opacity-100 ${cur.contain ? 'object-contain p-6' : 'object-cover'}`}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                  <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider" style={{ background: `${accent}1f`, color: accent }}>
                    {KIND_LABEL[cur.kind]}
                  </span>
                  <span className="text-xs text-fg-mute">{cur.caption}</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {ok && (
            <button onClick={() => setOpen(true)} className="absolute inset-0 z-10 cursor-zoom-in" aria-label="Enlarge" />
          )}

          <span className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 to-transparent p-3 text-[11px] text-fg">
            {cur.caption}
          </span>
        </div>

        {/* controls */}
        {n > 1 && (
          <div className="mt-3 flex items-center justify-between">
            <button onClick={() => go(-1)} className="rounded-full border border-hairline p-2 text-fg-mute transition-transform hover:text-fg active:scale-90" aria-label="Previous">←</button>
            <div className="flex items-center gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Go to ${i + 1}`}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width: i === idx ? 16 : 6, background: i === idx ? accent : 'var(--hairline-strong)' }}
                />
              ))}
            </div>
            <button onClick={() => go(1)} className="rounded-full border border-hairline p-2 text-fg-mute transition-transform hover:text-fg active:scale-90" aria-label="Next">→</button>
          </div>
        )}

        {n > 1 && (
          <button
            onClick={() => setGallery(true)}
            className="mt-3 w-full rounded-full border border-hairline px-4 py-2.5 text-xs font-medium text-fg-mute transition-transform duration-150 hover:bg-white/5 active:scale-[0.98]"
            style={{ transitionTimingFunction: 'var(--ease-out)' }}
          >
            View gallery ({n}) →
          </button>
        )}
      </div>

      {/* full gallery grid */}
      <AnimatePresence>
        {gallery && (
          <motion.div
            className="fixed inset-0 z-[75] overflow-y-auto bg-black/95 p-5 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
          >
            <div className="mx-auto max-w-5xl">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-fg-mute">Gallery · {n}</span>
                <button onClick={() => setGallery(false)} className="rounded-full p-2 text-white/70 transition-transform hover:text-white active:scale-90" aria-label="Close gallery">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {items.map((s, i) => (
                  <button
                    key={s.src ?? s.caption}
                    onClick={() => { setIdx(i); setOpen(true); }}
                    className="group relative block w-full overflow-hidden rounded-lg border border-white/10"
                    style={{ aspectRatio: '1 / 1' }}
                  >
                    {s.kind === 'video' ? (
                      <video src={s.src!} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.src!} alt={s.caption} className={`h-full w-full ${s.contain ? 'bg-white/5 object-contain p-3' : 'object-cover'}`} />
                    )}
                    {s.kind === 'video' && (
                      <span className="absolute left-2 top-2 z-10 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">▶ video</span>
                    )}
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/85 to-transparent p-2 text-left text-[10px] text-fg transition-transform duration-300 group-hover:translate-y-0">
                      {s.caption}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* lightbox */}
      <AnimatePresence>
        {open && ok && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: easeOut }}
            onClick={() => setOpen(false)}
          >
            <button onClick={() => setOpen(false)} className="absolute right-5 top-5 rounded-full p-2 text-white/70 transition-transform hover:text-white active:scale-90" aria-label="Close">✕</button>
            <button onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-4 rounded-full p-3 text-white/70 transition-transform hover:text-white active:scale-90" aria-label="Previous">←</button>
            <button onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-4 rounded-full p-3 text-white/70 transition-transform hover:text-white active:scale-90" aria-label="Next">→</button>
            <motion.figure
              key={idx}
              className="max-h-[85vh] max-w-5xl"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: easeOut }}
              onClick={(e) => e.stopPropagation()}
            >
              {cur.kind === 'video' ? (
                <video src={cur.src!} controls autoPlay loop className="max-h-[80vh] w-auto rounded-xl" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cur.src!} alt={cur.caption} className="max-h-[80vh] w-auto rounded-xl" />
              )}
              <figcaption className="mt-3 text-center text-sm text-white/70">{cur.caption}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
