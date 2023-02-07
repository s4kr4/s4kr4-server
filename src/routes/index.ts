import Router from '@koa/router'
import lives from './lives'

const router = new Router()

router.use('/api/lives', lives.routes())

export default router

