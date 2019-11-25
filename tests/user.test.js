const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'UserOne',
    email: 'userOne@test.test',
    password: 'TestPassword',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

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