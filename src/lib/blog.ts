import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

/**
 * Static export cannot prerender a dynamic route with zero paths.
 * When every post is a draft, this slug is emitted as a noindex 404 stand-in.
 * It is not a real post and it cannot collide with a front-matter slug.
 */
export const EMPTY_ROUTE_SLUG = '_unpublished';
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type BlogPost = {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  author: string;
  draft: boolean;
  canonicalUrl?: string;
  cover?: string;
  content: string;
};

/**
 * Drafts are omitted from production builds (index, pages, sitemap, RSS).
 * `next dev` includes them. Set `BLOG_INCLUDE_DRAFTS=true` to force them on
 * (including `next build`) or `false` to force them off.
 */
export function includeDrafts(): boolean {
  const flag = process.env.BLOG_INCLUDE_DRAFTS?.trim().toLowerCase();
  if (flag === '1' || flag === 'true' || flag === 'yes') return true;
  if (flag === '0' || flag === 'false' || flag === 'no') return false;
  return process.env.NODE_ENV !== 'production';
}

function fail(file: string, message: string): never {
  throw new Error(`content/blog/${file}: ${message}`);
}

function asDateString(value: unknown, file: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const iso = value.toISOString().slice(0, 10);
    return asDateString(iso, file);
  }
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) {
    fail(file, 'date must be YYYY-MM-DD');
  }
  const [year, month, day] = value.split('-').map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    fail(file, `invalid date "${value}"`);
  }
  return value;
}

function asNonEmptyString(value: unknown, file: string, key: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(file, `${key} must be a non-empty string`);
  }
  return value.trim();
}

function asTags(value: unknown, file: string): string[] {
  if (!Array.isArray(value) || value.length === 0 || value.some((tag) => typeof tag !== 'string' || tag.trim() === '')) {
    fail(file, 'tags must be a non-empty list of strings');
  }
  return value.map((tag) => tag.trim());
}

function asOptionalUrl(value: unknown, file: string, key: string, allowSitePath: boolean): string | undefined {
  if (value == null || value === '') return undefined;
  if (typeof value !== 'string') fail(file, `${key} must be a string`);
  const trimmed = value.trim();
  if (allowSitePath && trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol === 'http:' || url.protocol === 'https:') return trimmed;
  } catch {
    /* fall through */
  }
  fail(
    file,
    allowSitePath
      ? `${key} must be a root-relative path (/media/cover.jpg) or an http(s) URL`
      : `${key} must be an http(s) URL`,
  );
}

function parsePost(fileName: string, raw: string): BlogPost {
  let parsed: { data: Record<string, unknown>; content: string };
  try {
    const file = matter(raw);
    parsed = { data: file.data as Record<string, unknown>, content: file.content };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'could not parse front matter';
    fail(fileName, message);
  }

  const data = parsed.data;
  const slug = asNonEmptyString(data.slug, fileName, 'slug');
  if (!SLUG_PATTERN.test(slug)) {
    fail(fileName, 'slug must be lowercase words separated by hyphens');
  }

  if (typeof data.draft !== 'boolean') {
    fail(fileName, 'draft must be true or false');
  }

  return {
    title: asNonEmptyString(data.title, fileName, 'title'),
    slug,
    date: asDateString(data.date, fileName),
    description: asNonEmptyString(data.description, fileName, 'description'),
    tags: asTags(data.tags, fileName),
    author: asNonEmptyString(data.author, fileName, 'author'),
    draft: data.draft,
    canonicalUrl: asOptionalUrl(data.canonical_url, fileName, 'canonical_url', false),
    cover: asOptionalUrl(data.cover, fileName, 'cover', true),
    content: parsed.content.replace(/^\n+/, '').replace(/\s+$/, '\n'),
  };
}

function readAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const fileNames = fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith('.md') && !name.startsWith('_') && !name.startsWith('.'));

  const posts = fileNames.map((fileName) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), 'utf8');
    return parsePost(fileName, raw);
  });

  const seen = new Set<string>();
  for (const post of posts) {
    if (seen.has(post.slug)) fail(`${post.slug}.md`, `duplicate slug "${post.slug}"`);
    seen.add(post.slug);
  }

  posts.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.title.localeCompare(b.title);
  });

  return posts;
}

/** Posts that should be rendered for this build. */
export function getPosts(): BlogPost[] {
  const posts = readAllPosts();
  if (includeDrafts()) return posts;
  return posts.filter((post) => !post.draft);
}

export function getPost(slug: string): BlogPost | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export function formatPostDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
