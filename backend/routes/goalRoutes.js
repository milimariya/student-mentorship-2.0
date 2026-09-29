const express = require('express');
const { createGoal, getGoalsByStudent, updateGoal } = require('../controllers/goalController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('student'), createGoal);
router.get('/:studentId', protect, authorize('student', 'mentor'), getGoalsByStudent);
router.put('/:id', protect, authorize('student'), updateGoal);

module.exports = router;
