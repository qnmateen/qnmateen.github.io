'use client';

import { AnimatePresence, motion } from 'motion/react';
import { PROFILE, CREDENTIALS } from '@/lib/content';

const easeOut = [0.23, 1, 0.32, 1] as const;

export function FastLane({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: easeOut }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-[70] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-hairline bg-bg-soft p-8"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold tracking-tight">The 60-second version</h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-fg-mute transition-transform duration-150 hover:text-fg active:scale-90"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-fg-mute">{PROFILE.pitch}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {CREDENTIALS.map((c) => (
                <div key={c.value} className="rounded-xl border border-hairline bg-panel px-4 py-3">
                  <div className="text-sm font-semibold text-accent">{c.value}</div>
                  <div className="text-xs text-fg-mute">{c.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={PROFILE.links.cv}
                download="Qazi_Noorul_Mateen_CV.pdf"
                onClick={onClose}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black transition-transform duration-150 active:scale-[0.97]"
                style={{ transitionTimingFunction: 'var(--ease-out)' }}
              >
                Download CV
              </a>
              <a href={`mailto:${PROFILE.email}`} className="rounded-full border border-hairline px-5 py-2.5 text-sm font-medium transition-transform duration-150 hover:bg-white/5 active:scale-[0.97]" style={{ transitionTimingFunction: 'var(--ease-out)' }}>
                Contact
              </a>
              <button onClick={onClose} className="rounded-full px-5 py-2.5 text-sm font-medium text-fg-mute transition-transform duration-150 hover:text-fg active:scale-[0.97]">
                Take the full tour
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
