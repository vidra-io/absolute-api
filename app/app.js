if (!process.env.MONGODB_URL) throw new Error('MONGODB_URL environment variable configuration is required')

const Agenda = require('agenda')
const fastify = require('fastify')
const fastifySession = require('fastify-session')
const fastifyCookie = require('fastify-cookie')
// const express = require('express')
const { init: initDb } = require('./data-access')
const logger = require('./logger')
const amqpEventModule = require('./amqp-event-module')
const fastifyControllerModule = require('./fastify-controller-module')
const eventControllerModule = require('./event-controller-module')
// const expressControllerModule = require('./express-controller-module')
const postUnstructured = require('../lib/unstructured-controller')
const { postUser, getUser, createUserEventHandler } = require('../lib/user-controller')
const { postLogin, getMe } = require('../lib/login-controller')

initDb(process.env.MONGODB_URL).then(async (mongoClient) => {
    logger.info('Database connected')
    const agenda = new Agenda({ mongo: mongoClient.connection })
    await agenda.start()
})

const { addEventHandler } = amqpEventModule(process.env.AMQP_URL, 'amq.topic', 'absolute-api')
addEventHandler('absolute.user.create', eventControllerModule(createUserEventHandler))

// const expressApp = express()
// expressApp.use(express.json())

const app = fastify({
    logger,
    disableRequestLogging: true,
    ignoreTrailingSlash: true,
    requestIdHeader: 'x-request-id',
})
app.register(fastifyCookie)
app.register(fastifySession, {
    cookieName: 'app-session',
    cookie: { secure: false },
    secret: 'a secret with minimum length of 32 characters',
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
app.post(`${process.env.BASE_PUBLIC_PATH}/login`, fastifyControllerModule(postLogin))

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
