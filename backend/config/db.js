const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const students = conn.connection.collection('students');
    const mentors = conn.connection.collection('mentors');

    const studentIndexes = await students.indexes();
    const obsoleteStudentIdIndex = studentIndexes.find(
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

    const mentorIndexes = await mentors.indexes();
    const obsoleteEmployeeIdIndex = mentorIndexes.find(
      (index) =>
        index.name === 'employeeId_1' &&
        index.unique === true &&
        Object.keys(index.key).length === 1 &&
        index.key.employeeId === 1
    );

    if (obsoleteEmployeeIdIndex) {
      await mentors.dropIndex(obsoleteEmployeeIdIndex.name);
      console.log('Removed obsolete mentors.employeeId_1 index');
    }

    await mentors.updateMany(
      { isApproved: { $exists: false } },
      { $set: { isApproved: false } }
    );
    console.log('Normalized missing mentor approval flags');

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
