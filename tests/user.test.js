const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, userOneId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Signup new user', async () => {
    const res = await request(app).post('/users').send({
        name: 'Test Name',
        email: 'test@urwesley.de',
        password: 'TestPassword'
    }).expect(201)

    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()

    expect(res.body.user.name).toBe('Test Name')
    expect(res.body).toMatchObject({
        user: {
            name: 'Test Name',
            email: 'test@urwesley.de'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('TestPassword')
})

test('Login user', async () => {
    const res = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(res.body.user._id)
    expect(res.body.token).toBe(user.tokens[1].token)
})

test('Fail login user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'userOne.password'
    }).expect(400)
})

test('Get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('AuthFail: Get user profile', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Delete user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('AuthFail: Delete user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/logo.png')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Update user profile', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            age: 20
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.age).toBe(20)
})

test('Fail: Update user profile', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'FailLand'
        })
        .expect(400)
})