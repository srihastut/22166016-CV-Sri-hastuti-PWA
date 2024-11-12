const CACHE_NAME = 'my-site-cache-v1';
const assets = [
  "https://sri-hastuti-pwa.vercel.app/",                     // Pastikan halaman utama tersedia
  "https://sri-hastuti-pwa.vercel.app/index.html",            // Halaman utama
  "https://sri-hastuti-pwa.vercel.app/style.css",             // File CSS
  "https://sri-hastuti-pwa.vercel.app/script.js",             // File JavaScript
  "https://sri-hastuti-pwa.vercel.app/manifest.json",         // File manifest
  "https://sri-hastuti-pwa.vercel.app/icon-192x192.png",      // Ikon untuk notifikasi dan manifest
  "https://sri-hastuti-pwa.vercel.app/image.jpeg",            // Gambar lainnya
  "https://sri-hastuti-pwa.vercel.app/certificate1.png",      // Sertifikat 1
  "https://sri-hastuti-pwa.vercel.app/certificate2.png",      // Sertifikat 2
  "https://sri-hastuti-pwa.vercel.app/certificate3.png"       // Sertifikat 3
];

self.addEventListener('install', event => {
  console.log('Service Worker Install Event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(assets);
      })
      .catch(error => {
        console.error('Failed to cache assets:', error);
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
    })
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
