import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';

const ManageMentors = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await api.get('/admin/mentors');
        setMentors(response.data);
      } catch (error) {
        console.error('Mentor list error:', error);
      }
    };

    fetchMentors();
  }, []);

  return (
    <Card title="Manage Mentors">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Expertise</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {mentors.map((mentor) => (
            <tr key={mentor._id}>
              <td>{mentor.user?.name}</td>
              <td>{mentor.user?.email}</td>
              <td>{mentor.expertise || 'N/A'}</td>
              <td>{mentor.department || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default ManageMentors;
