import Koa from 'koa'
import json from 'koa-json'
import router from './routes'

const app = new Koa()

app.use(json())

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)

