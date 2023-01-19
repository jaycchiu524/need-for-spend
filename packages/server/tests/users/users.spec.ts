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
    expect(response.body).toHaveProperty('userId')
    expect(response.body).toHaveProperty('accessToken')
    expect(response.body).toHaveProperty('refreshToken')
    expect(response.body).toHaveProperty('expiresIn')

    firstUserIdTest = response.body.userId
    accessToken = response.body.accessToken
    refreshToken = response.body.refreshToken
  })

  it('should not create a new user with an existing email', async () => {
    const response = await request.post('/auth/register').send(requestBody)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })

  /** Update User */

  it('should update the user info', async () => {
    const response = await request
      .put(`/users/${firstUserIdTest}`)
      .send({ firstName: 'Sekiro' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id') // check if the user id is returned from params.userId
    expect(response.body).toHaveProperty('firstName')
    expect(response.body.firstName).toBe('Sekiro')
  })

  it('should not update the user info with an existing email', async () => {
    const response = await request
      .put(`/users/${firstUserIdTest}`)
      .send({ email: requestBody.email })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })

  it('should not update with empty body', async () => {
    const response = await request.put(`/users/${firstUserIdTest}`).send({})

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
