import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/admin/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Student list error:', error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <Card title="Manage Students">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Mentor</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.user?.name}</td>
              <td>{student.user?.email}</td>
              <td>{student.department || 'N/A'}</td>
              <td>{student.mentor?.user?.name || 'Unassigned'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default ManageStudents;
