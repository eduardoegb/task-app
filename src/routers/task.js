const express = require('express');

const Task = require('../models/task');

const router = new express.Router();

// TASKS
// Create task
router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});

    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get one task
router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.is);

    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update task
router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ['description', 'completed'];
  const isAllowed = updates.every(key => allowed.includes(key));

  if (!isAllowed) {
    res.status(400).send('Invalid update!');
  }

  try {
    const task = await Task.findById(req.params.id);

    updates.forEach(update => task[update] = req.body[update]);
    await task.save();

    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Deelete task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
