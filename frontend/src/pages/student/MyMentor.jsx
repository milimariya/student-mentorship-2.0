import { useEffect, useState } from 'react';
import api from '../../services/api';
import Card from '../../components/Card';

const MyMentor = () => {
  const [mentor, setMentor] = useState(null);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const me = await api.get('/auth/me');
        const studentId = me.data.user.profile?._id;
        if (studentId) {
          const response = await api.get(`/students/mentor/${studentId}`);
          setMentor(response.data);
        }
      } catch (error) {
        console.error('Mentor load error:', error);
      }
    };

    fetchMentor();
  }, []);

  return (
    <Card title="Assigned Mentor">
      {mentor ? (
        <div className="list-box">
          <div className="list-item"><strong>Name:</strong> {mentor.user?.name || 'N/A'}</div>
          <div className="list-item"><strong>Department:</strong> {mentor.department || 'N/A'}</div>
          <div className="list-item"><strong>Expertise:</strong> {mentor.expertise || 'N/A'}</div>
          <div className="list-item"><strong>Availability:</strong> {mentor.availability || 'Available'}</div>
        </div>
      ) : (
        <p>No mentor assigned yet.</p>
      )}
    </Card>
  );
};

export default MyMentor;
