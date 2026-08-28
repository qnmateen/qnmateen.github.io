import { REPOS, IIIT_PROJECTS, IIITB_REPO_URL, type Repo } from '@/lib/content';
import { Reveal } from './Reveal';
import { Counter } from './Counter';

const STATS: { n?: number; suffix?: string; text?: string; label: string }[] = [
  { n: 613, label: 'Contributions · last 12 months' },
  { n: 578, label: 'In private production repos' },
  { n: 20, label: 'Public repositories' },
  { text: '2017', label: 'On GitHub since' },
];

function RepoCard({ r, delay }: { r: Repo; delay: number }) {
  return (
    <Reveal delay={delay}>
      <a
        href={r.url}
        target="_blank"
        rel="noreferrer"
        className="group flex h-full flex-col rounded-2xl border border-hairline bg-panel/60 p-5 transition-all duration-200 hover:border-hairline-strong hover:bg-panel active:scale-[0.99]"
        style={{ transitionTimingFunction: 'var(--ease-out)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent">{r.area}</span>
          <span className="font-mono text-[10px] text-fg-mute">{r.lang}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold tracking-tight">{r.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-mute">{r.desc}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-fg-mute transition-colors group-hover:text-fg">
          View on GitHub <span aria-hidden>→</span>
        </span>
      </a>
    </Reveal>
  );
}

/** Proof layer: real public repos + a GitHub-activity snapshot that captures
 *  the private production work (MarkiTech / MindGaps) without exposing code. */
export function CodeSection() {
  return (
    <section id="code" className="relative border-t border-hairline py-24 sm:py-32" style={{ scrollMarginTop: '5rem' }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-fg-mute">The code · Open source</span>
          <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.025em] sm:text-5xl">
            The work, in code you can read.
          </h2>
          <p className="mt-4 max-w-2xl text-fg-mute">
            Public repositories behind the research and the tools. Most of my day-to-day lives in private production
            repos — Heyliaa &amp; ARVO at MarkiTech, and MindGaps — reflected in the activity below.
          </p>
        </Reveal>

        {/* GitHub activity snapshot */}
        <div className="mt-12 grid grid-cols-2 gap-6 border-y border-hairline py-8 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 70}>
              <div className="font-display text-4xl leading-none tracking-tight text-accent sm:text-5xl">
                {s.n !== undefined ? <Counter to={s.n} suffix={s.suffix ?? ''} /> : s.text}
              </div>
              <div className="mt-2 text-xs uppercase tracking-wider text-fg-mute">{s.label}</div>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 font-mono text-[10px] text-fg-mute">GitHub activity snapshot · Aug 2026</p>

        {/* standalone repos */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REPOS.map((r, i) => (
            <RepoCard key={r.url} r={r} delay={(i % 3) * 60} />
          ))}
        </div>

        {/* IIIT-B diploma projects (deep-linked into the one repo) */}
        <Reveal>
          <div className="mt-16 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-fg-mute">Academic · IIIT-B ML diploma</span>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Machine-learning projects</h3>
            </div>
            <a
              href={IIITB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-fg-mute transition-colors hover:text-fg"
            >
              Full projects repo <span aria-hidden>→</span>
            </a>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {IIIT_PROJECTS.map((p, i) => (
            <RepoCard key={p.url} r={p} delay={(i % 3) * 60} />
          ))}
        </div>

        <Reveal delay={120}>
          <a
            href="https://github.com/qnmateen"
            target="_blank"
            rel="noreferrer"
            className="mt-12 inline-flex items-center gap-2 rounded-full border border-hairline px-6 py-3 text-sm font-medium transition-transform duration-150 hover:bg-white/5 active:scale-[0.97]"
            style={{ transitionTimingFunction: 'var(--ease-out)' }}
          >
            All repositories on GitHub <span aria-hidden>→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
