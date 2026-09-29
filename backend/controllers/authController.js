const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const registerUser = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'Registration is unavailable because JWT_SECRET is not configured',
      });
    }

    const { name, email, password, role, department, expertise, phone, bio, year } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }

    if (!['student', 'mentor'].includes(role)) {
      return res.status(400).json({ message: 'Role must be student or mentor' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() }).select('+password');
    let user = existingUser;

    if (existingUser) {
      const passwordMatches = await bcrypt.compare(password, existingUser.password);
      const existingProfile = role === 'student'
        ? await Student.findOne({ user: existingUser._id })
        : await Mentor.findOne({ user: existingUser._id });

      if (existingUser.role !== role || !passwordMatches || existingProfile) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
      });
    }

    try {
      if (role === 'student') {
        await Student.create({
          user: user._id,
          department: department || '',
          year: year || '',
          phone: phone || '',
          bio: bio || '',
        });
      }

      if (role === 'mentor') {
        await Mentor.create({
          user: user._id,
          expertise: expertise || '',
          department: department || '',
          phone: phone || '',
          bio: bio || '',
        });
      }
    } catch (error) {
      if (!existingUser) {
        await User.deleteOne({ _id: user._id });
      }
      throw error;
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!['student', 'mentor'].includes(user.role)) {
      return res.status(403).json({ message: 'This account role is no longer supported' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    let profile = {};
    if (user.role === 'student') {
      profile = await Student.findOne({ user: user._id }).populate('mentor');
    }

    if (user.role === 'mentor') {
      profile = await Mentor.findOne({ user: user._id });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to get user profile', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
