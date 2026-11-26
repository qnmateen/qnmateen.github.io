/** Canonical origin for this GitHub Pages site. No project subpath. */
export const SITE_URL = 'https://qnmateen.github.io';

/** Absolute URL for a site path (`/blog/slug/`) or an already-absolute URL. */
export function absoluteUrl(pathname: string): string {
  if (/^https?:\/\//i.test(pathname)) return pathname;
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(path, SITE_URL).href;
}

export function postPath(slug: string): string {
  return `/blog/${slug}/`;
}

/**
 * Canonical URL for a post. Defaults to this site so cross-posts (dev.to)
 * can point back here. An explicit `canonical_url` in front matter wins.
 */
export function postCanonical(post: { slug: string; canonicalUrl?: string }): string {
  return post.canonicalUrl ?? absoluteUrl(postPath(post.slug));
}
