// Express module
const express = require('express');
// Mongoose connection
require('./db/mongoose');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log('Server is runnng in port ' + port);
});