const express = require('express');
const {
  getDashboard,
  getAssignedStudents,
  getStudentDetails,
  getAvailableStudents,
  assignStudentToMentor,
} = require('../controllers/mentorController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, authorize('mentor'), getDashboard);
router.get('/students', protect, authorize('mentor'), getAssignedStudents);
router.get('/available-students', protect, authorize('mentor'), getAvailableStudents);
router.post('/assign-student', protect, authorize('mentor'), assignStudentToMentor);
router.get('/students/:studentId', protect, authorize('mentor'), getStudentDetails);

module.exports = router;
