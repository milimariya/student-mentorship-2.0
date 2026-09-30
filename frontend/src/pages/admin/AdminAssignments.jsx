import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminAssignments = () => {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [mentorId, setMentorId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await api.get('/admin/assignments');
      setStudents(response.data.students || []);
      setMentors(response.data.mentors || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load assignment data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await api.post('/admin/assignments', { studentId, mentorId });
      setMessage(response.data.message);
      setStudentId('');
      setMentorId('');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Assignment failed');
    }
  };

  return (
    <div>
      <h2>Student Assignment</h2>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <div className="card" style={{ marginBottom: '1rem' }}>
        <form onSubmit={handleAssign} className="meeting-form">
          <div className="form-group">
            <label htmlFor="studentId">Student</label>
            <select id="studentId" value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.user?.name || 'Unknown'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="mentorId">Mentor</label>
            <select id="mentorId" value={mentorId} onChange={(e) => setMentorId(e.target.value)} required>
              <option value="">Select a mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor._id} value={mentor._id}>
                  {mentor.user?.name || 'Unknown'}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary" type="submit">Assign Student</button>
        </form>
      </div>

      <div className="card">
        <h3>Current Assignments</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Mentor</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.user?.name || 'Unknown student'}</td>
                <td>{student.mentor?.user?.name || 'Unassigned'}</td>
                <td>{student.department || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAssignments;
