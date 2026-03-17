const CACHE_NAME = 'tapwalk-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
            return response;
        }
        return fetch(event.request).then(networkResponse => {
            if (event.request.url.startsWith('http') && networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
        }).catch(() => {
            // Offline fallback
        });
      })
  );
});