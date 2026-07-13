'use client';

import { PROFILE, CREDENTIALS } from '@/lib/content';

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center">
      {/* legibility scrim over the particle field, left-weighted */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, color-mix(in srgb, var(--bg) 82%, transparent) 0%, color-mix(in srgb, var(--bg) 55%, transparent) 45%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <p className="reveal is-visible mb-5 font-mono text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
          AI Developer · Computational Biologist · Researcher
        </p>
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] tracking-[-0.03em] sm:text-7xl">
          I build AI at the edge of{' '}
          <span className="font-display italic font-normal text-fg-mute">biology &amp; medicine.</span>
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-fg-mute">{PROFILE.pitch}</p>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href="#wetlab"
            className="rounded-full px-6 py-3 text-sm font-semibold text-black transition-transform duration-150 active:scale-[0.97]"
            style={{ background: 'var(--accent)', transitionTimingFunction: 'var(--ease-out)' }}
          >
            Explore the work ↓
          </a>
        </div>

        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-hairline pt-6">
          {CREDENTIALS.slice(0, 5).map((c) => (
            <div key={c.value}>
              <div className="text-sm font-semibold text-fg">{c.value}</div>
              <div className="text-xs text-fg-mute">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
