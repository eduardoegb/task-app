// Node modules
const express = require('express');
// Mongoose connection
require('./db/mongoose');
// Routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log('Server is runnng in port ' + port);
});
