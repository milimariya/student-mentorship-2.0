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
    const concern = await Concern.findById(req.params.id);
    if (!concern) {
      return res.status(404).json({ message: 'Concern not found' });
    }

    const mentor = await Mentor.findOne({ user: req.user._id });
    if (mentor && concern.mentor.toString() !== mentor._id.toString()) {
      return res.status(403).json({ message: 'Only the assigned mentor can respond to this concern' });
    }

    concern.response = req.body.response || concern.response;
    concern.status = req.body.status || concern.status;
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
