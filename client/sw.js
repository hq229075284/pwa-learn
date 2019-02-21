// (function (self) {
//   var isSupportSW = !!self.navigator.serviceWorker
//   if (!isSupportSW) return alert('dont support ServiceWorker')
//   var serviceWorker = self.navigator.serviceWorker
//   serviceWorker.install(function () { })
// })(self)

console.log('sw', this)

var cacheKey = 'my-test-cache-v1'

// var ServiceWorkerGlobalScopeInstance=this
var self = this

self.addEventListener('install', function (event) {
  console.log('install event:', event)
  event.waitUntil(caches.open(cacheKey)
    .then(function (cache) {
      console.log('cache=>', cache)
      // return cache.addAll(['/interface']).then(e => console.log('after cache', e))
    })
    .then(function () { return self.skipWaiting() }))
})

self.addEventListener('fetch1', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse
      }
      console.log('event.request:', event.request)
      return fetch(event.request).then(function (httpRes) {

        // http请求的返回已被抓到，可以处置了。

        // 请求失败了，直接返回失败的结果就好了。。
        if (!httpRes || httpRes.status !== 200) {
          return httpRes;
        }

        // 请求成功的话，将请求缓存起来。
        // var responseClone = httpRes.clone();
        return caches.open(cacheKey)
          .then(function (cache) {
            cache.put(event.request, httpRes);
          })
          .then(function () { return httpRes })

        // return httpRes;
      });
    })
  )
})

self.addEventListener('activity', function (event) {
  console.log('activity')
  event.waitUntil(
    Promise.all([
      // 更新客户端
      self.clients.claim(),
      // 清理旧版本
      caches.keys().then(function (cacheList) {
        return Promise.all(
          cacheList.map(function (cacheName) {
            if (cacheName !== 'my-test-cache-v1') {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  )
})

self.addEventListener('notificationclick', function (event) {
  switch (event.action) {
    case 'coffee': console.log('coffee'); break
    default: console.log('not click at point')
  }
})

self.addEventListener('message', function (e) {
  console.debug('message:')
  console.log('event=>', e)
  console.log('data=>', e.data)
  self.clients.matchAll().then(function (all) {
    console.log('all:', all)
    all.forEach(function (client) {
      client.postMessage('hi')
    })
  })
})

self.addEventListener('push', function (e) {
  console.log('push', e)
  console.log('pushed data', e.data)
})