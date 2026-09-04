const express = require('express');
const router = express.Router();
const { getTasks, getTaskById, updateTaskStatus } = require('../controllers/taskController');

// GET /api/tasks         — list all tasks (reports) with optional filters
// GET /api/tasks/:id     — single task detail
// PATCH /api/tasks/:id/status — transition task status
router.route('/').get(getTasks);
router.route('/:id').get(getTaskById);
router.route('/:id/status').patch(updateTaskStatus);

module.exports = router;
