import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { PROFILE } from '@/lib/content';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-root min-h-svh">
      <Nav home={false} />
      <div className="blog-frame">
        {children}
        <footer className="blog-footer">
          <nav aria-label="Footer" className="flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/blog/">All posts</Link>
            <a href="/rss.xml">RSS</a>
          </nav>
          <p>{PROFILE.name}</p>
        </footer>
      </div>
    </div>
  );
}
