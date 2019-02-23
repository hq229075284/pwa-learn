var isSupportSW = !!window.navigator.serviceWorker
if (!isSupportSW) {
  throw new Error('dont support ServiceWorker')
  alert('dont support ServiceWorker')
}

var serviceWorkerContainer = window.navigator.serviceWorker
var controller = navigator.serviceWorker.controller

serviceWorkerContainer.register('./sw1.js', { scope: '/testServiceWorker/' })
  .then(function (registration) {
    console.log('scope:/testServiceWorker/, register succuss')
  })
  .catch(function (e) { console.error(e) })

setTimeout(() => {
  console.log('exec sw2')
  serviceWorkerContainer.register('./sw2.js', { scope: '/testServiceWorker/' })
    .then(function (registration) {
      console.log('scope:/testServiceWorker/client, register succuss')
    })
    .catch(function (e) { console.error(e) })
}, 10000)

serviceWorkerContainer.ready.then(function (reg) {
  console.log('scope', reg.scope)
  console.log('controller:', serviceWorkerContainer.controller)
  reg.active.postMessage('post from web')
})

serviceWorkerContainer.oncontrollerchange = function (controllerchangeevent) {
  console.log('event:', controllerchangeevent)
  console.log('controller:', serviceWorkerContainer.controller)
}

serviceWorkerContainer.addEventListener('message', function (e) {
  console.log('this is from ' + e.source.scriptURL + ':', e.data)
})