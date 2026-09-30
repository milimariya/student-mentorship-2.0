const express = require('express');
const { getAnnouncementsForUser } = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getAnnouncementsForUser);

module.exports = router;
