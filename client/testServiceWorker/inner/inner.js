if ('serviceWorker' in navigator) {
  var serivceWorkerContainer = navigator.serviceWorker
  serivceWorkerContainer.register('./sw.js', { scope: '/testServiceWorker/inner/' })
    .then((reg) => { console.log('regsiter inner sw success') })

  serivceWorkerContainer.ready.then((reg) => {
    console.log('inner sw ready')
    reg.active.postMessage('post from inner web')
  })
}