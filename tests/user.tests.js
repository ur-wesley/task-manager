const request = require('supertest')
const app = require('../src/app')

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Test Name',
        email: 'test@urwesley.de',
        password: 'TestPassword'
    }).expect(201)
})
