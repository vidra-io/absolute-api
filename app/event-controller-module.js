const loggerModule = require('./logger')

module.exports = function eventHandlerModule(controller) {
    return async function eventHandler(tenantId, data, msg) {
        const eventName = msg.fields.routingKey
        const requestId = msg.properties.headers['x-request-id']
        const logger = {
            info: (m) => loggerModule.info(`${requestId} - ${tenantId} - ${m}`),
            error: (m) => loggerModule.error(`${requestId} - ${tenantId} - ${m}`),
        }
        try {
            await controller(eventName, tenantId, data, { logger, requestId })
            logger.info(`${requestId || 'MISSING'} - ${tenantId} - ${eventName} OK`)
        } catch (error) {
            logger.info(`${requestId || 'MISSING'} - ${tenantId} - ${eventName} ERROR`)
            logger.error(error)
            logger.error(error.stack)
        }
    }
}
