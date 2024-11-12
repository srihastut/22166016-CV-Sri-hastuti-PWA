const CACHE_NAME = 'my-site-cache-v1';
const assets = [
  "/22166015-CV-Sri-hastuti-PWA/",                     // Pastikan halaman utama tersedia
  "/22166015-CV-Sri-hastuti-PWA/index.html",            // Halaman utama
  "/22166015-CV-Sri-hastuti-PWA/style.css",             // File CSS
  "/22166015-CV-Sri-hastuti-PWA/script.js",             // File JavaScript
  "/22166015-CV-Sri-hastuti-PWA/manifest.json",         // File manifest
  "/22166015-CV-Sri-hastuti-PWA/icon-192x192.png",      // Ikon untuk notifikasi dan manifest
  "/22166015-CV-Sri-hastuti-PWA/image.jpeg",            // Gambar lainnya
  "/22166015-CV-Sri-hastuti-PWA/certificate1.png",      // Sertifikat 1
  "/22166015-CV-Sri-hastuti-PWAo/certificate2.png",      // Sertifikat 2
  "/22166015-CV-Sri-hastuti-PWA/certificate3.png"       // Sertifikat 3
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
        // Jika ada di cache, return file dari cache
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, fetch dari network
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
      icon: '/uts-protofolio/icon-192x192.png' // Path ikon diperbaiki
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
  event.notification.close(); // Menutup notifikasi saat diklik
  event.waitUntil(
    clients.openWindow('https://srihastut.github.io/22166015-CV-Sri-hastuti-PWA/') // URL yang benar untuk membuka portfolio
  );
});
