const crypto = require('crypto')

const md5sum = crypto.createHash('sha256')

function makePostUser({ userRepository, validateUser }) {
    if (!userRepository) throw new Error('userRepository param is required ')

    // INFO: req-1 tenantId POST /api/users 400 - 80378.34 ms
    // INFO: req-1 tenantId POST /api/users 200 - 30705.71 ms

    return async function postUser(tenantId, request) {
        const problem = validateUser(request.body)
        if (problem) {
            return problem
        }

        const data = {
            ...request.body,
            password: md5sum.update(request.body.password).digest('hex'),
            registration_date: new Date(),
        }
        const user = await userRepository.create(tenantId, data)
        const { password, ...rest } = user
        return {
            statusCode: 200,
            body: rest,
        }
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
})
