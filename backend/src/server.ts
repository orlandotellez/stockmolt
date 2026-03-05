import Fastify from "fastify";

const PORT = process.env.PORT || 3000

const fastify = Fastify({
  logger: true
})

fastify.get("/", (_req, reply) => {
  reply.send({ hello: "world" })
})

fastify.listen({ port: PORT as number }, (err, _address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

