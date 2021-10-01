const { userRepository } = require('../../app/data-access/repositories')
const { makePostUser, makeGetUser } = require('./controllers')
const { validateUser } = require('./validators')

function makeGetMe() {
    return function getMe() {
        return {
            body: {
                username: 'Jop',
            },
        }
    }
}

const getMe = makeGetMe()
const postUser = makePostUser({ userRepository, validateUser })
const getUser = makeGetUser({ userRepository })

module.exports = Object.freeze({
    getMe,
    postUser,
    getUser,
})
