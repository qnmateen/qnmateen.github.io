import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/blog';
import { absoluteUrl, postPath } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const newest = posts[0]?.date;

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: absoluteUrl('/blog/'),
      changeFrequency: 'weekly',
      priority: 0.8,
      ...(newest ? { lastModified: new Date(`${newest}T00:00:00Z`) } : {}),
    },
  ];

  for (const post of posts) {
    entries.push({
      url: absoluteUrl(postPath(post.slug)),
      lastModified: new Date(`${post.date}T00:00:00Z`),
      changeFrequency: 'yearly',
      priority: 0.6,
    });
  }

  return entries;
}
