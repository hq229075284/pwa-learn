
self.addEventListener('install', function (event) {
  console.log('install')
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  console.log('activate')
  self.clients.claim()
})

// self.addEventListener('notificationclick', function (event) {
//   switch (event.action) {
//     case 'coffee': console.log('coffee'); break
//     default: console.log('not click at point')
//   }
// })

setTimeout(() => {
  console.log('exec setTimeout')
  var title = 'Hello World sw!'
  var options = {
    body: "body sw",
    // icon: 'path/to/icon.png',
    tag: "group-2",
    renotify: true,
    actions: [
      {
        action: 'coffee',
        title: 'Coffee',
        // icon: 'path/to/action-1.png'
      }
    ]
  }
  self.registration.showNotification(title, options)
  // self.Notification.requestPermission().then(() => {
  // })
}, 5000)

self.addEventListener('notificationclick', function (event) { console.log('click sw notify') })
self.addEventListener('notificationclose', function (event) { console.log('close sw notify') })
