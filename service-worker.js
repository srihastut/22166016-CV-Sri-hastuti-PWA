const CACHE_NAME = 'my-site-cache-v1';
const assets = [
  "/",                     
  "/index.html",            
  "/style.css",             
  "/script.js",             
  "/manifest.json",         
  "/icon-192x192.png",      
  "/image.jpeg",            
  "/certificate1.png",      
  "/certificate2.png",      
  "/certificate3.png"       
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
        return response || fetch(event.request)
          .catch(() => caches.match('/offline.html'));
      })
  );
});

// Menangani pesan untuk menampilkan notifikasi
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const title = 'Hallo!';
    const options = {
      body: 'Selamat Datang di Web Portfolio Tuti. Terima kasih telah mengunjungi!',
      icon: '/icon-192x192.png'
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
    clients.openWindow('/') 
  );
});
