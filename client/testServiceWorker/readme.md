+ 仅在https或者localhost的情况下才能使用service worker
+ 在一个scope下只能注册一个service worker
+ service worker第一次安装的时候需要刷新页面或者在`activate`事件中执行`self.clients.claim()`才能在navigator.serviceWorker.controller上获得`ServiceWorker实例`
  [参考](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/controller)
+ 通过skipWaiting可以马上应用新的service worker，新的sw的状态从`waiting`变为`activated`
  [参考](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting)
+ 通过self.clients.claim()将新的`ServiceWorker实例`应用到主线程的navigator.serviceWorker.controller上
  [参考](https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim)
+ 浏览器会自动检测service worker文件内容的更新
+ 通过event.waitUntil这个api，可以使事件一直处于触发中，直到入参的promise被resolve后，才会执行其它的浏览器实现的内部操作
  [参考](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil)
+ 即使在`serviceWorkerContainer.ready.then`中，当前页面仍可能未被service worker控制，即controller为null
+ 当前页面的service worker控制器为scope属性最接近当前url的service worker脚本