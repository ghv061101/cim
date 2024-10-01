const CACHE_NAME = 'chemicals-inventory-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/bootstrap.min.css',
    '/js/script.js',
    '/data/data.json',
   
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
