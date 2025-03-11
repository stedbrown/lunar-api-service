const CACHE_NAME = 'lunar-api-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/moon-icon.png'
  // Rimosse le API che causano problemi con Clear-Site-Data
];

// Installazione del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta');
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Errore durante il caching delle risorse:', error);
          // Continua comunque l'installazione anche se alcune risorse non sono disponibili
        });
      })
  );
});

// Attivazione del Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Gestione delle richieste di rete
self.addEventListener('fetch', event => {
  // Ignora le richieste API che causano problemi con Clear-Site-Data
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - restituisci la risposta dalla cache
        if (response) {
          return response;
        }

        // Clona la richiesta
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Controlla se abbiamo ricevuto una risposta valida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona la risposta
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Aggiungi la risposta alla cache
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(error => {
          console.error('Errore durante il fetch:', error);
          // Fallback per le risorse non disponibili
          return new Response('Risorsa non disponibile', { status: 404 });
        });
      })
  );
}); 