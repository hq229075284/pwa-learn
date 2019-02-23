
var requestIp = 'localhost'
var isSupportSW = !!window.navigator.serviceWorker
if (!isSupportSW) {
  alert('dont support ServiceWorker')
  throw new Error('dont support ServiceWorker')
}

var serviceWorker = window.navigator.serviceWorker
var controller = navigator.serviceWorker.controller

serviceWorker.register('./sw.js', { scope: '/testCacheApi/' })
  .then(function (registration) {
    console.log('register success')
  })

