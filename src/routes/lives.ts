import Router from '@koa/router'

const lives = new Router()

lives.get('/data', (ctx, next) => {
  ctx.body = {
    method: 'get /'
  }
})

export default lives

