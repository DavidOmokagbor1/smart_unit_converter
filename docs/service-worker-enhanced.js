// Enhanced Service Worker for AI Smart Unit Converter
// Provides offline functionality, background sync, and push notifications

const CACHE_NAME = 'ai-smart-converter-v2';
const API_CACHE_NAME = 'api-cache-v2';
const STATIC_CACHE_NAME = 'static-cache-v2';

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then((cache) => {
            // Cache only essential files that exist
            // Use add() instead of addAll() to handle missing files gracefully
            const filesToCache = [
                './',
                './index.html',
                './manifest.json'
            ];
            
            // Cache files one by one to handle failures gracefully
            return Promise.allSettled(
                filesToCache.map(url => 
                    cache.add(url).catch(err => {
                        console.log(`Failed to cache ${url}:`, err.message);
                        return null; // Continue even if one file fails
                    })
                )
            ).then(() => {
                // Also try to cache optional files if they exist
                const optionalFiles = [
                    './security_utils.js',
                    './draggable_categories.js',
                    './user_friendly_preferences.js',
                    './icons/icon-192x192.png',
                    './icons/icon-512x512.png'
                ];
                
                return Promise.allSettled(
                    optionalFiles.map(url => 
                        cache.add(url).catch(() => null) // Silently fail for optional files
                    )
                );
            }).then(() => {
                console.log('Service Worker cache populated');
                return self.skipWaiting();
            });
        }).catch((error) => {
            console.error('Service Worker installation failed:', error);
            // Still skip waiting to activate even if cache fails
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            const validCaches = [CACHE_NAME, API_CACHE_NAME, STATIC_CACHE_NAME];
            const deletePromises = cacheNames
                .filter((cacheName) => !validCaches.includes(cacheName))
                .map((cacheName) => {
                    console.log('Deleting old cache:', cacheName);
                    return caches.delete(cacheName).catch((err) => {
                        console.log(`Failed to delete cache ${cacheName}:`, err.message);
                        return null; // Continue even if deletion fails
                    });
                });
            
            return Promise.all(deletePromises);
        }).then(() => {
            console.log('Service Worker activated, claiming clients');
            return self.clients.claim();
        }).catch((error) => {
            console.error('Service Worker activation failed:', error);
            // Still claim clients even if cache cleanup fails
            return self.clients.claim();
        })
    );
});

// Fetch event - handle requests with advanced caching
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Handle API requests - don't intercept to avoid CORS issues
    // Service workers cannot bypass CORS, so let the main thread handle all API calls
    // The service worker will only handle static assets and navigation
    if (isApiRequest(url)) {
        // Pass through API requests without interception
        // This avoids CORS issues - the main thread handles API calls directly
        event.respondWith(
            fetch(request).catch((error) => {
                console.log('API request failed in service worker:', error.message);
                // Return a proper error response instead of throwing
                return new Response(JSON.stringify({ 
                    error: 'Network error', 
                    offline: true 
                }), {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // Handle static assets
    if (isStaticAsset(url)) {
        event.respondWith(handleStaticAsset(request));
        return;
    }

    // Handle navigation requests
    if (request.mode === 'navigate') {
        event.respondWith(handleNavigation(request));
        return;
    }

    // Default: try network first, fallback to cache
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request);
        })
    );
});

// Background Sync for offline conversions
self.addEventListener('sync', (event) => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'conversion-sync') {
        event.waitUntil(syncConversions());
    }
    
    if (event.tag === 'rate-sync') {
        event.waitUntil(syncRates());
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    console.log('Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New rates available!',
        icon: './icons/icon-192x192.png',
        badge: './icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open Converter',
                icon: './icons/icon-96x96.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: './icons/icon-96x96.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Smart Unit Converter', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.action);
    
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('./')
        );
    }
});

// Periodic background sync for rates
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'rate-update') {
        event.waitUntil(updateRates());
    }
});

// Helper functions
function isApiRequest(url) {
    return url.hostname.includes('api.exchangerate-api.com') ||
           url.hostname.includes('api.binance.com') ||
           url.hostname.includes('api.coincap.io') ||
           url.hostname.includes('api.fixer.io') ||
           url.hostname.includes('api.currencyapi.com') ||
           url.hostname.includes('min-api.cryptocompare.com') ||
           url.hostname.includes('api.coinpaprika.com') ||
           url.hostname.includes('api.coingecko.com');
}

function isStaticAsset(url) {
    return url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.png') ||
           url.pathname.endsWith('.jpg') ||
           url.pathname.endsWith('.svg') ||
           url.pathname.endsWith('.ico');
}

async function handleApiRequest(request) {
    const cache = await caches.open(API_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        const cacheTime = new Date(cachedResponse.headers.get('sw-cache-time'));
        const now = new Date();
        const ageInMinutes = (now - cacheTime) / (1000 * 60);
        
        // Use cache if less than 1 minute old for crypto, 5 minutes for currency
        const isCrypto = request.url.includes('coingecko.com') || 
                        request.url.includes('coincap.io');
        const maxAge = isCrypto ? 1 : 5;
        
        if (ageInMinutes < maxAge) {
            console.log('Serving from cache:', request.url);
            return cachedResponse;
        }
    }
    
    try {
        // Use no-cors mode for external APIs to avoid CORS issues
        const fetchOptions = {
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-cache'
        };
        
        const response = await fetch(request, fetchOptions).catch(async (fetchError) => {
            // If CORS fails, try with no-cors mode (opaque response)
            console.log('CORS failed, trying no-cors mode:', fetchError);
            try {
                return await fetch(request, { mode: 'no-cors', cache: 'no-cache' });
            } catch (noCorsError) {
                console.log('No-cors also failed:', noCorsError);
                throw fetchError; // Re-throw original error
            }
        });
        
        if (response && response.ok && response.type !== 'opaque') {
            // Only cache if response is not opaque (no-cors responses are opaque)
            try {
                // Create new headers object instead of modifying immutable headers
                const newHeaders = new Headers(response.headers);
                newHeaders.set('sw-cache-time', new Date().toISOString());
                
                // Create new response with modified headers
                const responseClone = new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                });
                
                await cache.put(request, responseClone);
            } catch (cacheError) {
                console.log('Cache error (non-critical):', cacheError);
                // Continue even if caching fails
            }
        }
        return response;
    } catch (error) {
        console.log('Network error, serving from cache:', error);
        // Return cached response if available, otherwise return error response
        if (cachedResponse) {
            return cachedResponse;
        }
        // Return a proper Response object, not just a string
        return new Response(JSON.stringify({ error: 'Network error', offline: true }), {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleStaticAsset(request) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            await cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        return new Response('Asset not available offline', { status: 404 });
    }
}

async function handleNavigation(request) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match('./index.html');
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            await cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        return cachedResponse || new Response('App not available offline', { status: 503 });
    }
}

async function syncConversions() {
    console.log('Syncing offline conversions...');
    // Implement offline conversion sync logic
    const conversions = await getStoredConversions();
    for (const conversion of conversions) {
        await syncConversion(conversion);
    }
}

async function syncRates() {
    console.log('Syncing rates in background...');
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (response.ok) {
            const cache = await caches.open(API_CACHE_NAME);
            await cache.put('https://api.exchangerate-api.com/v4/latest/USD', response);
        }
    } catch (error) {
        console.log('Background rate sync failed:', error);
    }
}

async function updateRates() {
    console.log('Periodic rate update...');
    await syncRates();
}

// Utility functions for offline storage
async function getStoredConversions() {
    // Implement conversion storage logic
    return [];
}

async function syncConversion(conversion) {
    // Implement conversion sync logic
    console.log('Syncing conversion:', conversion);
}

// Message handling for communication with main app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

console.log('Enhanced Service Worker loaded successfully!');