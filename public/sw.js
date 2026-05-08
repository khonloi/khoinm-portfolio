// Service Worker with Network-First Strategy
// Cache version - automatically updated on each build
const CACHE_VERSION = 'hayami-v' + new Date().getTime();
const CACHE_NAME = CACHE_VERSION;

// Critical resources to cache
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico'
];

// Network timeout (ms) - fall back to cache if network takes too long
const NETWORK_TIMEOUT = 3000;

// Install event - cache critical resources and skip waiting
self.addEventListener('install', (event) => {
  console.log('[SW] Installing new service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching critical resources');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating new service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - NETWORK FIRST strategy with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    // Try network first with timeout
    Promise.race([
      fetch(request)
        .then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Update cache in background
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
            })
            .catch((err) => {
              console.warn('[SW] Cache update failed:', err);
            });

          return response;
        }),
      // Timeout fallback
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT)
      )
    ])
    .catch(() => {
      // Network failed or timed out - try cache
      return caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache (offline):', request.url);
            return cachedResponse;
          }
          
          // No cache available either
          console.warn('[SW] No cache available for:', request.url);
          return new Response('Offline - No cached version available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
    })
  );
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 