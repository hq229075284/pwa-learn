var requestIp = 'localhost'
var isSupportSW = !!window.navigator.serviceWorker

if (!isSupportSW) {
  alert('dont support ServiceWorker')
  throw new Error('dont support ServiceWorker')
}

var serviceWorkerContainer = window.navigator.serviceWorker
var controller = navigator.serviceWorker.controller

serviceWorkerContainer.register('./sw.js', { scope: '/testFetchApi/' })
  .then(function (registration) {
    console.log('register success')
  })
  .catch(function (e) { console.error(e) })

serviceWorkerContainer.ready.then(() => {
  console.log('----------ready time fetch----------')
  console.log('controller', serviceWorkerContainer.controller)
  // fetchSomething()
})

function fetchSomething() {
  window.fetch('http://' + requestIp + ':6780/getPublicKey')
    .then(function (res) { return res.json() })
}

serviceWorkerContainer.oncontrollerchange = function (e) {
  console.log('----------controllerchange time fetch----------')
  console.log('controller', serviceWorkerContainer.controller)
  fetchSomething()
}
