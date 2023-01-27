import { nanoid } from 'nanoid'
import supertest from 'supertest'
import app from '../../src/app'

let firstUserIdTest = '' // used to store the id of the first user created for testing purposes

const requestBody = {
  email: `test${nanoid()}@test.com`,
  password: 'test123',
  firstName: 'John',
  lastName: 'Doe',
}

let accessToken = '' // used to store the token of the first user created for testing purposes
let refreshToken = '' // used to store the refresh token of the first user created for testing purposes
// const newFirstName = 'Sekiro'
// const newFirstName2 = 'Geralt'
// const newLastName2 = 'Kimura'

describe('Users', () => {
  let request: supertest.SuperTest<supertest.Test>
  beforeAll(function () {
    request = supertest.agent(app)
  })
  afterAll(function () {
    app.close()
  })

  /** Create User */

  it('should create a new user', async () => {
    const response = await request.post('/auth/register').send(requestBody)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('accessToken')
    expect(response.body).toHaveProperty('refreshToken')
    expect(response.body).toHaveProperty('exp')
    expect(response.body.exp).toBeGreaterThan(Date.now() / 1000 + 5 * 59) // expiresIn '5m'

    firstUserIdTest = response.body.id
    accessToken = response.body.accessToken
    refreshToken = response.body.refreshToken
  })

  it('should not create a new user with an existing email', async () => {
    const response = await request.post('/auth/register').send(requestBody)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })

  /** Get user/:id */
  it('should not get the user info with an invalid id', async () => {
    const response = await request
      .get('/users/invalid-id')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message')
  })

  it('should not get the user info with no access token', async () => {
    const response = await request.get(`/users/${firstUserIdTest}`)

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
  })

  it('should return 401 with expired token', async () => {
    jest
      .useFakeTimers({
        doNotFake: [
          'nextTick',
          'setImmediate',
          'clearImmediate',
          'setInterval',
          'clearInterval',
          'setTimeout',
          'clearTimeout',
        ],
      })
      .setSystemTime(new Date('2024-01-01T00:00:00.000Z'))

    const response = await request
      .get(`/users/${firstUserIdTest}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(401)

    jest.useRealTimers()
  })

  it('should get the user info', async () => {
    const response = await request
      .get(`/users/${firstUserIdTest}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id') // check if the user id is returned from params.userId
    expect(response.body).toHaveProperty('firstName')
    expect(response.body).toHaveProperty('lastName')
  })

  /** Update User */
  it('should update the user info', async () => {
    const response = await request
      .put(`/users/${firstUserIdTest}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ firstName: 'Sekiro' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id') // check if the user id is returned from params.userId
    expect(response.body).toHaveProperty('firstName')
    expect(response.body.firstName).toBe('Sekiro')
  })

  it('should not update the user info with an existing email', async () => {
    const response = await request
      .put(`/users/${firstUserIdTest}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ email: requestBody.email })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })

  it('should not update with empty body', async () => {
    const response = await request
      .put(`/users/${firstUserIdTest}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })

  describe('Authentication', () => {
    /** Login */

    it('should login with the user credentials', async () => {
      const response = await request
        .post('/auth/login')
        .send({ email: requestBody.email, password: requestBody.password })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('accessToken')
      expect(response.body).toHaveProperty('refreshToken')

      accessToken = response.body.accessToken
      refreshToken = response.body.refreshToken
    })

    it('should not login with an invalid password', async () => {
      const response = await request
        .post('/auth/login')
        .send({ email: requestBody.email, password: 'wrongPassword' })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('message')
    })

    it('should not login with an invalid email', async () => {
      const response = await request.post('/auth/login').send({
        email: 'doNotExist@doNotExist.com',
        password: requestBody.password,
      })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('message')
    })

    /** Refresh Token */
    it('should refresh the access token', async () => {
      const response = await request
        .post('/auth/refresh-token')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken: refreshToken })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('accessToken')
      expect(response.body).toHaveProperty('refreshToken')

      accessToken = response.body.accessToken
      refreshToken = response.body.refreshToken
    })
  })
})
