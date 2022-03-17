const amqp = require('amqplib')

const queue = []
let channel = null
// this is a simple semaphore implementation
// subsequent request must not create multiple channels
async function createChannel(amqpUrl) {
    if (channel) return channel
    const promise = new Promise((resolve) => {
        queue.push(resolve)
    })
    if (queue.length === 1) {
        const connection = await amqp.connect(amqpUrl)
        connection.on('close', () => { throw new Error('FATAL amqp connection closed') })
        connection.on('error', () => { throw new Error('FATAL amqp connection error') })
        channel = await connection.createChannel()
        channel.on('close', () => { throw new Error('FATAL amqp connection closed') })
        channel.on('error', () => { throw new Error('FATAL amqp connection error') })
        setTimeout(() => queue.forEach((r) => r(channel)), 0)
        return channel
    }
    return promise
}

async function consumer(msg, handlerMap) {
    const eventHandler = handlerMap[msg.fields.routingKey]
    if (eventHandler) {
        await eventHandler(msg.properties.headers['x-tenant-id'], JSON.parse(msg.content), msg)
    }
}

function getRandomNode(amqpUrls) {
    const urls = amqpUrls.split(',').filter((s) => s.length > 0)
    return urls[Math.floor(Math.random() * urls.length)]
}

module.exports = function amqpEventHandlerModule(amqpUrls, exchangeName, queueName) {
    if (!amqpUrls) { throw new Error('Error: amqpUrl is required') }
    if (!exchangeName) { throw new Error('Error: exchangeName is required') }

    const amqpUrl = getRandomNode(amqpUrls)
    const handlerMap = {}
    let assertQueue = null
    let assertExcange = null

    async function addEventHandler(key, eventHandler) {
        if (!queueName) { throw new Error('Error: queueName is required. This module was initialized without it') }
        await createChannel(amqpUrl)
        if (!assertExcange) {
            assertExcange = await channel.assertExchange(exchangeName, 'topic', { durable: true })
        }
        if (!assertQueue) {
            assertQueue = await channel.assertQueue(queueName, 'topic', { durable: true })
        }
        channel.consume(assertQueue.queue, (msg) => consumer(msg, handlerMap), { noAck: true })
        channel.bindQueue(assertQueue.queue, exchangeName, key)
        handlerMap[key] = eventHandler
    }

    async function sendEvent(tenantId, requestId, key, data) {
        await createChannel(amqpUrl)
        const headers = { 'x-tenant-id': tenantId, 'x-request-id': requestId }
        return channel.publish(exchangeName, key, Buffer.from(JSON.stringify(data)), { headers })
    }

    return { addEventHandler, sendEvent }
}
