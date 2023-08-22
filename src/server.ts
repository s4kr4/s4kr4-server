import Koa from 'koa'
import json from 'koa-json'
import 'dotenv/config'
import cors from '@koa/cors'
import router from './routes'

const app = new Koa()

app.use(json())

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)

