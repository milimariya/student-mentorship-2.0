import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const me = await api.get('/auth/me');
        const studentId = me.data.user.profile?._id;
        if (!studentId) return;
        const response = await api.get(`/feedback/${studentId}`);
        setFeedback(response.data);
      } catch (error) {
        console.error('Feedback load failed:', error);
      }
    };

    loadFeedback();
  }, []);

  return (
    <Card title="Mentor Feedback">
      <div className="list-box">
        {feedback.length > 0 ? feedback.map((item) => (
          <div key={item._id} className="list-item">
            <strong>Rating: {item.rating}/5</strong>
            <p>{item.comments}</p>
            <small>Mentor: {item.mentor?.user?.name || 'Mentor'}</small>
          </div>
        )) : <p>No feedback available yet.</p>}
      </div>
    </Card>
  );
};

export default FeedbackPage;
