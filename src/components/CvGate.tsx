'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PROFILE } from '@/lib/content';

const easeOut = [0.23, 1, 0.32, 1] as const;

// SHA-256 of the access code. To change the code, replace this hash:
//   printf '%s' 'YOUR-CODE' | shasum -a 256
// Current code: QNM-2025
const CODE_HASH = 'de65cf0e61fb5c8f9807b164b26bead1c85e7058816d2be67f5393cb9a6f86b5';

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function CvGate({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const hash = await sha256(code.trim());
    setBusy(false);
    if (hash === CODE_HASH) {
      const a = document.createElement('a');
      a.href = PROFILE.links.cv;
      a.download = 'Qazi_Noorul_Mateen_CV.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setCode('');
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: easeOut }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-[75] w-[92vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-hairline bg-bg-soft p-8"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">Download CV</h3>
              <button onClick={onClose} className="rounded-full p-2 text-fg-mute transition-transform hover:text-fg active:scale-90" aria-label="Close">✕</button>
            </div>
            <p className="mt-2 text-sm text-fg-mute">Enter the access code to download my CV. Reach out if you need it.</p>

            <form onSubmit={submit} className="mt-5">
              <input
                autoFocus
                type="password"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(false); }}
                placeholder="Access code"
                className="w-full rounded-xl border bg-panel px-4 py-3 text-sm text-fg outline-none transition-colors"
                style={{ borderColor: error ? '#f87171' : 'var(--hairline)' }}
              />
              {error && <p className="mt-2 text-xs text-red-400">Incorrect code. Try again.</p>}
              <button
                type="submit"
                disabled={busy || !code}
                className="mt-4 w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-black transition-transform duration-150 active:scale-[0.98] disabled:opacity-40"
                style={{ transitionTimingFunction: 'var(--ease-out)' }}
              >
                {busy ? 'Checking…' : 'Unlock & download'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
