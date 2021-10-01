const logger = require('./logger')

module.exports = function expressControllerModule(controller) {
    if (!controller) throw new Error('controller param is required')

    return async function expressController(req, res, next) {
        const tenantId = req.get('x-tenant-id')
        const requestId = req.get('x-request-id')
        let httpResponse = {}
        try {
            httpResponse = await controller(
                tenantId,
                {
                    headers: req.headers, body: req.body, params: req.params, query: req.query,
                },
                null,
                { logger, requestId },
            )
        } catch (error) {
            return next(error)
        }

        if (httpResponse.headers) {
            res.set(httpResponse.headers)
        }
        if (httpResponse.statusCode) {
            res.status(httpResponse.statusCode)
        }
        if (httpResponse.redirect) {
            return res.redirect(httpResponse.statusCode || 301, httpResponse.redirect)
        }
        if (httpResponse.data) {
            return res.send(httpResponse.data)
        }
        return res.json(httpResponse.body)
    }
}
