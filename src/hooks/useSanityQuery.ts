import { useState, useEffect, useCallback } from 'react';
import client from '../lib/sanityClient';

export interface UseSanityQueryOptions<T, R = T> {
  query: string;
  params?: Record<string, unknown>;
  initialData: T;
  transform?: (data: unknown) => R;
  enabled?: boolean;
}

export interface UseSanityQueryResult<T, R> {
  data: R | T;
  isLoading: boolean;
  error: unknown | null;
  refetch: () => Promise<void>;
}

/**
 * Generic reusable hook for querying Sanity CMS data with graceful fallback and error handling.
 */
export function useSanityQuery<T, R = T>({
  query,
  params,
  initialData,
  transform,
  enabled = true,
}: UseSanityQueryOptions<T, R>): UseSanityQueryResult<T, R> {
  const [data, setData] = useState<R | T>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  const isSanityConfigured = Boolean(import.meta.env.VITE_SANITY_PROJECT_ID);

  const execute = useCallback(async () => {
    if (!enabled || !isSanityConfigured) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await client.fetch(query, params);
      if (result !== null && result !== undefined) {
        const transformed = transform ? transform(result) : (result as R);
        setData(transformed);
      }
    } catch (err) {
      console.warn('[useSanityQuery] Failed to fetch data from Sanity:', err);
      setError(err);
      setData(initialData);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, isSanityConfigured, query, params, transform, initialData]);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    data,
    isLoading,
    error,
    refetch: execute,
  };
}
