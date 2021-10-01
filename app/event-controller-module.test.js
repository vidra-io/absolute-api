const eventHandlerModule = require('./event-controller-module')

describe('Event handler module', () => {
    test("with a controller error should return an handler that doesn't crash the application", async () => {
        const controller = () => {
            throw new Error()
        }
        const handler = eventHandlerModule(controller)

        const action = () => handler('tenantId', null, {
            fields: { routingKey: 'routingKey' },
            properties: { headers: { 'x-request-id': 'requestId' } },
        })

        await expect(action()).resolves.not.toThrow()
    })
})
