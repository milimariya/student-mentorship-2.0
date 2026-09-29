import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import api from '../../services/api';

const MyStudents = () => {
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);

  const loadStudents = async () => {
    try {
      const [assignedResponse, availableResponse] = await Promise.all([
        api.get('/mentors/students'),
        api.get('/mentors/available-students'),
      ]);

      setAssignedStudents(assignedResponse.data);
      setAvailableStudents(availableResponse.data);
    } catch (error) {
      console.error('Students fetch error:', error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAssignStudent = async (studentId) => {
    try {
      await api.post('/mentors/assign-student', { studentId });
      loadStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to assign student');
    }
  };

  return (
    <div className="dashboard-grid">
      <Card title="Assigned Students" size="lg">
        <div className="list-box">
          {assignedStudents.length > 0 ? (
            assignedStudents.map((student) => (
              <div key={student._id} className="list-item">
                <strong>{student.user?.name}</strong>
                <p>{student.department || 'General'}</p>
                <Link to={`/mentor/student/${student._id}`} className="btn btn-secondary">View Details</Link>
              </div>
            ))
          ) : (
            <p>No students assigned yet.</p>
          )}
        </div>
      </Card>

      <Card title="Assign Students" size="lg">
        <div className="list-box">
          {availableStudents.length > 0 ? (
            availableStudents.map((student) => (
              <div key={student._id} className="list-item">
                <strong>{student.user?.name}</strong>
                <p>{student.department || 'General'}</p>
                <Button onClick={() => handleAssignStudent(student._id)}>Assign to me</Button>
              </div>
            ))
          ) : (
            <p>There are no unassigned students right now.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MyStudents;
