// Service Worker for AI Smart Unit Converter
// Handles background API updates and caching

const CACHE_NAME = 'ai-smart-converter-v1';
const API_CACHE_NAME = 'api-cache-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/stunning_converter.html',
                '/web_converter.html',
                '/index.html'
            ]);
        })
    );
});

// Fetch event - handle API requests and caching
self.addEventListener('fetch', (event) => {
    // Handle API requests
    if (event.request.url.includes('api.exchangerate-api.com') || 
        event.request.url.includes('api.coingecko.com') ||
        event.request.request.url.includes('api.coincap.io') ||
        event.request.url.includes('api.fixer.io')) {
        
        event.respondWith(
            caches.open(API_CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((response) => {
                    // Return cached response if available and not too old
                    if (response) {
                        const cacheTime = new Date(response.headers.get('sw-cache-time'));
                        const now = new Date();
                        const ageInMinutes = (now - cacheTime) / (1000 * 60);
                        
                        // Use cache if less than 5 minutes old
                        if (ageInMinutes < 5) {
                            return response;
                        }
                    }
                    
                    // Fetch fresh data
                    return fetch(event.request).then((response) => {
                        if (response.ok) {
                            // Clone response and add cache timestamp
                            const responseClone = response.clone();
                            const headers = new Headers(responseClone.headers);
                            headers.append('sw-cache-time', new Date().toISOString());
                            
                            const cachedResponse = new Response(responseClone.body, {
                                status: responseClone.status,
                                statusText: responseClone.statusText,
                                headers: headers
                            });
                            
                            cache.put(event.request, cachedResponse);
                        }
                        return response;
                    }).catch(() => {
                        // Return cached response if fetch fails
                        return response || new Response(JSON.stringify({ error: 'API unavailable' }), {
                            status: 503,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    });
                });
            })
        );
    }
    
    // Handle static assets
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Background sync for API updates
self.addEventListener('sync', (event) => {
    if (event.tag === 'update-rates') {
        event.waitUntil(updateRates());
    }
});

async function updateRates() {
    try {
        // Update currency rates
        const currencyResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (currencyResponse.ok) {
            const data = await currencyResponse.json();
            // Store in cache for main app to use
            const cache = await caches.open(API_CACHE_NAME);
            await cache.put('currency-rates', new Response(JSON.stringify(data)));
        }
        
        // Update crypto rates
        const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        if (cryptoResponse.ok) {
            const data = await cryptoResponse.json();
            const cache = await caches.open(API_CACHE_NAME);
            await cache.put('crypto-rates', new Response(JSON.stringify(data)));
        }
    } catch (error) {
        console.log('Background sync failed:', error);
    }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-rates') {
        event.waitUntil(updateRates());
    }
}); 