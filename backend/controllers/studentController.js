const Student = require('../models/Student');
const User = require('../models/User');
const Goal = require('../models/Goal');
const Meeting = require('../models/Meeting');
const Concern = require('../models/Concern');
const Feedback = require('../models/Feedback');

const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('user').populate('mentor');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student profile', error: error.message });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updates = req.body;
    Object.assign(student, updates);
    await student.save();

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

const getAssignedMentor = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate({
      path: 'mentor',
      populate: { path: 'user' },
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student.mentor || null);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assigned mentor', error: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate({
      path: 'mentor',
      populate: { path: 'user' },
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const activeGoals = await Goal.countDocuments({ student: student._id, status: 'active' });
    const upcomingMeetings = await Meeting.countDocuments({ student: student._id, status: { $in: ['requested', 'scheduled'] } });
    const pendingConcerns = await Concern.countDocuments({ student: student._id, status: { $ne: 'resolved' } });

    res.status(200).json({
      mentor: student.mentor,
      activeGoals,
      upcomingMeetings,
      pendingConcerns,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard', error: error.message });
  }
};

const getStudentResources = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const goals = await Goal.find({ student: student._id }).sort({ createdAt: -1 });
    const concerns = await Concern.find({ student: student._id }).sort({ createdAt: -1 });
    const meetings = await Meeting.find({ student: student._id }).populate('mentor').sort({ date: 1 });
    const feedback = await Feedback.find({ student: student._id }).populate('mentor').sort({ createdAt: -1 });

    res.status(200).json({ goals, concerns, meetings, feedback });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student resources', error: error.message });
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getAssignedMentor,
  getDashboard,
  getStudentResources,
};
