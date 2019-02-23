
var requestIp = '170.130.175.10'
var isSupportSW = !!window.navigator.serviceWorker
if (!isSupportSW) {
  alert('dont support ServiceWorker')
  throw new Error('dont support ServiceWorker')
}
var serviceWorkerContainer = window.navigator.serviceWorker
var controller = navigator.serviceWorker.controller

serviceWorkerContainer.register('./sw.js', { scope: '/testNotificationApi/' })
  .then(function (registration) {
    console.log('registr success')

    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          console.log(permission === Notification.permission)
          cb()
        }
      })
    } else {
      cb()
    }

    function cb() {
      var title = 'Hello World web!'
      var options = {
        body: "body web",
        // icon: 'path/to/icon.png',
        tag: "group-1",
        renotify: true,
      }
      var n = new Notification(title, options)
      n.onclick = function () { console.log('click web notify') }
      n.onclose = function () { console.log('close web notify') }
    }
  })
  .catch(function (e) { console.error(e) })

