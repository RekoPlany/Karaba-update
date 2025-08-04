// ناوی کاشەکەمان گۆڕی بۆ ئەوەی براوزەر ناچار بکەین وەشانە نوێیەکە دابگرێت
const CACHE_NAME = 'karaba-cache-v5'; 
const urlsToCache = [
  '/Karaba/',
  '/Karaba/index.html',
  '/Karaba/icon-192.png',
  '/Karaba/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap'
];

// دانانی Service Worker و پاشەکەوتکردنی فایلەکان
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened and updated');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// پاککردنەوەی کاشە کۆنەکان
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// وەڵامدانەوە بە فایلە پاشەکەوتکراوەکان
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ئەگەر لەناو کاشدا بوو، بیگەڕێنەرەوە
        if (response) {
          return response;
        }
        // ئەگەرنا، داوای بکە لەسەر ئینتەرنێت
        return fetch(event.request);
      })
  );
});
