const Ajv = require('ajv')
const makeValidator = require('../../app/validator-module')

const ajv = new Ajv()

const userSchema = {
    type: 'object',
    properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        tenant_id: { not: {} },
    },
    required: ['username', 'password'],

}

const userValidator = ajv.compile(userSchema)
const validateUser = makeValidator(userValidator)

module.exports = Object.freeze({
    validateUser,
})
