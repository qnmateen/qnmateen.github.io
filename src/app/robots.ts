import type { MetadataRoute } from 'next';
import { EMPTY_ROUTE_SLUG, getPosts } from '@/lib/blog';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const hiddenPlaceholder = getPosts().length === 0;
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      ...(hiddenPlaceholder ? { disallow: `/blog/${EMPTY_ROUTE_SLUG}` } : {}),
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
