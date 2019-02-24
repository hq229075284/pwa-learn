
// var requestIp = 'localhost'
var requestIp = '170.130.175.10'
// var requestIp = '192.168.0.101'
var isSupportSW = !!window.navigator.serviceWorker
if (!isSupportSW) {
  alert('dont support ServiceWorker')
  throw new Error('dont support ServiceWorker')
}
var serviceWorker = window.navigator.serviceWorker
var controller = navigator.serviceWorker.controller

serviceWorker.register('./sw.js', { scope: '/testPushApi/' })
  .then(function (registration) {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    }
  })
  .catch(function (e) { console.error(e) })

// 将base64的applicationServerKey转换成UInt8Array
function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
  for (var i = 0, max = rawData.length; i < max; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

window.fetch('http://' + requestIp + ':6780/getPublicKey')
  .then(function (res) { return res.json() })
  .then(function (publicKey) {
    navigator.serviceWorker.ready.then(function (reg) {
      reg.pushManager.getSubscription()
        .then(function (subscribeInfo) {
          if (subscribeInfo) {
            console.log('already has subscribe')
            return subscribeInfo
          } else {
            console.log('start subscribe')
            return reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicKey)
            })
          }
        })
        .then(function (subscribeInfo) {
          // reg.pushManager.permissionState({
          //   userVisibleOnly: true,
          //   applicationServerKey: urlBase64ToUint8Array(publicKey)
          // }).then(a => console.log('permissionState', a))
          window.fetch('http://' + requestIp + ':6780/sendSubscribeInfo', { method: 'post', body: JSON.stringify(subscribeInfo) })
            .then(function () { console.log('send subscribeInfo to back-end') })
            .catch(function (err) {
              console.log(err)
            })
        })
    });
  })


