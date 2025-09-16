// Enhanced Service Worker for AI Smart Unit Converter
// Provides offline functionality, background sync, and push notifications

const CACHE_NAME = 'ai-smart-converter-v3';
const API_CACHE_NAME = 'api-cache-v3';
const STATIC_CACHE_NAME = 'static-cache-v3';

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then((cache) => {
            return cache.addAll([
                './',
                './index.html',
                './manifest.json',
                './draggable_categories.js',
                './user_friendly_preferences.js',
                './icons/icon-192x192.png',
                './icons/icon-512x512.png',
                './screenshots/mobile-home.png',
                './screenshots/desktop-home.png'
            ]);
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch event - handle requests with advanced caching
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Handle API requests with smart caching
    if (isApiRequest(url)) {
        event.respondWith(handleApiRequest(request));
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
    } else if (event.tag === 'rate-sync') {
        event.waitUntil(syncRates());
    } else if (event.tag === 'update-rates') {
        event.waitUntil(updateRates());
    }
});

// Periodic Background Sync for rate updates
self.addEventListener('periodicsync', (event) => {
    console.log('Periodic sync triggered:', event.tag);
    
    if (event.tag === 'rate-update') {
        event.waitUntil(updateRates());
    }
});

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('Push notification received:', event);
    
    const options = {
        body: 'New conversion rates available!',
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
                title: 'View Rates',
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

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('./?action=rates')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('./')
        );
    }
});

// Helper functions
function isApiRequest(url) {
    return url.hostname.includes('api.') || 
           url.hostname.includes('exchangerate-api.com') ||
           url.hostname.includes('api.coingecko.com') ||
           url.hostname.includes('api.fixer.io') ||
           url.hostname.includes('api.currencyapi.com');
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
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            await cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.log('API request failed, using cached data:', error);
        return cachedResponse || new Response(JSON.stringify({
            error: 'API not available offline',
            message: 'Please check your internet connection'
        }), {
            status: 503,
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
    // Implementation for syncing offline conversions
    // This would typically send queued conversions to the server
}

async function syncRates() {
    console.log('Syncing rates...');
    // Implementation for syncing rates
    // This would typically update cached rates
}

async function updateRates() {
    console.log('Updating rates...');
    try {
        // Update currency rates
        const currencyResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (currencyResponse.ok) {
            const currencyData = await currencyResponse.json();
            const cache = await caches.open(API_CACHE_NAME);
            await cache.put('https://api.exchangerate-api.com/v4/latest/USD', currencyResponse.clone());
        }
        
        // Update crypto rates
        const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd');
        if (cryptoResponse.ok) {
            const cryptoData = await cryptoResponse.json();
            const cache = await caches.open(API_CACHE_NAME);
            await cache.put('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd', cryptoResponse.clone());
        }
        
        // Notify clients of update
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'RATES_UPDATED',
                data: { timestamp: Date.now() }
            });
        });
        
    } catch (error) {
        console.log('Rate update failed:', error);
    }
}
