const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const goalRoutes = require('./routes/goalRoutes');
const concernRoutes = require('./routes/concernRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Student Mentorship Management System API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/concerns', concernRoutes);
app.use('/api/feedback', feedbackRoutes);

io.on('connection', (socket) => {
  socket.on('registerUser', (userId) => {
    if (userId) {
      socket.join(`user-${userId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { io };