const { makePostUser } = require('./controllers')
const { validateUser } = require('./validators')

describe('Post user controller', () => {
    test('with valid data should return the new user resource', async () => {
        const fakeUser = {
            username: 'Foo',
            password: 'Bar',
        }
        const postUser = makePostUser({
            userRepository: { create: (t, e) => ({ ...e, id: 'id' }) },
            validateUser: () => null,
        })

        const response = await postUser('tenantId', { body: fakeUser })

        expect(response.body).toBeDefined()
        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe('id')
        expect(response.body.password).toBeUndefined()
    })

    test('with invalid data should return a problemJSON error', async () => {
        const fakeUser = {
            username: 'Foo',
            password: 1,
        }
        const postUser = makePostUser({
            userRepository: { create: (t, e) => ({ ...e, id: 'id' }) },
            validateUser,
        })

        const response = await postUser('tenantId', { body: fakeUser })

        expect(response.body).toBeDefined()
        expect(response.statusCode).toBe(400)
        expect(response.body.more_data[0].instancePath).toBe('/password')
        expect(response.body.more_data[0].keyword).toBe('type')
    })
})
