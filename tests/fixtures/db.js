const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const mockUserId = new mongoose.Types.ObjectId();
const mockUser = {
  _id: mockUserId,
  name: 'User',
  email: 'user@example.com',
  password: '123456789',
  tokens: [{
    token: jwt.sign({ _id: mockUserId }, process.env.JWT_SECRET)
  }]
}

const mockUserWithTasksId = new mongoose.Types.ObjectId();
const mockUserWithTasks = {
  _id: mockUserWithTasksId,
  name: 'User with tasks',
  email: 'userwithtasks@example.com',
  password: '123456789',
  tokens: [{
    token: jwt.sign({ _id: mockUserWithTasksId }, process.env.JWT_SECRET)
  }]
}

const mockTask = {
  _id: new mongoose.Types.ObjectId(),
  description: 'This task is not completed',
  owner: mockUserWithTasksId
}

const mockCompletedTask = {
  _id: new mongoose.Types.ObjectId(),
  description: 'This task is completed',
  completed: true,
  owner: mockUserWithTasksId
}

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(mockUser).save();
  await new User(mockUserWithTasks).save();
  await new Task(mockTask).save(),
  await new Task(mockCompletedTask).save();
}

const closeConnection = async () => {
  await mongoose.connection.close();
}

module.exports = {
  mockUserId,
  mockUser,
  mockUserWithTasksId,
  mockUserWithTasks,
  mockTask,
  mockCompletedTask,
  setupDatabase,
  closeConnection
}