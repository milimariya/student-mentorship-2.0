const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const Goal = require('../models/Goal');
const Concern = require('../models/Concern');
const Meeting = require('../models/Meeting');
const Feedback = require('../models/Feedback');

const updateMentorProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user._id });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const { expertise, department, phone, bio, availability } = req.body;
    Object.assign(mentor, { expertise, department, phone, bio, availability });
    await mentor.save();

    res.status(200).json(mentor);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user._id });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const assignedStudents = await Student.find({ mentor: mentor._id }).countDocuments();
    const upcomingMeetings = await Meeting.countDocuments({ mentor: mentor._id, status: { $in: ['requested', 'scheduled'] } });
    const pendingConcerns = await Concern.countDocuments({ mentor: mentor._id, status: { $ne: 'resolved' } });
    const studentsNeedingAttention = await Student.find({ mentor: mentor._id }).countDocuments();

    res.status(200).json({
      assignedStudents,
      upcomingMeetings,
      pendingConcerns,
      studentsNeedingAttention,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mentor dashboard', error: error.message });
  }
};

const getAssignedStudents = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user._id });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const students = await Student.find({ mentor: mentor._id }).populate('user');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
};

const getStudentDetails = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user._id });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const student = await Student.findById(req.params.studentId).populate('user');
    if (!student || student.mentor?.toString() !== mentor._id.toString()) {
      return res.status(403).json({ message: 'This student is not assigned to you' });
    }

    const goals = await Goal.find({ student: student._id }).sort({ createdAt: -1 });
    const concerns = await Concern.find({ student: student._id }).sort({ createdAt: -1 });
    const meetings = await Meeting.find({ student: student._id }).sort({ date: 1 });
    const feedback = await Feedback.find({ student: student._id }).sort({ createdAt: -1 });

    res.status(200).json({ student, goals, concerns, meetings, feedback });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student details', error: error.message });
  }
};

const getAvailableStudents = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user._id });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const students = await Student.find({
      $or: [{ mentor: null }, { mentor: { $exists: false } }],
    }).populate('user');

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch available students', error: error.message });
  }
};

const assignStudentToMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user._id });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.mentor && student.mentor.toString() !== mentor._id.toString()) {
      return res.status(400).json({ message: 'This student is already assigned to another mentor' });
    }

    student.mentor = mentor._id;
    await student.save();

    res.status(200).json({
      message: 'Student assigned successfully',
      student,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign student', error: error.message });
  }
};

module.exports = {
  updateMentorProfile,
  getDashboard,
  getAssignedStudents,
  getStudentDetails,
  getAvailableStudents,
  assignStudentToMentor,
};
