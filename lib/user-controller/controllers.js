function makePostUser({ userRepository, validateUser, hashPassword, sendEvent }) {
    if (!userRepository) throw new Error('userRepository param is required ')

    return async function postUser(tenantId, request, reply, { requestId }) {
        const problem = validateUser(request.body)
        if (problem) {
            return problem
        }

        const data = {
            ...request.body,
            password: hashPassword(request.body.password),
            registration_date: new Date(),
        }
        const user = await userRepository.create(tenantId, data)
        const { password, ...rest } = user

        sendEvent(tenantId, requestId, 'absolute.user.create', user)

        return {
            statusCode: 200,
            body: rest,
        }
    }
}

/* un controller come questo sarà nel servizio di invio mail
 * e ovunque ci sia logica interessata alla creazione di un utente
 */
function makeCreateUserEventHandler() {
    return function createUserEventHandler(eventName, tenantId, data, { logger }) {
        logger.info(JSON.stringify(data))
    }
}

function makeGetUser({ userRepository }) {
    if (!userRepository) throw new Error('userRepository param is required ')

    return async function getUser(tenantId, request) {
        const user = userRepository.findById(tenantId, request.params.userId)
        if (user) {
            return { body: user }
        }
        return { statusCode: 404 }
    }
}

module.exports = Object.freeze({
    makePostUser,
    makeGetUser,
    makeCreateUserEventHandler,
})
