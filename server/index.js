const koa = require('koa')
const koaS = require('koa-static')
const path = require('path')
const fs = require('fs')
const webpush = require('web-push')
const server = new koa()
const root = path.join(__dirname, '../client')
const port = 6780
let vapidKeys

server.use(async function (ctx, next) {
  // console.log(JSON.stringify(ctx))
  switch (ctx.path) {
    case '/interface': {
      ctx.response.status = 200
      ctx.response.type = 'application/json'
      const stream = fs.createReadStream(path.join(__dirname, './data.json'))
      ctx.response.body = stream
      // ctx.response.set()
      await new Promise(function (r) { setTimeout(function () { r() }, 5000) })
      break
    }
    case '/getPublicKey': {
      if (!vapidKeys) {
        vapidKeys = webpush.generateVAPIDKeys()
        webpush.setVapidDetails(
          'mailto:example@yourdomain.org',
          vapidKeys.publicKey,
          vapidKeys.privateKey
        )
      }
      ctx.response.status = 200
      ctx.response.type = 'application/json'
      ctx.response.body = JSON.stringify(vapidKeys.publicKey)
      break
    }
    case '/sendSubscribeInfo': {
      async function getData() {
        return new Promise(resolve => {
          let body = ''
          ctx.req.on('data', function (chunk) {
            body += chunk;  //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
          })
          ctx.req.on('end', function () {
            // 解析参数
            body = JSON.parse(body);  //将一个字符串反序列化为一个对象
            resolve(body)
          })
        })
      }
      const subscribeInfo = await getData(ctx)
      ctx.response.status = 200
      ctx.response.type = 'application/json'
      ctx.response.body = ''
      setTimeout(function () {
        webpush.sendNotification(subscribeInfo, 'pushed from server').then(response => console.log('push response:', response))
      }, 3000)
      break
    }
    default: await next()
  }
})

server.use(koaS(root, { maxAge: 0 }))

server.listen(port, function (err) {
  if (err) return
  console.log('listen at ' + port)
})
