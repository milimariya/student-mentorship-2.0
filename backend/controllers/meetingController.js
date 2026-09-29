const Meeting = require('../models/Meeting');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');

const createMeeting = async (req, res) => {
  try {
    const { studentId, mentorId, date, time, type, agenda } = req.body;

    if (!studentId || !date || !time) {
      return res.status(400).json({ message: 'Student, date and time are required' });
    }

    let student;
    let mentor;
    let status;

    if (req.user.role === 'mentor') {
      mentor = await Mentor.findOne({ user: req.user._id });
      if (!mentor) {
        return res.status(404).json({ message: 'Mentor profile not found' });
      }

      student = await Student.findOne({ _id: studentId, mentor: mentor._id });
      if (!student) {
        return res.status(403).json({ message: 'You can only schedule meetings with your assigned students' });
      }
      status = 'scheduled';
    } else {
      student = await Student.findOne({ _id: studentId, user: req.user._id });
      if (!student) {
        return res.status(403).json({ message: 'You can only request meetings for your own profile' });
      }

      if (!student.mentor) {
        return res.status(400).json({ message: 'A mentor must be assigned before requesting a meeting' });
      }

      mentor = await Mentor.findById(student.mentor);
      if (!mentor || (mentorId && mentor._id.toString() !== mentorId)) {
        return res.status(400).json({ message: 'The selected mentor is not assigned to you' });
      }
      status = 'requested';
    }

    const meeting = await Meeting.create({
      student: student._id,
      mentor: mentor._id,
      date,
      time,
      type: type || 'academic',
      agenda: agenda || '',
      status,
    });

    req.app.get('io').to(`user-${student.user.toString()}`).emit('newNotification', {
      message: status === 'scheduled' ? 'Your mentor scheduled a meeting with you' : 'A mentor meeting has been requested',
      type: 'meeting',
    });

    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create meeting', error: error.message });
  }
};

const getMentorMeetings = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user._id });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    const meetings = await Meeting.find({ mentor: mentor._id })
      .populate({ path: 'student', populate: { path: 'user' } })
      .sort({ date: 1, time: 1 });

    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mentor meetings', error: error.message });
  }
};

const getMeetingsByStudent = async (req, res) => {
  try {
    const meetings = await Meeting.find({ student: req.params.studentId }).populate('mentor').sort({ date: 1 });
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch meetings', error: error.message });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    Object.assign(meeting, req.body);
    await meeting.save();

    res.status(200).json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update meeting', error: error.message });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    await Meeting.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete meeting', error: error.message });
  }
};

module.exports = {
  createMeeting,
  getMentorMeetings,
  getMeetingsByStudent,
  updateMeeting,
  deleteMeeting,
};
