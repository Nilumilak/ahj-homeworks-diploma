export type {}
declare const self: ServiceWorkerGlobalScope

const FETCH_PRIORITY: string[] = ['/ahj-homeworks-diploma/', '/ahj-homeworks-diploma/index.html', '/ahj-homeworks-diploma/index.css']
const CACHE_PRIORITY: string[] = ['/ahj-homeworks-diploma/index.js']

async function fetchPriorityThenCache (e: FetchEvent): Promise<Response> {
    let response: Response

    try {
        response = await fetch(e.request)
    } catch (err) {
        const cacheResponse = await caches.match(e.request)

        if (cacheResponse) {
            return cacheResponse
        }
        return new Response('Connection Error (fetchPriorityThenCache)')
    }

    const cache = await caches.open('posts-cache')

    void cache.put(e.request, response.clone())

    return response
}

async function cachePriorityThenFetch (e: FetchEvent): Promise<Response> {
    const cacheResponse = await caches.match(e.request)

    if (cacheResponse) {
        return cacheResponse
    }

    let response: Response

    try {
        response = await fetch(e.request)
    } catch (err) {
        return new Response('Connection Error (cachePriorityThenFetch)')
    }

    const cache = await caches.open('posts-cache')

    void cache.put(e.request, response.clone())

    return response
}

self.addEventListener('install', (e) => {
    console.log('Installed')
    e.waitUntil(
        caches.open('posts-cache')
            .then((cache) => {
                void cache.addAll([
                    './',
                    './index.html',
                    './index.js',
                    './index.css'
                ])
            })
    )
})

self.addEventListener('activate', (e) => {
    console.log('Activated')
})

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url)
    if (FETCH_PRIORITY.includes(url.pathname)) {
        e.respondWith(fetchPriorityThenCache(e))
    } else if (CACHE_PRIORITY.includes(url.pathname)) {
        e.respondWith(cachePriorityThenFetch(e))
    } else {
        e.respondWith(fetchPriorityThenCache(e))
    }
})
