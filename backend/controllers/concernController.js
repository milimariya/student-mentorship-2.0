const Concern = require('../models/Concern');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');

const createConcern = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const student = await Student.findOne({ user: req.user._id }).populate('mentor');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.mentor) {
      return res.status(400).json({ message: 'Please assign a mentor before raising a concern' });
    }

    const concern = await Concern.create({
      student: student._id,
      mentor: student.mentor._id,
      title,
      description,
      status: 'open',
    });

    req.app.get('io').to(`user-${student.mentor.user.toString()}`).emit('newNotification', {
      message: 'A new student concern needs your attention',
      type: 'concern',
    });

    res.status(201).json(concern);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create concern', error: error.message });
  }
};

const getConcernsByStudent = async (req, res) => {
  try {
    const concerns = await Concern.find({ student: req.params.studentId }).populate('mentor').sort({ createdAt: -1 });
    res.status(200).json(concerns);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch concerns', error: error.message });
  }
};

const updateConcern = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user._id });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    const concern = await Concern.findOne({ _id: req.params.id, mentor: mentor._id });
    if (!concern) {
      return res.status(404).json({ message: 'Concern not found' });
    }

    const { response, status } = req.body;
    if (status !== undefined && !['open', 'active', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid concern status' });
    }

    if (response !== undefined) {
      concern.response = response;
    }
    if (status !== undefined) {
      concern.status = status;
    }
    await concern.save();

    req.app.get('io').to(`user-${concern.student.toString()}`).emit('newNotification', {
      message: 'Your mentor responded to a concern',
      type: 'concern',
    });

    res.status(200).json(concern);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update concern', error: error.message });
  }
};

module.exports = {
  createConcern,
  getConcernsByStudent,
  updateConcern,
};
