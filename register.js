if ('serviceWorker' in window.navigator) {
  window.addEventListener('DOMContentLoaded', function () {
    window.navigator.serviceWorker.register('sw.js', { scope: '/' })
      .then(function (registration) { console.dir('registration:', registration) })
      .catch(function (err) { console.error('error:', err) })
  })

}