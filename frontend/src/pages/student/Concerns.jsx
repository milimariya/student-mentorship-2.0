import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import api from '../../services/api';

const Concerns = () => {
  const [concerns, setConcerns] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });

  const loadConcerns = async () => {
    try {
      const me = await api.get('/auth/me');
      const studentId = me.data.user.profile?._id;
      if (!studentId) return;
      const response = await api.get(`/concerns/${studentId}`);
      setConcerns(response.data);
    } catch (error) {
      console.error('Concern fetch error:', error);
    }
  };

  useEffect(() => {
    loadConcerns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/concerns', form);
      setForm({ title: '', description: '' });
      loadConcerns();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to submit concern');
    }
  };

  return (
    <div className="dashboard-grid">
      <Card title="Raise a Concern" size="lg">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Card>

      <Card title="Active Concerns" size="lg">
        <div className="list-box">
          {concerns.length > 0 ? concerns.map((item) => (
            <div key={item._id} className="list-item">
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <span className="badge">{item.status}</span>
              {item.response && <p><strong>Response:</strong> {item.response}</p>}
            </div>
          )) : <p>No concerns yet.</p>}
        </div>
      </Card>
    </div>
  );
};

export default Concerns;
