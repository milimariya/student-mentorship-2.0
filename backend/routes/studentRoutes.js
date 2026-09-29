const express = require('express');
const {
  getStudentProfile,
  updateStudentProfile,
  getAssignedMentor,
  getDashboard,
  getStudentResources,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, authorize('student'), getDashboard);
router.get('/resources', protect, authorize('student'), getStudentResources);
router.get('/mentor/:id', protect, authorize('student', 'mentor'), getAssignedMentor);
router.get('/:id', protect, authorize('student', 'mentor'), getStudentProfile);
router.put('/:id', protect, authorize('student'), updateStudentProfile);

module.exports = router;
