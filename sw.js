
window.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('my-test-cache-v1').then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        // '/main.css',
        '/index.js',
        // '/image.jpg'
      ]);
    })
  );
});