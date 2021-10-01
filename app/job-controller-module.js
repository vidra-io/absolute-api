const crypto = require('crypto')
const logger = require('./logger')

module.exports = function jobControllerModule(controller) {
    return async function jobController(job) {
        const params = job.attrs.data
        const requestId = crypto.randomBytes(16).toString('hex')
        try {
            await controller(params || undefined, { logger, requestId, job })
            logger.info(`${requestId || 'MISSING'} - ${job.attrs.name} OK`)
            return true // this value will be used by Agenda and will crash the application if isn't compatible with Mongo
        } catch (error) {
            logger.info(`${requestId || 'MISSING'} - ${job.attrs.name} ERROR`)
            logger.error(error)
            logger.error(error.stack)
            return true // this value will be used by Agenda and will crash the application if isn't compatible with Mongo
        }
    }
}
