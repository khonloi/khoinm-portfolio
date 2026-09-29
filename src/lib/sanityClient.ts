import { createClient, type SanityClient } from '@sanity/client';

/**
 * Sanity client configured via Vite env variables.
 * Set these in your .env file:
 *   VITE_SANITY_PROJECT_ID=your_project_id
 *   VITE_SANITY_DATASET=production
 *   VITE_SANITY_API_VERSION=2024-01-01   (optional, defaults to today)
 */
const client: SanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET ?? 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION ?? '2024-01-01',
  // Token intentionally excluded from client bundle for security.
  // For public datasets, useCdn:true is sufficient.
  // For private datasets, proxy through a Vercel serverless function.
  useCdn: true,
});

export { client };
export default client;
