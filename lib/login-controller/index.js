const { userRepository } = require('../../app/data-access/repositories')
const { makePostLogin, makeGetMe } = require('./controllers')
const { hashPassword } = require('../user-use-case')
const { sendEvent } = require('../../app/event-access')

const getMe = makeGetMe()
const postLogin = makePostLogin({ userRepository, hashPassword, sendEvent })

module.exports = Object.freeze({
    getMe,
    postLogin,
})
