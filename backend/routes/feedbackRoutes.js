const express = require('express');
const { createFeedback, getFeedbackByStudent } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('mentor'), createFeedback);
router.get('/:studentId', protect, authorize('student', 'mentor', 'admin'), getFeedbackByStudent);

module.exports = router;
