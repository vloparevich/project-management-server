const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Task = require('../models/Task.model');
const Project = require('../models/Project.model');

router.post('/tasks', (req, res, next) => {
  const { title, description, projectID } = req.body;
  Task.create({
    title,
    description,
    projectID,
  })
    .then((newlyCreatedTaskFromDB) => {
      return Project.findByIdAndUpdate(projectID, {
        $push: { tasks: newlyCreatedTaskFromDB._id },
      });
    })
    .then((response) => {
      return res.json({ success: true, message: response });
    })
    .catch((err) => res.json(err));
});

// GET route => to retrieve a specific task
router.get('/tasks/:taskId', (req, res, next) => {
  const { taskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res
      .status(400)
      .json({ success: false, message: 'Specified task Id is not valid' });
    return;
  }
  Task.findById(taskId)
    .populate('projectID')
    .then((task) => res.json({ message: task }))
    .catch((error) => res.json(error));
});

// PUT route => to update a specific task
router.put('/tasks/:taskId', (req, res, next) => {
  const { taskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res
      .status(400)
      .json({ success: false, message: `Specified id is not valid ${taskId}` });
    return;
  }
  Task.findByIdAndUpdate(taskId, req.body)
    .then((updatedTask) => {
      return res.json({
        message: `Task with ${taskId} is updated successfully`,
      });
    })
    .catch((err) => res.json(err));
});

//DELETE route => to delete a specific task
router.delete('/tasks/:taskId', (req, res, next) => {
  const { taskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res
      .status(400)
      .json({ success: false, message: `Specified task id is not valid` });
    return;
  }
  Task.findByIdAndRemove(taskId)
    .then(() => {
      return res.json({
        message: `Task with ${taskId} is removed successfully.`,
      });
    })
    .catch((err) => res.json(err));
});

module.exports = router;
