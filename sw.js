const CACHE_NAME = 'electricity-calculator-v2'; // ژمارەی ڤێرژن زیادکرا بۆ نوێبوونەوە
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap'
];

// دامەزراندنی Service Worker و کاشکردنی فایلە سەرەکییەکان
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      console.log('Opened cache and caching assets');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// کاراکردنی Service Worker و سڕینەوەی کاشی کۆن
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// وەڵامدانەوەی داواکارییەکان
self.addEventListener('fetch', event => {
  // تەنها داواکارییەکانی GET وەڵام دەدرێتەوە
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
    .then(cachedResponse => {
      // ئەگەر لە کاشدا هەبوو، ڕاستەوخۆ دەینێرینەوە
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // ئەگەر لە کاشدا نەبوو، لە تۆڕەوە داوای دەکەین
      return fetch(event.request).catch(() => {
        // ئەگەر داواکارییەکەش فەشەلی هێنا (بۆ نموونە ئینتەرنێت نەبوو)
        // دەتوانین لاپەڕەیەکی ئۆفلاینی بنەڕەتی نیشان بدەین
        // لێرەدا هیچی تر ناکەین چونکە فایلە سەرەکییەکانمان کاش کردووە
      });
    })
  );
});