const { userRepository } = require('../../app/data-access/repositories')
const { makePostUser, makeGetUser, makeCreateUserEventHandler } = require('./controllers')
const { validateUser } = require('./validators')
const { hashPassword } = require('../user-use-case')
const { sendEvent } = require('../../app/event-access')

const postUser = makePostUser({ userRepository, validateUser, hashPassword, sendEvent })
const getUser = makeGetUser({ userRepository })
const createUserEventHandler = makeCreateUserEventHandler()

module.exports = Object.freeze({
    postUser,
    getUser,
    createUserEventHandler,
})
