import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import api from '../../services/api';

const Feedback = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [form, setForm] = useState({
    rating: 5,
    comments: '',
  });

  const loadAssignedStudents = async () => {
    try {
      const response = await api.get('/mentors/students');
      setStudents(response.data);
      if (response.data.length > 0) {
        const firstStudent = response.data[0];
        setSelectedStudentId(firstStudent._id);
        loadFeedback(firstStudent._id);
      }
    } catch (error) {
      console.error('Assigned student fetch failed:', error);
    }
  };

  const loadFeedback = async (studentId) => {
    if (!studentId) {
      setFeedback([]);
      return;
    }

    try {
      const response = await api.get(`/feedback/${studentId}`);
      setFeedback(response.data);
    } catch (error) {
      console.error('Feedback fetch failed:', error);
    }
  };

  useEffect(() => {
    loadAssignedStudents();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      loadFeedback(selectedStudentId);
    }
  }, [selectedStudentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/feedback', {
        studentId: selectedStudentId,
        comments: form.comments,
        rating: Number(form.rating),
      });

      setForm({ rating: 5, comments: '' });
      loadFeedback(selectedStudentId);
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to submit feedback');
    }
  };

  return (
    <div className="dashboard-grid">
      <Card title="Add Feedback" size="lg">
        {students.length > 0 ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Student</label>
              <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>{student.user?.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Rating</label>
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Needs Improvement</option>
                <option value={1}>1 - Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label>Comments</label>
              <textarea
                rows="4"
                value={form.comments}
                onChange={(e) => setForm({ ...form, comments: e.target.value })}
                placeholder="Write feedback for the student"
                required
              />
            </div>

            <Button type="submit">Save Feedback</Button>
          </form>
        ) : (
          <p>You have no assigned students to give feedback to yet.</p>
        )}
      </Card>

      <Card title="Previous Feedback" size="lg">
        <div className="list-box">
          {feedback.length > 0 ? (
            feedback.map((item) => (
              <div key={item._id} className="list-item">
                <strong>Rating: {item.rating}/5</strong>
                <p>{item.comments}</p>
                <small>{new Date(item.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          ) : (
            <p>No feedback has been added for this student yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Feedback;
