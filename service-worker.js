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
            return cache.addAll([
                './',
                './index.html',
                './manifest.json',
                './security_utils.js',
                './draggable_categories.js',
                './user_friendly_preferences.js',
                './icons/icon-192x192.png',
                './icons/icon-512x512.png'
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
                    if (cacheName !== CACHE_NAME && 
                        cacheName !== API_CACHE_NAME && 
                        cacheName !== STATIC_CACHE_NAME) {
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
           url.hostname.includes('api.coingecko.com') ||
           url.hostname.includes('api.coincap.io') ||
           url.hostname.includes('api.fixer.io') ||
           url.hostname.includes('api.currencyapi.com') ||
           url.hostname.includes('min-api.cryptocompare.com');
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
        const response = await fetch(request);
        if (response.ok) {
            const responseClone = response.clone();
            responseClone.headers.set('sw-cache-time', new Date().toISOString());
            await cache.put(request, responseClone);
        }
        return response;
    } catch (error) {
        console.log('Network error, serving from cache:', error);
        return cachedResponse || new Response('Offline', { status: 503 });
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