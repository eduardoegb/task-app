const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/user');

const { mockUserId, mockUser, setupDatabase, closeConnection } = require('./fixtures/db');

beforeEach(setupDatabase);

afterAll(closeConnection);

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Test',
      email: 'test@example.com',
      password: '987654321'
    })
    .expect(201);

    // Assert that the database is changed correctly
  const user = await User.findById(response.body.user._id);
  
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Test',
      email: 'test@example.com'
    },
    token: user.tokens[0].token
  });
  expect(user.password).not.toBe('987654321');
});

test('Should fail signup a new user with short password', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Test',
      email: 'test@example.com',
      password: '654321'
    })
    .expect(400);
});

test('Should fail signup a new user with a duplicate email', async () => {
  await request(app)
    .post('/users').send({
      name: 'Test',
      email: 'user@example.com',
      password: '987654321'
    })
    .expect(400);
});

test('Should signin with an existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: mockUser.email,
      password: mockUser.password
    })
    .expect(200);

  // Matching new token in database
  const user = await User.findById(mockUserId);
  
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should fail signin with an existing user and wrong credentials', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: mockUser.email,
      password: 'qwerty'
    })
    .expect(400);
});

test('Should fetch user profile', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not fetch user profile if unauthenticated', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete account', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
    .send()
    .expect(200);

  // Validating user is actually removed
  const user = await User.findById(mockUserId);

  expect(user).toBeNull();
});

test('Should not delete account if unauthenticated', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
});

test('Should upload a profile pic', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
    .attach('avatar', './tests/fixtures/profile-pic.jpg')
    .expect(200);

  // Validating profile picture is actually in the database
  const user = await User.findById(mockUserId);

  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update with valid fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
    .send({
      name: "Update",
      email: "update@example.com"
    })
    .expect(200);

  // Validating fields are actually changed
  const user = await User.findById(mockUserId);

  expect(user).toMatchObject({
    name: "Update",
    email: "update@example.com"
  });
});

test('Should not update with invalid fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
    .send({
      name: "Update",
      email: "update@example.com",
      location: "Updating"
    })
    .expect(400);
});
