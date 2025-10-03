import Fastify from 'fastify'
import cors from '@fastify/cors'
import 'dotenv/config'
import routes from './routes'

const fastify = Fastify({
  logger: true
})

fastify.register(cors)
fastify.register(routes, { prefix: '/api' })

fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`Server listening at ${address}`)
})

