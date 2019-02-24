self.addEventListener('install', (e) => {
  console.log('install inner sw')
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  console.log('activate inner sw')
  self.clients.claim()
})

self.addEventListener('message', function (e) {
  console.log('from inner web message:', e.data)
})