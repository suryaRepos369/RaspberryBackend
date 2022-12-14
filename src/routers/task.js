const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
//
router.get('/tasks', auth, async (req, res) => {
  const match1 = {};

  if (req.query.completed) {
    req.query.completed === 'true' ? (match1.completed = true) : (match = {});
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    const val = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    // if (req.query.sortBy) {
    //   const parts = req.query.sortBy.split(':');
    //   const val = parts[1] === 'desc' ? -1 : 1;
    // }
    //   await req.user
    //     .populate({
    //       path: 'tasks',
    //       match,
    //       options: {
    //         limit: parseInt(req.query.limit),
    //         skip: parseInt(req.query.skip),
    //         sort,
    //       },
    //     })
    //     .execPopulate();
    //   console.log(req.user.tasks);
    console.log(match1);
    const task = await Task.find({ owner: req.user._id }, [('description', 'completed')], {
      limit: 4,
      match: match1,
    });
    res.send(task);
  } catch (e) {
    res.status(500).send('Unknown error' + e);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
