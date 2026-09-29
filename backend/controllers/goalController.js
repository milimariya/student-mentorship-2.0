const Goal = require('../models/Goal');
const Student = require('../models/Student');

const createGoal = async (req, res) => {
  try {
    const { title, description, deadline, status } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ message: 'Title and deadline are required' });
    }

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const goal = await Goal.create({
      student: student._id,
      title,
      description,
      deadline,
      status: status || 'pending',
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create goal', error: error.message });
  }
};

const getGoalsByStudent = async (req, res) => {
  try {
    const goals = await Goal.find({ student: req.params.studentId }).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch goals', error: error.message });
  }
};

const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    Object.assign(goal, req.body);
    await goal.save();

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update goal', error: error.message });
  }
};

module.exports = {
  createGoal,
  getGoalsByStudent,
  updateGoal,
};
