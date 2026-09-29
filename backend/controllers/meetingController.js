const Meeting = require('../models/Meeting');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');

const createMeeting = async (req, res) => {
  try {
    const { studentId, mentorId, date, time, type, agenda, status } = req.body;

    if (!studentId || !mentorId || !date || !time) {
      return res.status(400).json({ message: 'Student, mentor, date and time are required' });
    }

    const student = await Student.findById(studentId);
    const mentor = await Mentor.findById(mentorId);

    if (!student || !mentor) {
      return res.status(404).json({ message: 'Student or mentor not found' });
    }

    const meeting = await Meeting.create({
      student: student._id,
      mentor: mentor._id,
      date,
      time,
      type: type || 'academic',
      agenda: agenda || '',
      status: status || 'requested',
    });

    req.app.get('io').to(`user-${student.user.toString()}`).emit('newNotification', {
      message: 'A mentor meeting has been requested',
      type: 'meeting',
    });

    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create meeting', error: error.message });
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
  getMeetingsByStudent,
  updateMeeting,
  deleteMeeting,
};
