import { useSanityQuery } from '../../hooks/useSanityQuery';

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

export interface ExperienceItem {
  jobTitle: string;
  company: string;
  date: string;
  bullets?: string[];
}

export interface AboutData {
  name: string;
  tagline: string;
  portraitUrl?: string | null;
  aboutMe?: unknown;
  experience?: ExperienceItem[];
  [key: string]: unknown;
}

/**
 * Hook to fetch About Information from Sanity.
 * Falls back to local data if Sanity is unavailable.
 *
 * @param fallbackData - The hardcoded data to use as fallback
 * @returns {{ data, isLoading, error, refetch }}
 */
export function useAbout(fallbackData: AboutData) {
  return useSanityQuery<AboutData>({
    query: ABOUT_QUERY,
    initialData: fallbackData,
  });
}
