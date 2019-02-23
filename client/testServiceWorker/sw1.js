// self is `ServiceWorkerGlobalScopeInstance`
self.addEventListener('install', function (event) {
  console.log('install 1')
  // console.log('update')
  self.skipWaiting()
  event.waitUntil(
    new Promise((r) => setTimeout(() => { console.log('delay install 1'); r() }, 2000))
  )
})

self.addEventListener('activate', function (event) {
  console.log('activate 1')
  self.clients.claim()
  // event.waitUntil(self.clients.claim())
})
