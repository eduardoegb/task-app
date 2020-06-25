// Node modules
const express = require('express');
// Mongoose connection
require('./db/mongoose');
// Routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;