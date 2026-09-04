const express = require('express');
const router = express.Router();
const {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} = require('../controllers/reportController');

router.route('/')
  .get(getReports)
  .post(createReport);

router.route('/:id')
  .get(getReportById)
  .put(updateReport)
  .delete(deleteReport);

module.exports = router;
