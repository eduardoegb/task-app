const request = require('supertest');

const app = require('../src/app');
const Task = require('../src/models/task');

const {
  mockUser,
  mockUserWithTasks,
  mockTask,
  mockCompletedTask,
  setupDatabase,
  closeConnection
} = require('./fixtures/db');

beforeEach(setupDatabase);

afterAll(closeConnection);

test('Should create a new task', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${mockUserWithTasks.tokens[0].token}`)
    .send({
      description: 'Testing app'
    })
    .expect(201);

    // Validating the task is created in the database
    const task = await Task.findById(response.body._id);

    expect(task).not.toBeNull();

    // Assertions about task fields
    expect(task.completed).toBeFalsy();
    expect(task.description).toBe('Testing app')
});

test('Should not create a new task if unauthenticated', async () => {
  await request(app)
    .post('/tasks')
    .send({
      description: 'Testing app'
    })
    .expect(401);
});

test('Should fetch users tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${mockUserWithTasks.tokens[0].token}`)
    .expect(200);

  expect(response.body.length).toEqual(2);
});

test('Should not fetch others users tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(0);
});

test('Should delete task', async () => {
  await request(app)
    .delete(`/tasks/${mockCompletedTask._id}`)
    .set('Authorization', `Bearer ${mockUserWithTasks.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not delete others users task', async () => {
  await request(app)
    .delete(`/tasks/${mockCompletedTask._id}`)
    .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
    .send()
    .expect(404);
});

test('Should update task', async () => {
  await request(app)
    .patch(`/tasks/${mockTask._id}`)
    .set('Authorization', `Bearer ${mockUserWithTasks.tokens[0].token}`)
    .send({ completed: true })
    .expect(200);

  // Validating tasks are completed
  const tasks = await Task.find({ completed: true, owner: mockUserWithTasks._id });

  expect(tasks.length).toEqual(2);
});

test('Should not update others users task', async () => {
  await request(app)
    .patch(`/tasks/${mockCompletedTask._id}`)
    .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
    .send({ completed: false })
    .expect(404);
});
