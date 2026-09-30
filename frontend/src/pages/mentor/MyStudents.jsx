import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import api from '../../services/api';

const MyStudents = () => {
  const [assignedStudents, setAssignedStudents] = useState([]);

  const loadStudents = async () => {
    try {
      const response = await api.get('/mentors/students');
      setAssignedStudents(response.data);
    } catch (error) {
      console.error('Students fetch error:', error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

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
    </div>
  );
};

export default MyStudents;
