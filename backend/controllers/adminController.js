const User = require('../models/User');
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const Announcement = require('../models/Announcement');

const getAdminDashboard = async (req, res) => {
  try {
    const [totalUsers, students, mentors, admins, recentUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'mentor' }),
      User.countDocuments({ role: 'admin' }),
      User.find().sort({ createdAt: -1 }).limit(6).select('-password'),
    ]);

    res.status(200).json({
      totalUsers,
      students,
      mentors,
      admins,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to load admin dashboard',
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update user status',
      error: error.message,
    });
  }
};

const getPendingMentors = async (req, res) => {
  try {
    const [pendingMentors, approvedMentors] = await Promise.all([
      Mentor.find({
        $or: [{ isApproved: false }, { isApproved: { $exists: false } }],
      }).populate('user').sort({ createdAt: -1 }),
      Mentor.find({ isApproved: true }).populate('user').sort({ createdAt: -1 }),
    ]);

    res.status(200).json({ pendingMentors, approvedMentors });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mentor data', error: error.message });
  }
};

const approveMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).populate('user');
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    mentor.isApproved = true;
    await mentor.save();

    res.status(200).json({
      message: 'Mentor approved successfully',
      mentor,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve mentor', error: error.message });
  }
};

const getStudentMentorAssignments = async (req, res) => {
  try {
    const [students, mentors] = await Promise.all([
      Student.find()
        .populate('user')
        .populate({ path: 'mentor', populate: { path: 'user' } })
        .sort({ createdAt: -1 }),
      Mentor.find({ isApproved: true }).populate('user').sort({ createdAt: -1 }),
    ]);

    res.status(200).json({ students, mentors });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignment data', error: error.message });
  }
};

const assignStudentToMentorAdmin = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    if (!studentId || !mentorId) {
      return res.status(400).json({ message: 'Student and mentor are required' });
    }

    const [student, mentor] = await Promise.all([
      Student.findById(studentId),
      Mentor.findById(mentorId),
    ]);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!mentor || !mentor.isApproved) {
      return res.status(400).json({ message: 'Selected mentor is not approved yet' });
    }

    student.mentor = mentor._id;
    await student.save();

    res.status(200).json({ message: 'Student assigned to mentor successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign student', error: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).populate('createdBy', 'name email');
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch announcements', error: error.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { message, audience } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Announcement message is required' });
    }

    const finalAudience = ['all', 'students', 'mentors'].includes(audience) ? audience : 'all';

    const announcement = await Announcement.create({
      message: message.trim(),
      audience: finalAudience,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: 'Announcement created successfully', announcement });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create announcement', error: error.message });
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  toggleUserStatus,
  getPendingMentors,
  approveMentor,
  getStudentMentorAssignments,
  assignStudentToMentorAdmin,
  getAnnouncements,
  createAnnouncement,
};
