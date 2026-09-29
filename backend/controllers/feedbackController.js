const Feedback = require('../models/Feedback');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');

const createFeedback = async (req, res) => {
  try {
    const { studentId, meetingId, comments, rating } = req.body;

    if (!studentId || !comments || !rating) {
      return res.status(400).json({ message: 'Student, comments and rating are required' });
    }

    const mentor = await Mentor.findOne({ user: req.user._id });
    const student = await Student.findById(studentId);

    if (!mentor || !student) {
      return res.status(404).json({ message: 'Mentor or student not found' });
    }

    if (student.mentor && student.mentor.toString() !== mentor._id.toString()) {
      return res.status(403).json({ message: 'This student is not assigned to your mentorship list' });
    }

    const feedback = await Feedback.create({
      student: student._id,
      mentor: mentor._id,
      meeting: meetingId || null,
      comments,
      rating,
    });

    req.app.get('io').to(`user-${student.user.toString()}`).emit('newNotification', {
      message: 'You received new mentor feedback',
      type: 'feedback',
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create feedback', error: error.message });
  }
};

const getFeedbackByStudent = async (req, res) => {
  try {
    const feedback = await Feedback.find({ student: req.params.studentId }).populate('mentor').sort({ createdAt: -1 });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch feedback', error: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbackByStudent,
};
