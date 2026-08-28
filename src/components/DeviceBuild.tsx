'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const easeOut = [0.23, 1, 0.32, 1] as const;

type Beat = { src: string; video?: boolean; kicker: string; title: string; credit?: string };

/** The Harvard point-of-care device, told as a scroll-pinned build sequence.
 *  Beats 1–6 are Noorul's own build footage; 7–8 are the paper's figures
 *  (CC BY-NC, attributed). Cross-fade on scroll; captions animate per beat. */
const BEATS: Beat[] = [
  { src: '/media/s1-channel-designs.jpg', kicker: '01 · Design', title: 'Microfluidic channels, from scratch' },
  { src: '/media/s1-laser-cut.jpg', kicker: '02 · Fabricate', title: 'Laser-cutting the PMMA device layers' },
  { src: '/media/s1-soldering.jpg', kicker: '03 · Build', title: 'Soldering the flow-control electronics' },
  { src: '/media/s1-arduino-flow.jpg', kicker: '04 · Automate', title: 'Programming sequential & oscillatory flow' },
  { src: '/media/s1-poc-device.jpg', kicker: '05 · Assemble', title: 'A working point-of-care device' },
  { src: '/media/s1-flow.mp4', video: true, kicker: '06 · Run', title: 'The assay in action — nanoparticle bubbling' },
  {
    src: '/media/paper-fig3-network.jpg',
    kicker: '07 · Learn',
    title: 'A deep-learning model reads the signal',
    credit: 'Fig. 3 — Chen, Mateen et al., Science Advances 2025 (CC BY-NC)',
  },
  {
    src: '/media/paper-fig4-roc.jpg',
    kicker: '08 · Validate',
    title: '94.59% accuracy — MGH & Cherokee Nation',
    credit: 'Fig. 4 — Chen, Mateen et al., Science Advances 2025 (CC BY-NC)',
  },
];

const VIDEO_BEATS = new Set(BEATS.map((b, i) => (b.video ? i : -1)).filter((i) => i >= 0));

export function DeviceBuild() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // active beat = the step crossing the viewport middle
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // only run the video when its beat is on screen
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (VIDEO_BEATS.has(active)) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  const beat = BEATS[active];

  return (
    <section aria-label="Building the point-of-care device" className="relative">
      {/* lead-in (scrolls normally) */}
      <div className="mx-auto max-w-7xl px-5 pb-4 pt-10 sm:px-8">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-mute">The build · Harvard</span>
        <h3 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
          From 3D print to a device that detects HCV.
        </h3>
        <p className="mt-2 max-w-xl text-fg-mute">
          Scroll to follow the point-of-care system I built — fabrication, to a live assay, to a deep-learning
          readout validated in the clinic.
        </p>
      </div>

      {/* pinned visual */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {BEATS.map((b, i) => (
          <div
            key={b.src}
            className="absolute inset-0"
            style={{ opacity: i === active ? 1 : 0, transition: 'opacity 0.6s var(--ease-out)' }}
          >
            {b.video ? (
              <video ref={videoRef} src={b.src} muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
            ) : (
              <img src={b.src} alt={b.title} className="h-full w-full object-cover" loading="lazy" />
            )}
          </div>
        ))}

        {/* legibility scrim */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(4,6,9,0.94) 0%, rgba(4,6,9,0.30) 42%, rgba(4,6,9,0.62) 100%)',
          }}
        />

        {/* caption + progress */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: easeOut }}
                className="max-w-2xl"
              >
                <div className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                  {beat.kicker}
                </div>
                <h3 className="mt-3 font-display text-4xl italic leading-[1.05] sm:text-6xl">{beat.title}</h3>
                {beat.credit && <p className="mt-3 font-mono text-[10px] leading-relaxed text-fg-mute">{beat.credit}</p>}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex gap-1.5">
              {BEATS.map((_, i) => (
                <span
                  key={i}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 28 : 10,
                    background: i === active ? 'var(--accent)' : 'var(--hairline-strong)',
                    transitionTimingFunction: 'var(--ease-out)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* invisible scroll drivers, pulled up to overlap the pinned visual */}
      <div className="relative -mt-[100vh]">
        {BEATS.map((_, i) => (
          <div
            key={i}
            data-i={i}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            className="h-[65vh]"
            aria-hidden
          />
        ))}
      </div>
    </section>
  );
}
