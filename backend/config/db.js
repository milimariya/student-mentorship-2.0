const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const students = conn.connection.collection('students');
    const indexes = await students.indexes();
    const obsoleteStudentIdIndex = indexes.find(
      (index) =>
        index.name === 'studentId_1' &&
        index.unique === true &&
        Object.keys(index.key).length === 1 &&
        index.key.studentId === 1
    );

    if (obsoleteStudentIdIndex) {
      await students.dropIndex(obsoleteStudentIdIndex.name);
      console.log('Removed obsolete students.studentId_1 index');
    }

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
