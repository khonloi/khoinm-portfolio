import { useState, useEffect, useCallback } from "react";
import client from "../../lib/sanityClient";

/**
 * GROQ Query for About Information
 * Expects a single document of type "aboutInfo"
 */
const ABOUT_QUERY = `*[_type == "aboutInfo"][0] {
  name,
  tagline,
  "portraitUrl": portrait.asset->url,
  aboutMe,
  experience[] {
    jobTitle,
    company,
    date,
    bullets
  }
}`;

/**
 * Hook to fetch About Information from Sanity.
 * Falls back to local data if Sanity is unavailable.
 * 
 * @param {Object} fallbackData - The hardcoded data to use as fallback
 * @returns {{ data, isLoading, error, refetch }}
 */
export function useAbout(fallbackData) {
  const [data, setData] = useState(fallbackData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isSanityConfigured = Boolean(import.meta.env.VITE_SANITY_PROJECT_ID);

  const fetchData = useCallback(async () => {
    if (!isSanityConfigured) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await client.fetch(ABOUT_QUERY);
      if (result) {
        // Ensure structure matches what About.jsx expects
        setData(result);
      }
    } catch (err) {
      console.error("[useAbout] Failed to fetch About from Sanity:", err);
      setError(err);
      setData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  }, [isSanityConfigured, fallbackData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
