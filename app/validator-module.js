const problemJson = require('./problem-json')

function validatorModule(validatorFn) {
    return function validator(data) {
        const valid = validatorFn(data)
        if (!valid) {
            return problemJson('validation-error', validatorFn.errors)
        }
        return null
    }
}

module.exports = validatorModule
