import type { Metadata } from 'next';
import Link from 'next/link';
import { PROFILE } from '@/lib/content';
import { formatPostDate, getPosts } from '@/lib/blog';
import { absoluteUrl, postPath } from '@/lib/site';

const title = `Blog · ${PROFILE.name}`;
const description = `Writing by ${PROFILE.name} on healthcare AI, retrieval, and the systems behind them.`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: absoluteUrl('/blog/') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/blog/'),
    siteName: PROFILE.name,
    title,
    description,
    images: [{ url: '/media/portrait-lab.jpg', alt: PROFILE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/media/portrait-lab.jpg'],
  },
};

export default function BlogIndexPage() {
  const posts = getPosts();
  const showingDrafts = posts.some((post) => post.draft);

  return (
    <>
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Writing</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">Blog</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-mute">{description}</p>
      </header>

      {showingDrafts ? (
        <p className="mb-8 rounded-xl border border-hairline bg-panel px-4 py-3 text-sm leading-relaxed text-fg-mute">
          <span className="font-medium text-accent">Draft preview.</span> Posts marked Draft are left out of the
          production build, the sitemap, and the RSS feed.
        </p>
      ) : null}

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-panel px-6 py-16 text-center">
          <p className="font-display text-4xl italic">Nothing published yet.</p>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-fg-mute">
            New writing will show up here. Drafts stay off this page until they are published.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {posts.map((post) => (
            <li key={post.slug} className="py-8">
              <article>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <time className="font-mono text-xs uppercase tracking-[0.18em] text-fg-mute" dateTime={post.date}>
                    {formatPostDate(post.date)}
                  </time>
                  {post.draft ? (
                    <span className="rounded-full border border-accent px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                      Draft
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                  <Link href={postPath(post.slug)} className="transition-colors duration-150 hover:text-accent">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 text-base leading-relaxed text-fg-mute">{post.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-hairline px-2.5 py-1 text-xs text-fg-mute"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
