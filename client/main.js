
(function (window) {
  var isSupportSW = !!window.navigator.serviceWorker
  if (!isSupportSW) return alert('dont support ServiceWorker')
  var serviceWorker = window.navigator.serviceWorker
  var controller = navigator.serviceWorker.controller
  // if (!controller) {
  //   serviceWorker.register('./sw.js', { scope: '/' })
  //   navigator.serviceWorker.ready.then(function (reg) {
  //     // console.log('ready', navigator.serviceWorker.controller)
  //     controller = reg.active
  //     controller.postMessage('hello')
  //   })
  // }
  serviceWorker.register('./sw.js', { scope: '/' })
    .then(function (registration) {
      console.log('registration=>', registration)

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
        var title = 'Hello World!'
        var options = {
          body: "body 123",
          // icon: 'path/to/icon.png',
          tag: "group-1",
          renotify: true,
          // actions: [
          //   {
          //     action: 'coffee',
          //     title: 'Coffee',
          //     // icon: 'path/to/action-1.png'
          //   }
          // ]
        }
        var n = new Notification(title, options)
        // registration.showNotification('Hello World!', {
        //   body: "body 123",
        //   // icon: 'path/to/icon.png',
        //   tag: "group-1",
        //   renotify: true,
        //   actions: [
        //     {
        //       action: 'coffee',
        //       title: 'Coffee',
        //       // icon: 'path/to/action-1.png'
        //     }
        //   ]
        // })

      }
    })
    .then(function () {
      setTimeout(function () {
        // console.log('push')
        // console.log('navigator.serviceWorker.controller', navigator.serviceWorker.controller)
        // window.postMessage('hello', 'http://localhost:6780/sw.js')
        navigator.serviceWorker.ready.then(function (reg) {
          reg.active.postMessage('hello')
        })
      }, 8000)
    })
    .catch(function (e) { console.error(e) })

  navigator.serviceWorker.addEventListener('message', function (e) {
    console.debug('message:')
    console.debug('event=>', e)
    console.debug('data=>', e.data)
  })

  var deferEvent = null
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferEvent = e
    setTimeout(function () {
      deferEvent.prompt()
      deferredPrompt.userChoice.then(function (choiceResult) {
        console.log(choiceResult.outcome)
      })
      deferEvent = null
    }, 5000)
    return false;
  })

  // setTimeout(function () {
  //   fetch('http://localhost:6780/interface')
  //     .then(function (response) { return response.json() })
  //     .then(function (data) { console.log(data) })
  // }, 5000)

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

  window.fetch('http://localhost:6780/getPublicKey').then(function (res) { return res.json() }).then(function (publicKey) {
    navigator.serviceWorker.ready.then(function (reg) {
      console.log(publicKey)
      // debugger
      // reg.pushManager.permissionState().then(a => console.log('permissionState', a))
      reg.pushManager.getSubscription()
        .then(function (subscribeInfo) {
          if (subscribeInfo) {
            return subscribeInfo
          } else {
            return reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicKey)
            })
          }
        })
        .then(function (subscribeInfo) {
          // debugger
          reg.pushManager.permissionState({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey)
          }).then(a => console.log('permissionState', a))
          window.fetch('http://localhost:6780/sendSubscribeInfo', { method: 'post', body: JSON.stringify(subscribeInfo) })
            .then(function () { console.log('send subscribeInfo to back-end') })
            .catch(function (err) {
              console.log(err)
              if (err.statusCode === 410) {
                // 从数据库中删除推送订阅对象
              }
            })
        })
    });
  })

})(window)
