import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import api from '../../services/api';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', deadline: '', status: 'pending' });

  const loadGoals = async () => {
    try {
      const me = await api.get('/auth/me');
      const studentId = me.data.user.profile?._id;
      const response = await api.get(`/goals/${studentId}`);
      setGoals(response.data);
    } catch (error) {
      console.error('Goals fetch failed:', error);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', form);
      setForm({ title: '', description: '', deadline: '', status: 'pending' });
      loadGoals();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to create goal');
    }
  };

  return (
    <div className="dashboard-grid">
      <Card title="Create Goal" size="lg">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
          </div>
          <div className="grid-two">
            <div className="form-group">
              <label>Deadline</label>
              <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <Button type="submit">Add Goal</Button>
        </form>
      </Card>

      <Card title="Your Goals" size="lg">
        <div className="list-box">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <div key={goal._id} className="list-item">
                <strong>{goal.title}</strong>
                <p>{goal.description}</p>
                <span className="badge">{goal.status}</span>
              </div>
            ))
          ) : (
            <p>No goals yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Goals;
