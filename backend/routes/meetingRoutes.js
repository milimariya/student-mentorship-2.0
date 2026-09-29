const express = require('express');
const { createMeeting, getMentorMeetings, getMeetingsByStudent, updateMeeting, deleteMeeting } = require('../controllers/meetingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('student', 'mentor'), createMeeting);
router.get('/mentor', protect, authorize('mentor'), getMentorMeetings);
router.get('/:studentId', protect, authorize('student', 'mentor'), getMeetingsByStudent);
router.put('/:id', protect, authorize('student', 'mentor'), updateMeeting);
router.delete('/:id', protect, authorize('student', 'mentor'), deleteMeeting);

module.exports = router;
