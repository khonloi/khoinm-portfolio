import { useState, useEffect, useCallback } from 'react';
import client from '../lib/sanityClient';

const STATUS_QUERY = `{
  "serviceStatus": *[_type == "serviceStatus"][0] { isAvailable, statusText },
  "aboutInfo": *[_type == "aboutInfo"][0] { isAvailable }
}`;

export function useServiceStatus(defaultAvailable = true) {
  const [isAvailable, setIsAvailable] = useState(defaultAvailable);
  const [statusText, setStatusText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isSanityConfigured = Boolean(import.meta.env.VITE_SANITY_PROJECT_ID);

  const fetchStatus = useCallback(async () => {
    if (!isSanityConfigured) return;

    setIsLoading(true);
    try {
      const data = await client.fetch(STATUS_QUERY);
      if (data) {
        if (data.serviceStatus && typeof data.serviceStatus.isAvailable === 'boolean') {
          setIsAvailable(data.serviceStatus.isAvailable);
          if (data.serviceStatus.statusText) {
            setStatusText(data.serviceStatus.statusText);
          }
        } else if (data.aboutInfo && typeof data.aboutInfo.isAvailable === 'boolean') {
          setIsAvailable(data.aboutInfo.isAvailable);
        }
      }
    } catch (err) {
      console.error('[useServiceStatus] Failed to fetch status from Sanity:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isSanityConfigured]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { isAvailable, statusText, isLoading, refetch: fetchStatus };
}
