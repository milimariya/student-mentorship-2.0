const express = require('express');
const { createMeeting, getMeetingsByStudent, updateMeeting, deleteMeeting } = require('../controllers/meetingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('student', 'mentor'), createMeeting);
router.get('/:studentId', protect, authorize('student', 'mentor', 'admin'), getMeetingsByStudent);
router.put('/:id', protect, authorize('student', 'mentor'), updateMeeting);
router.delete('/:id', protect, authorize('student', 'mentor', 'admin'), deleteMeeting);

module.exports = router;
