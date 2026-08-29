import { useState, useEffect, useCallback } from "react";
import client from "../../lib/sanityClient";

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

/**
 * Fetches news articles from Sanity.
 * Falls back to the provided `fallbackArticles` if the project ID is not
 * configured or the request fails (keeps the mock data working in dev).
 *
 * @param {Array} fallbackArticles - Local mock articles to use when Sanity is unavailable.
 * @returns {{ articles, isLoading, error, refetch }}
 */
export function useNews(fallbackArticles = []) {
  const [articles, setArticles] = useState(fallbackArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isSanityConfigured = Boolean(import.meta.env.VITE_SANITY_PROJECT_ID);

  const fetchArticles = useCallback(async () => {
    if (!isSanityConfigured) return; // silently use fallback

    setIsLoading(true);
    setError(null);

    try {
      const data = await client.fetch(NEWS_QUERY);

      // Normalise the date string from ISO to a human-readable format
      const normalised = data.map((article) => ({
        ...article,
        date: article.date
          ? new Date(article.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Unknown date",
      }));

      setArticles(normalised.length > 0 ? normalised : fallbackArticles);
    } catch (err) {
      console.error("[useNews] Failed to fetch from Sanity:", err);
      setError(err);
      setArticles(fallbackArticles); // degrade gracefully
    } finally {
      setIsLoading(false);
    }
  }, [isSanityConfigured]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, isLoading, error, refetch: fetchArticles };
}
