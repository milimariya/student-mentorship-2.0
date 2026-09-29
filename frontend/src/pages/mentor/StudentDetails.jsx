import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import api from '../../services/api';

const StudentDetails = () => {
  const { studentId } = useParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/mentors/students/${studentId}`);
        setDetails(response.data);
      } catch (error) {
        console.error('Student details error:', error);
      }
    };

    if (studentId) {
      fetchDetails();
    }
  }, [studentId]);

  if (!details) {
    return <Card title="Student Details"><p>Loading...</p></Card>;
  }

  return (
    <div className="dashboard-grid">
      <Card title="Student Information" size="lg">
        <div className="list-box">
          <div className="list-item"><strong>Name:</strong> {details.student.user?.name}</div>
          <div className="list-item"><strong>Department:</strong> {details.student.department}</div>
          <div className="list-item"><strong>Year:</strong> {details.student.year}</div>
          <div className="list-item"><strong>Bio:</strong> {details.student.bio}</div>
        </div>
      </Card>

      <Card title="Goals" size="lg">
        <div className="list-box">
          {details.goals?.map((goal) => (
            <div className="list-item" key={goal._id}><strong>{goal.title}</strong> - {goal.status}</div>
          )) || <p>No goals listed.</p>}
        </div>
      </Card>
    </div>
  );
};

export default StudentDetails;
