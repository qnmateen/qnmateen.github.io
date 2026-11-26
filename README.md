This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Blog

Posts are Markdown files in `content/blog/` with YAML front matter:

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Shown on the index, the post, and in `<title>` |
| `slug` | yes | URL segment, lowercase words and hyphens: `/blog/<slug>/` |
| `date` | yes | `YYYY-MM-DD`. Newest first |
| `description` | yes | Index excerpt and meta description |
| `tags` | yes | List of strings |
| `author` | yes | Byline |
| `draft` | yes | `true` or `false` |
| `canonical_url` | no | Absolute URL. Leave unset to canonicalise to this site (`https://qnmateen.github.io/blog/<slug>/`), which is what you paste into dev.to when cross-posting |
| `cover` | no | Root-relative path (`/media/cover.jpg`) or absolute URL, used as the Open Graph image |

Name the file `content/blog/<slug>.md`. The body is Markdown (headings, tables, fenced code, quotes, links, images). A fenced block with a language tag is syntax-highlighted; a fence with no language stays plain text, which is what you want for ASCII diagrams.

### Preview drafts

`draft: true` leaves a post out of the production build: it is not on `/blog`, it has no page, and it is not in `/sitemap.xml` or `/rss.xml`.

`npm run dev` includes drafts so you can read them at `http://localhost:3000/blog/`. To preview the static export the same way, or to force drafts off during dev:

```bash
BLOG_INCLUDE_DRAFTS=true npm run build
BLOG_INCLUDE_DRAFTS=false npm run dev
```

### Publish

Set `draft: false` and merge to `main`. The GitHub Pages workflow runs `npm run build` and deploys `out/`. The post's canonical URL is `https://qnmateen.github.io/blog/<slug>/`. Use that as `canonical_url` on dev.to. The feed is at `/rss.xml`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
