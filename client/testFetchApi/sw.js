var cacheKey = 'my-test-cache-v1'

self.addEventListener('install', function (event) {
  event.waitUntil(
    self.skipWaiting()
  )
})

self.addEventListener('fetch', function (event) {
  console.log('sw fetch')
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse
      }
      console.log('event.request:', event.request)
      const request = event.request.clone()
      return fetch(request).then(function (httpRes) {
        // 请求失败了，直接返回失败的结果就好了。。
        if (!httpRes || httpRes.status !== 200) {
          return httpRes
        }

        var responseClone = httpRes.clone()
        // 请求成功的话，将请求缓存起来。
        return caches.open(cacheKey)
          .then(function (cache) {
            return cache.put(event.request, responseClone);
          })
          .then(function () { return httpRes })

      })
    })
  )
})

self.addEventListener('activate', function (event) {
  console.log('activate')
  event.waitUntil(
    self.clients.claim()
  )
})
