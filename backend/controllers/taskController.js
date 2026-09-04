const Report = require('../models/Report');

const VALID_TRANSITIONS = {
  Pending: 'In Progress',
  'In Progress': 'Resolved',
};

// @desc    Get all reports as tasks (filter by status, priority, area)
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    if (req.query.area) {
      filter.area = new RegExp(req.query.area, 'i');
    }

    const tasks = await Report.find(filter).sort({ reportedAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single task (report) by ID
// @route   GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
  try {
    const task = await Report.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task status (Pending → In Progress → Resolved)
// @route   PATCH /api/tasks/:id/status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'New status is required' });
    }

    const task = await Report.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Enforce valid transition
    const allowedNext = VALID_TRANSITIONS[task.status];
    if (allowedNext !== status) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition: ${task.status} → ${status}. Expected next status: ${allowedNext || 'none (already Resolved)'}`,
      });
    }

    // Require resolutionNote when resolving
    if (status === 'Resolved') {
      const note = resolutionNote ? resolutionNote.trim() : '';
      if (!note) {
        return res.status(400).json({
          success: false,
          message: 'A resolution note is required when resolving a task',
        });
      }
      task.resolutionNote = note;
    }

    task.status = status;
    task.updatedAt = Date.now();
    await task.save();

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
