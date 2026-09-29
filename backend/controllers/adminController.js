const User = require('../models/User');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
const Meeting = require('../models/Meeting');

const getDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const activeMentorships = await Student.countDocuments({ mentor: { $ne: null } });
    const totalMeetings = await Meeting.countDocuments();

    res.status(200).json({
      totalStudents,
      totalMentors,
      totalActiveMentorships: activeMentorships,
      totalMeetings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin dashboard', error: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}).populate('user').populate('mentor');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
};

const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({}).populate('user');
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mentors', error: error.message });
  }
};

const assignMentor = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    if (!studentId || !mentorId) {
      return res.status(400).json({ message: 'Student and mentor IDs are required' });
    }

    const student = await Student.findById(studentId);
    const mentor = await Mentor.findById(mentorId);

    if (!student || !mentor) {
      return res.status(404).json({ message: 'Student or mentor not found' });
    }

    student.mentor = mentor._id;
    await student.save();

    res.status(200).json({ message: 'Mentor assigned successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign mentor', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

module.exports = {
  getDashboard,
  getAllStudents,
  getAllMentors,
  assignMentor,
  deleteUser,
};
