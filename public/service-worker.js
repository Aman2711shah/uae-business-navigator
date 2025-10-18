const CACHE_NAME = 'uae-business-navigator-v2';
const OFFLINE_PAGE = '/offline.html';
// Precache only known-existing assets to avoid install failing
const urlsToCache = [
  '/',
  '/manifest.json',
  OFFLINE_PAGE,
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(urlsToCache);
    } catch (error) {
      // If any asset fails to cache, ensure at least the offline page is cached
      const cache = await caches.open(CACHE_NAME);
      try { await cache.add(OFFLINE_PAGE); } catch (_) { /* noop */ }
    }
  })());
});

// Fetch event with offline support
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        // Try network first
        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {
        // If network fails, try cache
        const cache = await caches.open(CACHE_NAME);
        const cachedResp = await cache.match(event.request);
        if (cachedResp) {
          return cachedResp;
        }
        // If no cache, return offline page
        return cache.match(OFFLINE_PAGE);
      }
    })());
  } else {
    // For non-navigation requests, use cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request).catch(() => {
            // Store failed requests for background sync
            if (event.request.method === 'POST') {
              storeFailedRequest(event.request.clone());
            }
          });
        })
    );
  }
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Retry failed requests when back online
    const failedRequests = await idbGetAllFailedRequests();
    for (const record of failedRequests) {
      try {
        const headers = new Headers(record.headers || []);
        const init = {
          method: record.method || 'POST',
          headers,
          body: methodAllowsBody(record.method) ? record.body : undefined,
        };
        await fetch(new Request(record.url, init));
      } catch (err) {
        // If a request still fails, keep it for the next sync
      }
    }
    await idbClearFailedRequests();
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

function methodAllowsBody(method) {
  const m = (method || 'POST').toUpperCase();
  return m !== 'GET' && m !== 'HEAD';
}

async function storeFailedRequest(request) {
  try {
    const record = {
      url: request.url,
      method: request.method,
      body: methodAllowsBody(request.method) ? await request.clone().text() : undefined,
      headers: [...request.headers.entries()],
      ts: Date.now()
    };
    await idbAddFailedRequest(record);
  } catch (error) {
    console.log('Failed to store request:', error);
  }
}

// IndexedDB helpers (service worker-safe; localStorage is not available in SW)
const IDB_DB_NAME = 'wazeet-sw-db';
const IDB_STORE_NAME = 'failedRequests';

function idbOpen() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbAddFailedRequest(record) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(IDB_STORE_NAME).add(record);
  });
}

async function idbGetAllFailedRequests() {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE_NAME, 'readonly');
    const store = tx.objectStore(IDB_STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function idbClearFailedRequests() {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(IDB_STORE_NAME);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Periodic Background Sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  try {
    // Fetch latest content updates
    await fetch('/api/sync');
  } catch (error) {
    console.log('Periodic sync failed:', error);
  }
}

// Push Notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('UAE Business Navigator', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});