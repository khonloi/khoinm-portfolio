import { useMemo } from "react";
import { useSanityQuery } from "../../hooks/useSanityQuery";

// ─── GROQ Query ───────────────────────────────────────────────────────────────
// Maps the Sanity "newsArticle" schema to the shape News.jsx expects:
//   { _id, category, title, source, date, summary, body }
const NEWS_QUERY = `*[_type == "newsArticle"] | order(publishedAt desc) {
  _id,
  "id": _id,
  category,
  title,
  isLeadership,
  source,
  "date": coalesce(
    dateTime(publishedAt),
    publishedAt
  ),
  summary,
  body
}`;

export interface NewsArticle {
  id?: string | number;
  _id?: string;
  category: string;
  title: string;
  source: string;
  date: string;
  isLeadership?: boolean;
  summary: string;
  body: string | unknown;
}

/**
 * Fetches news articles from Sanity.
 * Falls back to the provided `fallbackArticles` if the project ID is not
 * configured or the request fails (keeps the mock data working in dev).
 *
 * @param fallbackArticles - Local mock articles to use when Sanity is unavailable.
 * @returns {{ articles, isLoading, error, refetch }}
 */
export function useNews(fallbackArticles: NewsArticle[] = []) {
  const transform = useMemo(
    () => (data: unknown): NewsArticle[] => {
      if (!Array.isArray(data)) return fallbackArticles;
      const normalised = data.map((article: Record<string, unknown>) => ({
        ...article,
        id: (article.id as string | number) || (article._id as string),
        category: String(article.category || ''),
        title: String(article.title || ''),
        source: String(article.source || ''),
        summary: String(article.summary || ''),
        body: typeof article.body === 'string' ? article.body : (article.body ?? ''),
        date: article.date
          ? new Date(article.date as string | number).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Unknown date",
      }));
      return normalised.length > 0 ? (normalised as NewsArticle[]) : fallbackArticles;
    },
    [fallbackArticles]
  );

  const { data: articles, isLoading, error, refetch } = useSanityQuery<NewsArticle[]>({
    query: NEWS_QUERY,
    initialData: fallbackArticles,
    transform,
  });

  return { articles, isLoading, error, refetch };
}
