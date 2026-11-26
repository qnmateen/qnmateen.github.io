'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from 'react';

type Beat = { src: string; video?: boolean; kicker: string; title: string; credit?: string };

/** The Harvard point-of-care device, told as a scrolling build sequence.
 *  Beats 1–6 are Noorul's own build footage; 7–8 are the paper's figures
 *  (CC BY-NC, attributed). Frames move with the page so scroll is never pinned. */
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

export function DeviceBuild() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoFrameRef = useRef<HTMLElement>(null);

  // Play the assay clip only while its frame is on screen.
  useEffect(() => {
    const frame = videoFrameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.45 },
    );
    io.observe(frame);
    return () => io.disconnect();
  }, []);

  return (
    <section aria-label="Building the point-of-care device">
      <div className="mx-auto max-w-7xl px-5 pb-6 pt-10 sm:px-8">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-mute">The build · Harvard</span>
        <h3 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
          From 3D print to a device that detects HCV.
        </h3>
        <p className="mt-2 max-w-xl text-fg-mute">
          The point-of-care system I built — fabrication, a live assay, then a deep-learning readout validated in the
          clinic.
        </p>
      </div>

      <div className="flex flex-col gap-3 px-3 sm:gap-4 sm:px-5">
        {BEATS.map((beat) => (
          <figure
            key={beat.src}
            ref={beat.video ? videoFrameRef : undefined}
            className="relative h-[46vh] min-h-[300px] w-full overflow-hidden rounded-2xl sm:h-[52vh]"
          >
            {beat.video ? (
              <video
                ref={videoRef}
                src={beat.src}
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            ) : (
              <img src={beat.src} alt={beat.title} className="h-full w-full object-cover" loading="lazy" />
            )}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(4,6,9,0.78) 0%, rgba(4,6,9,0.08) 48%, rgba(4,6,9,0.2) 100%)',
              }}
            />
            <figcaption className="pointer-events-none absolute inset-x-0 top-0 px-5 pt-5 sm:px-8 sm:pt-7">
              <div className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                {beat.kicker}
              </div>
              <h3 className="mt-2 max-w-3xl font-display text-3xl italic leading-[1.05] sm:text-5xl">{beat.title}</h3>
              {beat.credit && <p className="mt-2 max-w-xl font-mono text-[10px] leading-relaxed text-fg-mute">{beat.credit}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
