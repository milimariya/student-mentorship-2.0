const express = require('express');
const { getDashboard, getAllStudents, getAllMentors, assignMentor, deleteUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), getDashboard);
router.get('/students', protect, authorize('admin'), getAllStudents);
router.get('/mentors', protect, authorize('admin'), getAllMentors);
router.post('/assign-mentor', protect, authorize('admin'), assignMentor);
router.delete('/users/:userId', protect, authorize('admin'), deleteUser);

module.exports = router;
