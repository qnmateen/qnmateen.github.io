'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PROFILE, SECTIONS } from '@/lib/content';
import { useActiveSection } from '@/lib/activeSection';

const easeOut = [0.23, 1, 0.32, 1] as const;

export function Nav({ onFastLane }: { onFastLane: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection((s) => s.activeId);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        background: solid ? 'color-mix(in srgb, var(--bg) 82%, transparent)' : 'transparent',
        backdropFilter: solid ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--hairline)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-hairline text-[11px] font-semibold tracking-tight text-accent">
            QNM
          </span>
          <span className="text-base font-semibold tracking-tight sm:text-lg">{PROFILE.name}</span>
        </a>

        {/* desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {SECTIONS.map((s) => {
            const active = s.id === activeId;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={active ? 'true' : undefined}
                className="text-sm transition-colors duration-150"
                style={{ color: active ? 'var(--accent)' : 'var(--fg-mute)' }}
              >
                {s.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={PROFILE.links.cv}
            download="Qazi_Noorul_Mateen_CV.pdf"
            className="hidden rounded-full border border-hairline px-4 py-2 text-xs font-medium transition-transform duration-150 hover:bg-white/5 active:scale-[0.97] lg:inline-block"
            style={{ transitionTimingFunction: 'var(--ease-out)' }}
          >
            Download CV
          </a>
          <button
            onClick={onFastLane}
            className="hidden rounded-full bg-white/5 px-4 py-2 text-xs font-medium transition-transform duration-150 hover:bg-white/10 active:scale-[0.97] lg:inline-block"
            style={{ transitionTimingFunction: 'var(--ease-out)', border: '1px solid var(--accent)', color: 'var(--accent)' }}
          >
            In a hurry? →
          </button>

          {/* mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full border border-hairline lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="relative block h-3.5 w-4">
              <span
                className="absolute left-0 h-0.5 w-4 rounded bg-fg transition-all duration-200"
                style={{ top: menuOpen ? '6px' : '2px', transform: menuOpen ? 'rotate(45deg)' : 'none', transitionTimingFunction: 'var(--ease-out)' }}
              />
              <span
                className="absolute left-0 top-[6px] h-0.5 w-4 rounded bg-fg transition-opacity duration-200"
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className="absolute left-0 h-0.5 w-4 rounded bg-fg transition-all duration-200"
                style={{ top: menuOpen ? '6px' : '10px', transform: menuOpen ? 'rotate(-45deg)' : 'none', transitionTimingFunction: 'var(--ease-out)' }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* mobile menu sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="overflow-hidden border-t border-hairline lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-0.5 px-5 pb-4 pt-1">
              {SECTIONS.map((s) => {
                const active = s.id === activeId;
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-3 text-base transition-colors"
                    style={{ color: active ? 'var(--accent)' : 'var(--fg)' }}
                  >
                    {s.label}
                  </a>
                );
              })}
              <div className="mt-3 flex gap-3 px-3">
                <a
                  href={PROFILE.links.cv}
                  download="Qazi_Noorul_Mateen_CV.pdf"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-full border border-hairline px-4 py-2.5 text-center text-sm font-medium"
                >
                  Download CV
                </a>
                <a
                  href={`mailto:${PROFILE.email}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-full px-4 py-2.5 text-center text-sm font-semibold text-black"
                  style={{ background: 'var(--accent)' }}
                >
                  Contact
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
