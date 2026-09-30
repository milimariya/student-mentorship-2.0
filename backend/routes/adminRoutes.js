const express = require('express');
const {
  getAdminDashboard,
  getAllUsers,
  toggleUserStatus,
  getPendingMentors,
  approveMentor,
  getStudentMentorAssignments,
  assignStudentToMentorAdmin,
  getAnnouncements,
  createAnnouncement,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), getAdminDashboard);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.patch('/users/:id/status', protect, authorize('admin'), toggleUserStatus);
router.get('/mentors', protect, authorize('admin'), getPendingMentors);
router.patch('/mentors/:id/approve', protect, authorize('admin'), approveMentor);
router.get('/assignments', protect, authorize('admin'), getStudentMentorAssignments);
router.post('/assignments', protect, authorize('admin'), assignStudentToMentorAdmin);
router.get('/announcements', protect, authorize('admin'), getAnnouncements);
router.post('/announcements', protect, authorize('admin'), createAnnouncement);

module.exports = router;
