// self is `ServiceWorkerGlobalScopeInstance`
self.addEventListener('install', function (event) {
  console.log('install 2')
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  console.log('activate 2')
  self.clients.claim()
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage('post from sw')
    })
  })
})

self.addEventListener('message', function (e) {
  console.log('from web message:', e.data)
})
