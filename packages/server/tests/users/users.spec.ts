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
  beforeAll(function() {
    request = supertest.agent(app)
  })
  afterAll(function() {
    app.close()
  })

  it('should create a new user', async () => {
    const response = await request.post('/users').send(requestBody)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')

    firstUserIdTest = response.body.id
  })

  it('should not create a new user with an existing email', async () => {
    const response = await request.post('/users').send(requestBody)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })
})