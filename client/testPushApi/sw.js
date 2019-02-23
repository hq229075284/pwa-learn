self.addEventListener('install', function (event) {
  console.log('install')
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  console.log('activate')
  self.clients.claim()
})


self.addEventListener('push', function (e) {
  self.registration.showNotification(e.data.text())
})