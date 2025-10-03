import { FastifyPluginAsync } from 'fastify'
import lives from './lives'
import pingRouter from './ping'

const routes: FastifyPluginAsync = async (fastify, opts) => {
  fastify.register(pingRouter)
  fastify.register(lives)
}

export default routes

