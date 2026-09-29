const express = require('express');
const { createConcern, getConcernsByStudent, updateConcern } = require('../controllers/concernController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('student'), createConcern);
router.get('/:studentId', protect, authorize('student', 'mentor', 'admin'), getConcernsByStudent);
router.put('/:id', protect, authorize('mentor'), updateConcern);

module.exports = router;
