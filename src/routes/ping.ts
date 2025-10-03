import { FastifyPluginAsync } from 'fastify'

const pingRouter: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/ping', async (request, reply) => {
    return 'pong'
  })
}

export default pingRouter

