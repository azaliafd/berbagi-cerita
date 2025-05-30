import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(
  ({ url }) => url.origin.includes('dicoding') || url.pathname.startsWith('/v1/stories'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Notifikasi';
  const options = {
    body: data.body || 'Ada pesan baru untukmu!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
