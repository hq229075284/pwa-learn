// https://developer.mozilla.org/en-US/docs/Web/API/Cache
var cacheKey = 'my-test-cache-v1'

self.addEventListener('install', function (event) {
  self.skipWaiting()
  event.waitUntil(
    caches.open(cacheKey)
      .then(function (cache) {
        return cache.addAll(['/interface']).then(e => console.log('after cache', e))
      })
  )
})

self.addEventListener('activate', function (e) {
  self.clients.claim()
})
