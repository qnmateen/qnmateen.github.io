'use client';

import { useState } from 'react';
import type { MediaSlot } from '@/lib/content';

const KIND_LABEL: Record<MediaSlot['kind'], string> = {
  image: 'Photo',
  video: 'Video',
  chart: 'Figure',
};

/**
 * Renders real media when `slot.src` resolves; if the file is missing (404) or
 * `src` is null, it falls back to a labelled placeholder. So you can pre-wire a
 * filename and the frame lights up the moment you drop that file in public/media/.
 */
export function MediaFrame({ slot, accent, tall = false }: { slot: MediaSlot; accent: string; tall?: boolean }) {
  const [failed, setFailed] = useState(false);
  const showMedia = !!slot.src && !failed;

  return (
    <figure
      className={`group relative overflow-hidden rounded-2xl border border-hairline bg-panel ${
        tall ? 'aspect-[3/4]' : 'aspect-video'
      }`}
    >
      {showMedia ? (
        slot.kind === 'video' ? (
          <video
            src={slot.src!}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            onError={() => setFailed(true)}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slot.src!}
            alt={slot.caption}
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        )
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: `${accent}1f`, color: accent }}
          >
            {KIND_LABEL[slot.kind]}
          </span>
          <span className="text-xs text-fg-mute">{slot.caption}</span>
        </div>
      )}
      <figcaption
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 text-xs text-fg transition-transform duration-300 group-hover:translate-y-0"
        style={{ transitionTimingFunction: 'var(--ease-out)' }}
      >
        {slot.caption}
      </figcaption>
    </figure>
  );
}
