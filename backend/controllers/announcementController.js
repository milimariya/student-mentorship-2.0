const Announcement = require('../models/Announcement');

const getAnnouncementsForUser = async (req, res) => {
  try {
    const role = req.user.role;
    const audienceTargets = ['all'];

    if (role === 'student') {
      audienceTargets.push('students');
    }

    if (role === 'mentor') {
      audienceTargets.push('mentors');
    }

    if (role === 'admin') {
      audienceTargets.push('students', 'mentors');
    }

    const announcements = await Announcement.find({
      isActive: true,
      audience: { $in: audienceTargets },
    })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch announcements', error: error.message });
  }
};

module.exports = {
  getAnnouncementsForUser,
};
