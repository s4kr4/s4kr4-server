import Router from '@koa/router'
import lives from './lives'

const router = new Router()

router.get('/ping', (ctx) => {
    ctx.body = 'pong'
    ctx.status = 200
})

export default router

