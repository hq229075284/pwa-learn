const path = require('path')
const fs = require('fs')
const http = require('http')

http.createServer((req, res) => {
  console.log('url->', req.url)
  console.log('query->', req.query)
  let databuffer = null
  let contentType
  let ext

  const callback = (delay) => {
    if (delay) {
      setTimeout(() => {
        res.writeHead(200, {
          contentType
        })
        res.end(databuffer)
      }, delay)
    } else {
      res.writeHead(200, {
        contentType
      })
      res.end(databuffer)
    }
  }

  try {
    ext = /\.([a-zA-z]+)$/.exec(req.url)[1]
  } catch (e) {
    ext = ''
  }
  if (/^\/$|\.html$/.test(req.url)) {
    databuffer = fs.readFileSync(require.resolve('./index.html'))
    contentType = 'text/html'
    callback()
  } else {
    try {
      databuffer = fs.readFileSync(require.resolve(`.${req.url}`))
    } catch (e) {
    }
    switch (ext) {
      case 'js': contentType = /* 'application/x-javascript' || */ 'text/javascript'; callback(); break
      case 'css': contentType = 'text/css'; callback(); break
      case 'jpg': contentType = 'image/jepg'; callback(); break
      default: contentType = 'text/plain'; callback(); break
    }
  }
}).listen(9090, () => {
  console.log('listen at 9090')
})

