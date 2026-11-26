import 'server-only';

import type { Element, Root } from 'hast';
import rehypeShiki from '@shikijs/rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const SAFE_LINK = /^(https?:|mailto:)/i;

function isSafeHref(href: string): boolean {
  if (href.startsWith('#') || href.startsWith('./') || href.startsWith('../')) return true;
  if (href.startsWith('/') && !href.startsWith('//')) return true;
  return SAFE_LINK.test(href);
}

/** Tables scroll instead of stretching the page. Links and images stay on safe URLs. */
function rehypeArticle() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName === 'table' && parent && index != null) {
        const wrapped =
          parent.type === 'element' &&
          parent.tagName === 'div' &&
          classList(parent).includes('table-scroll');
        if (!wrapped) {
          parent.children[index] = {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-scroll'] },
            children: [node],
          };
        }
      }

      if (node.tagName === 'pre' && node.properties.tabIndex == null) {
        node.properties.tabIndex = 0;
      }

      if (node.tagName === 'a') {
        const href = typeof node.properties.href === 'string' ? node.properties.href : '';
        if (!isSafeHref(href)) {
          node.tagName = 'span';
          delete node.properties.href;
          return;
        }
        if (/^https?:/i.test(href)) {
          node.properties.target = '_blank';
          node.properties.rel = ['noopener', 'noreferrer'];
        }
      }

      if (node.tagName === 'img') {
        const src = typeof node.properties.src === 'string' ? node.properties.src : '';
        if (!isSafeHref(src) || src.startsWith('mailto:') || src.startsWith('#')) {
          const alt = typeof node.properties.alt === 'string' ? node.properties.alt : '';
          node.tagName = 'span';
          node.properties = {};
          node.children = alt ? [{ type: 'text', value: alt }] : [];
          return;
        }
        node.properties.loading = 'lazy';
        node.properties.decoding = 'async';
      }
    });
  };
}

function classList(node: Element): string[] {
  const value = node.properties.className;
  return Array.isArray(value) ? value.map(String) : [];
}

let processor: ReturnType<typeof createProcessor> | null = null;

function createProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeShiki, {
      theme: 'github-dark',
      langs: [
        'javascript',
        'js',
        'jsx',
        'typescript',
        'ts',
        'tsx',
        'json',
        'yaml',
        'yml',
        'python',
        'py',
        'bash',
        'sh',
        'shell',
        'shellscript',
        'html',
        'css',
        'sql',
        'markdown',
        'md',
        'diff',
        'go',
        'rust',
        'toml',
        'xml',
        'java',
        'c',
        'cpp',
        'ruby',
      ],
    })
    .use(rehypeArticle)
    .use(rehypeStringify);
}

/** Markdown to HTML. Raw HTML in the source is escaped. Unlabelled fences stay plain text. */
export async function renderMarkdown(markdown: string): Promise<string> {
  processor ??= createProcessor();
  const file = await processor.process(markdown);
  return String(file);
}
