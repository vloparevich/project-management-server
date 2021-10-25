// routes/project.routes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Project = require('../models/Project.model');
const Task = require('../models/Task.model');

// POST route => to create a new project
router.post('/projects', (req, res, next) => {
  const { title, description } = req.body;
  console.log('my title', title, description);
  Project.create({
    title,
    description,
    tasks: [],
  })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// GET route => to get the list of Projects
router.get('/projects', (req, res, next) => {
  Project.find()
    .populate('tasks')
    .then((allTheProjects) => {
      console.log('my all the projects', allTheProjects);
      res.json(allTheProjects);
    })
    .catch((err) => res.json({ success: false, message: err }));
});

// GET route to get a specific project/detailed view
router.get('/projects/:projectId', (req, res, next) => {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: 'Specified projectId is not valid' });
    return;
  }
  // Our projects have array of tasks' ids and
  // we can use .populate() method to get the whole task objects
  Project.findById(projectId)
    .populate('tasks')
    .then((foundProject) => res.status(200).json(foundProject))
    .catch((error) => res.json(error));
});

// PUT route => to update a specific project by its ID
router.put('/projects/:projectId', (req, res, next) => {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: 'Specified ID is not valid' });
    return;
  }
  Project.findByIdAndUpdate(projectId, req.body)
    .then(() => {
      return res.json({
        message: `Project with ${projectId} is updated successfully`,
      });
    })
    .catch((error) => res.json({ message: error }));
});

// DELETE route => to delete a specific project
router.delete('/projects/:projectId', (req, res, next) => {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Project.findByIdAndRemove(projectId)
    .then(() => {
      return res.json({
        message: `Project with ${projectId} is removed successfully.`,
      });
    })
    .catch((err) => res.json(err));
});

module.exports = router;
