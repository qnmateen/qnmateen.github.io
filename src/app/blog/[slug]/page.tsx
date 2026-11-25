import type { Metadata } from 'next';
import Link from 'next/link';
import { PROFILE } from '@/lib/content';
import { EMPTY_ROUTE_SLUG, formatPostDate, getPost, getPosts } from '@/lib/blog';
import { renderMarkdown } from '@/lib/markdown';
import { postCanonical } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getPosts();
  if (posts.length === 0) return [{ slug: EMPTY_ROUTE_SLUG }];
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return {
      title: { absolute: `Not found · ${PROFILE.name}` },
      robots: { index: false, follow: false },
    };
  }

  const canonical = postCanonical(post);
  const title = `${post.title} · ${PROFILE.name}`;
  const image = post.cover ?? '/media/portrait-lab.jpg';

  return {
    title: { absolute: title },
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    alternates: { canonical },
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article',
      url: canonical,
      siteName: PROFILE.name,
      title: post.title,
      description: post.description,
      publishedTime: `${post.date}T00:00:00.000Z`,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: image, alt: post.cover ? post.title : PROFILE.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return (
      <div className="py-16">
        <h1 className="font-display text-4xl italic">This page could not be found.</h1>
        <p className="mt-4 leading-relaxed text-fg-mute">There is no published post at this address.</p>
        <p className="mt-6">
          <Link href="/blog/" className="text-accent">
            Back to the blog
          </Link>
        </p>
      </div>
    );
  }

  const html = await renderMarkdown(post.content);

  return (
    <article>
      <p className="text-sm">
        <Link href="/blog/" className="text-accent transition-colors duration-150 hover:text-fg">
          ← Blog
        </Link>
      </p>
      <h1 className="mt-4 text-3xl font-semibold leading-[1.15] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
      <p className="mt-5 text-lg leading-relaxed text-fg-mute">{post.description}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-hairline py-4">
        <time className="font-mono text-xs uppercase tracking-[0.18em] text-fg-mute" dateTime={post.date}>
          {formatPostDate(post.date)}
        </time>
        <span className="text-fg-mute" aria-hidden>
          ·
        </span>
        <span className="text-sm text-fg-mute">{post.author}</span>
        {post.draft ? (
          <span className="rounded-full border border-accent px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
            Draft
          </span>
        ) : null}
      </div>

      {post.draft ? (
        <p className="mt-6 rounded-xl border border-hairline bg-panel px-4 py-3 text-sm leading-relaxed text-fg-mute">
          <span className="font-medium text-accent">Draft.</span> This page is omitted from the production build until{' '}
          <code className="font-mono text-fg">draft</code> is set to false.
        </p>
      ) : null}

      <ul className="mt-5 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-hairline px-2.5 py-1 text-xs text-fg-mute">
            {tag}
          </li>
        ))}
      </ul>

      <div className="prose mt-10" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
