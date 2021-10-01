const amqpEventModule = require('@vidra-io/amqp-event-module')
const env = require('@vidra-io/environment-config').load()

const eventModule = amqpEventModule(env.AMQP_URL, env.EXCHANGE_NAME, env.QUEUE_NAME)

module.exports = Object.freeze({
    ...eventModule,
})
