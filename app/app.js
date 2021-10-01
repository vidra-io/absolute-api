const Agenda = require('agenda')
const fastify = require('fastify')

if (!process.env.MONGODB_URL) throw new Error('MONGODB_URL environment variable configuration is required')

const express = require('express')
const { init: initDb } = require('./data-access')
const logger = require('./logger')
const fastifyControllerModule = require('./fastify-controller-module')
// const expressControllerModule = require('./express-controller-module')
const { getMe, postUser, getUser } = require('../lib/user-controller')
const postUnstructured = require('../lib/unstructured-controller')

initDb(process.env.MONGODB_URL).then(async (mongoClient) => {
    logger.info('Database connected')
    const agenda = new Agenda({ mongo: mongoClient.connection })
    await agenda.start()
})

const expressApp = express()
expressApp.use(express.json())

const app = fastify({
    logger,
    disableRequestLogging: true,
    ignoreTrailingSlash: true,
    requestIdHeader: 'x-request-id',
})

app.addHook('onResponse', (request, reply, done) => {
    request.log.info(
        // eslint-disable-next-line max-len
        `${request.id} ${request.raw.headers['x-tenant-id']} ${request.raw.method} ${request.raw.url} ${reply.statusCode} - ${reply.getResponseTime().toFixed(2)} ms`,
    )
    done()
})

// Esempio di codice senza struttura
app.post(`${process.env.BASE_PUBLIC_PATH}/unstructured`, postUnstructured)

app.get(`${process.env.BASE_PUBLIC_PATH}/users/me`, fastifyControllerModule(getMe))
app.get(`${process.env.BASE_PUBLIC_PATH}/users/:userId`, fastifyControllerModule(getUser))
app.post(`${process.env.BASE_PUBLIC_PATH}/users`, fastifyControllerModule(postUser))

module.exports = app

// app.addHook('onRequest', (request, reply, done) => {
//     if (!request.headers['x-tenant-id']) {
//         return reply.code(401).send()
//     }
//     return done()
// })

// expressApp.post(`${process.env.BASE_PUBLIC_PATH}/unstructured`, postUnstructured)

// expressApp.get(`${process.env.BASE_PUBLIC_PATH}/users/me`, expressControllerModule(getMe))
// expressApp.post(`${process.env.BASE_PUBLIC_PATH}/users`, expressControllerModule(postUser))

// setTimeout(async () => {
//     await addEventHandler('vidra.order.new', eventControllerModule(newOrderEventController))
//     await addEventHandler('vidra.webshop.user.update', eventControllerModule(userUpdateEventController))
// }, 512)

// module.exports = expressApp
