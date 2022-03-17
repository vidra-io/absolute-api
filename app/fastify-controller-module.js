module.exports = function fastifyControllerModule(controller) {
    if (!controller) throw new Error('controller param is required')

    return async function fastifyController(request, reply) {
        request.session.userId = 'pippo'
        const session = {
            setData: (data) => { request.session.data = data },
            get: () => request.session,
            destroy: () => request.destroySession(),
        }
        const requestId = request.id
        const tenantId = request.headers['x-tenant-id']
        let httpResponse = null
        try {
            httpResponse = await controller(tenantId, request, reply, { logger: request.log, requestId, session })
        } catch (error) {
            if (error.kind === 'ObjectId' && error.path === '_id') {
                httpResponse = { statusCode: 404 }
            } else {
                throw error
            }
        }
        if (!httpResponse) {
            return reply.send()
        }
        if (httpResponse.headers) {
            reply.headers(httpResponse.headers)
        }
        if (httpResponse.statusCode) {
            reply.code(httpResponse.statusCode)
        }
        if (httpResponse.redirect) {
            return reply.redirect(httpResponse.redirect)
        }
        return reply.send(httpResponse.body)
    }
}
