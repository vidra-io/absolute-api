const amqpEventModule = require('../amqp-event-module')

const eventModule = amqpEventModule(process.env.AMQP_URL, process.env.EXCHANGE_NAME ?? 'amq.topic', process.env.QUEUE_NAME ?? 'absolute-api')

module.exports = Object.freeze({
    ...eventModule,
})
