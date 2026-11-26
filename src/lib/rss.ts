import 'server-only';

import { PROFILE } from '@/lib/content';
import { getPosts } from '@/lib/blog';
import { absoluteUrl, postPath } from '@/lib/site';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

/** RSS 2.0 feed of the posts included in this build. */
export function buildRss(): string {
  const posts = getPosts();
  const items = posts
    .map((post) => {
      const url = absoluteUrl(postPath(post.slug));
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n');
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <dc:creator>${escapeXml(post.author)}</dc:creator>
${categories}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(PROFILE.name)}</title>
    <link>${absoluteUrl('/blog/')}</link>
    <description>${escapeXml(`Writing by ${PROFILE.name} on healthcare AI, retrieval, and the systems behind them.`)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl('/rss.xml')}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
