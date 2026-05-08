import { createClient } from '@sanity/client';

/**
 * Sanity client configured via Vite env variables.
 * Set these in your .env file:
 *   VITE_SANITY_PROJECT_ID=your_project_id
 *   VITE_SANITY_DATASET=production
 *   VITE_SANITY_API_VERSION=2024-01-01   (optional, defaults to today)
 *   VITE_SANITY_TOKEN=your_token         (optional, only for private datasets)
 */
const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET ?? 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION ?? '2024-01-01',
  token: import.meta.env.VITE_SANITY_TOKEN, // leave unset for public datasets
  useCdn: true,
});

export { client };
export default client;
