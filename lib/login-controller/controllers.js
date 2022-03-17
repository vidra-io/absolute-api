const problemJson = require('../../app/problem-json')

function makePostLogin({ userRepository: { findOne }, sendEvent, hashPassword }) {
    if (!findOne) throw new Error('findOne param is required ')
    if (!hashPassword) throw new Error('hashPassword param is required ')
    if (!sendEvent) throw new Error('sendEvent param is required ')

    return async function postLogin(tenantId, request, reply, { session, logger }) {
        const user = await findOne(tenantId, { username: request.body.username })
        if (!user) {
            return problemJson('invalid-credentials')
        }

        const hash = hashPassword(request.body.password)
        if (hash !== user.password) {
            return problemJson('invalid-credentials')
        }

        session.setData({ userId: user.id })

        return {
            statusCode: 200,
            body: session.get(),
        }
    }
}

function makeGetMe() {
    return async function getMe(tenantId, request, reply, { session }) {
        return {
            body: session.get(),
        }
    }
}

module.exports = Object.freeze({
    makePostLogin,
    makeGetMe,
})
