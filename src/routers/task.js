const express = require('express');

const Task = require('../models/task');
const auth = require('../middlewares/auth');

const router = new express.Router();

// Create task
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all tasks
router.get('/tasks', auth, async (req, res) => {
  try {
    await req.user.populate('tasks').execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get one task
router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update task
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ['description', 'completed'];
  const isAllowed = updates.every(key => allowed.includes(key));

  if (!isAllowed) {
    res.status(400).send('Invalid update!');
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Deelete task
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
