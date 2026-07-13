import { PROFILE, EDUCATION, AWARDS } from '@/lib/content';
import { Reveal } from './Reveal';

export function StudySection() {
  return (
    <section id="study" className="border-t border-hairline py-24 sm:py-32" style={{ scrollMarginTop: '5rem' }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-fg-mute">
            The Study · Credentials
          </span>
          <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Trained across three continents.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          {/* education */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-fg-mute">Education</h3>
            <ul className="space-y-5">
              {EDUCATION.map((e, i) => (
                <Reveal as="li" key={e.school} delay={i * 60} className="flex items-baseline justify-between gap-4 border-b border-hairline pb-5">
                  <div>
                    <div className="font-medium">{e.school}</div>
                    <div className="text-sm text-fg-mute">{e.detail}</div>
                  </div>
                  <span className="font-mono text-sm text-accent">{e.year}</span>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* awards */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-fg-mute">Honors & achievements</h3>
            <ul className="space-y-4">
              {AWARDS.map((a, i) => (
                <Reveal as="li" key={a} delay={i * 60} className="flex gap-3 text-sm leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  {a}
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        {/* contact / footer */}
        <Reveal className="mt-24">
          <div className="flex flex-col gap-8 rounded-3xl border border-hairline bg-panel p-8 sm:flex-row sm:items-center sm:p-12">
            <div className="relative h-28 w-28 flex-none overflow-hidden rounded-2xl border border-hairline">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/portrait-lab.jpg" alt={PROFILE.name} className="h-full w-full object-cover" />
            </div>
            <div>
            <h3 className="max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Let’s build something that matters.
            </h3>
            <p className="mt-3 max-w-lg text-fg-mute">
              Open to roles and collaborations at the intersection of AI, healthcare, and the life sciences.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${PROFILE.email}`} className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform duration-150 active:scale-[0.97]" style={{ transitionTimingFunction: 'var(--ease-out)' }}>
                {PROFILE.email}
              </a>
              <a href={PROFILE.links.linkedin} className="rounded-full border border-hairline px-6 py-3 text-sm font-medium transition-transform duration-150 hover:bg-white/5 active:scale-[0.97]" style={{ transitionTimingFunction: 'var(--ease-out)' }}>
                LinkedIn
              </a>
              <a href={PROFILE.links.github} className="rounded-full border border-hairline px-6 py-3 text-sm font-medium transition-transform duration-150 hover:bg-white/5 active:scale-[0.97]" style={{ transitionTimingFunction: 'var(--ease-out)' }}>
                GitHub
              </a>
              <a href={PROFILE.links.scholar} className="rounded-full border border-hairline px-6 py-3 text-sm font-medium transition-transform duration-150 hover:bg-white/5 active:scale-[0.97]" style={{ transitionTimingFunction: 'var(--ease-out)' }}>
                Google Scholar
              </a>
            </div>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-fg-mute">
            © {PROFILE.name} · {PROFILE.location}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
