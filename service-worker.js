const CACHE_NAME = 'my-site-cache-v1';
const assets = [
  "/",                     // Pastikan halaman utama tersedia
  "/index.html",            // Halaman utama
  "/style.css",             // File CSS
  "/script.js",             // File JavaScript
  "/manifest.json",         // File manifest
  "/icon-192x192.png",      // Ikon untuk notifikasi dan manifest
  "/image.jpeg",            // Gambar lainnya
  "/certificate1.png",      // Sertifikat 1
  "/certificate2.png",      // Sertifikat 2
  "/certificate3.png"       // Sertifikat 3
];

self.addEventListener('install', event => {
  console.log('Service Worker Install Event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return Promise.all(
          assets.map(asset => {
            return cache.add(asset).catch(error => {
              console.error(`Failed to cache ${asset}:`, error);
            });
          })
        );
      })
      .then(() => {
        console.log('Assets cached successfully');
      })
      .catch(error => {
        console.error('Failed to open cache:', error);
      })
  );
});


// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch dan cek apakah file ada di cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }).catch(error => {
        console.error('Fetch failed; returning offline page instead.', error);
      })
  );
});

// Menangani pesan untuk menampilkan notifikasi
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const title = 'Hallo!';
    const options = {
      body: 'Selamat Datang di Web Portfolio Tuti. Terima kasih telah mengunjungi!',
      icon: '/icon-192x192.png' // Path ikon diperbaiki
    };

    if (Notification.permission === 'granted') {
      self.registration.showNotification(title, options);
    } else {
      console.error('Izin notifikasi belum diberikan.');
    }
  }
});

// Menangani klik pada notifikasi
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // URL relatif ke halaman utama
  );
});
