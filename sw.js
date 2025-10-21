const versao = '0.0.1';
const arquivos = [
    'favicon.ico',
    'offline.html',

    '/img/icon_16.png',
    '/img/icon_32.png',
    '/img/icon_57.png',
    '/img/icon_60.png',
    '/img/icon_72.png',
    '/img/icon_76.png',
    '/img/icon_144.png',
    '/img/icon_256.png',
    '/img/icon_512.png',
    '/img/soundbars.webp',
    '/img/screenshot.webp',
];

self.addEventListener('install', event => {
    //console.log('SW: install');
    event.waitUntil(
        caches.open(versao).then(cache => {
            cache.addAll(arquivos);
        }).then(event => {
            self.skipWaiting();
        })
    );
});

self.addEventListener('activate', event => {
    //console.log('SW: activate');
    event.waitUntil(
        caches.keys().then(versoes => {
            return Promise.all(versoes.map(versaoAntiga => {
                if(versaoAntiga !== versao) {
                    console.log(`SW: apagou a versão ${versaoAntiga}`);
                    return caches.delete(versaoAntiga);
                }
            }));
        })
    );
});

 self.addEventListener('fetch', event => {
    //console.log("SW: fetch", event.request.url);
    event.respondWith(
        (async () => {
            const cache = await caches.open(versao);
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                //console.log('retornou do cache',event.request.url);
                event.waitUntil(cache.add(event.request));
                return cachedResponse;
            }
            try {
                const networkResponse = await fetch(event.request);
                return networkResponse;
            } catch (error) {
                const cache = await caches.open(versao);
                const offlinePage = await cache.match('/offline.html'); // A pre-cached offline page
                return offlinePage || new Response('<h1>Você está offline!</h1>', { headers: { 'Content-Type': 'text/html' } });
            }
        })()
    );
});
