const logger = require('pino')({
    prettyPrint: {
        colorize: true,
        timestampKey: 'time',
        translateTime: true,
        ignore: 'pid,hostname,time,reqId',
    },
})

module.exports = logger
