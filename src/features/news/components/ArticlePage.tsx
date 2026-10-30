import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react';
import type { NewsArticle } from '../useNews';
import { HOME_PAGE_ID } from '../hooks/useBrowserHistory';

export interface ArticlePageProps {
  article: NewsArticle;
  onNavigate: (pageId: string | number) => void;
}

const portableComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-xl font-bold mt-6 mb-3 border-b border-windows-grey-dark pb-1">{children}</h1>
    ),
    h2: ({ children }) => <h2 className="text-lg font-bold mt-5 mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-base font-bold mt-4 mb-2">{children}</h3>,
    normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-windows-grey-dark pl-4 italic my-4">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => (
      <a
        className="text-[#000080] underline hover:text-[#800000]"
        href={typeof value?.href === 'string' ? value.href : undefined}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    code: ({ children }) => <code className="bg-windows-grey px-1 rounded-sm">{children}</code>,
  },
};

export const ArticlePage = memo<ArticlePageProps>(({ article, onNavigate }) => (
  <div className="p-6 max-w-[760px]">
    <button
      className="inline-block mb-4 text-sm text-[#000080] bg-transparent border-none p-0 cursor-pointer underline hover:text-[#800000] font-main"
      onClick={() => onNavigate(HOME_PAGE_ID)}
    >
      ← Back to News
    </button>
    <span className="block text-xs font-bold text-windows-white bg-windows-blue-bright px-1 py-0.5 mb-2 w-fit uppercase tracking-wider">
      {article.category}
    </span>
    <h1
      className={`m-0 mt-2 mb-2 text-2xl font-bold leading-snug ${
        article.isLeadership ? 'text-[#ff0000]' : 'text-windows-black'
      }`}
    >
      {article.title}
    </h1>
    <div className="text-sm text-windows-grey-dark mb-3">
      {article.source} &middot; {article.date}
    </div>
    <div className="text-base leading-relaxed text-windows-black news-markdown">
      {typeof article.body === 'string' ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ ...props }) => (
              <h1 className="text-xl font-bold mt-6 mb-3 border-b border-windows-grey-dark pb-1" {...props} />
            ),
            h2: ({ ...props }) => <h2 className="text-lg font-bold mt-5 mb-2" {...props} />,
            h3: ({ ...props }) => <h3 className="text-base font-bold mt-4 mb-2" {...props} />,
            p: ({ ...props }) => <p className="mb-4 last:mb-0" {...props} />,
            ul: ({ ...props }) => <ul className="list-disc ml-6 mb-4 space-y-1" {...props} />,
            ol: ({ ...props }) => <ol className="list-decimal ml-6 mb-4 space-y-1" {...props} />,
            li: ({ ...props }) => <li className="pl-1" {...props} />,
            a: ({ ...props }) => (
              <a className="text-[#000080] underline hover:text-[#800000]" target="_blank" rel="noopener noreferrer" {...props} />
            ),
            blockquote: ({ ...props }) => (
              <blockquote className="border-l-4 border-windows-grey-dark pl-4 italic my-4" {...props} />
            ),
            code: ({ inline, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) =>
              inline ? (
                <code className="bg-windows-grey px-1 rounded-sm" {...props} />
              ) : (
                <code className="block bg-windows-grey p-3 rounded-sm border border-windows-grey-dark overflow-x-auto my-4" {...props} />
              ),
            hr: ({ ...props }) => <hr className="border-windows-grey-dark my-6" {...props} />,
          }}
        >
          {article.body}
        </ReactMarkdown>
      ) : (
        <PortableText
          value={article.body as PortableTextBlock[]}
          components={portableComponents}
        />
      )}
    </div>
  </div>
));

ArticlePage.displayName = 'ArticlePage';
export default ArticlePage;
