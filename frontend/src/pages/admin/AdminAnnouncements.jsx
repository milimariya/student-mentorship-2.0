import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/admin/announcements');
      setAnnouncements(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/admin/announcements', { message, audience });
      setMessage('');
      setAudience('all');
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create announcement');
    }
  };

  return (
    <div>
      <h2>Announcements</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="card" style={{ marginBottom: '1rem' }}>
        <form onSubmit={handleSubmit} className="meeting-form">
          <div className="form-group">
            <label htmlFor="announcementMessage">Announcement</label>
            <textarea
              id="announcementMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              placeholder="Write a system announcement"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="audience">Send to</label>
            <select id="audience" value={audience} onChange={(e) => setAudience(e.target.value)}>
              <option value="all">Everyone</option>
              <option value="students">Students only</option>
              <option value="mentors">Mentors only</option>
            </select>
          </div>

          <button className="btn btn-primary" type="submit">Create Announcement</button>
        </form>
      </div>

      <div className="card">
        <h3>Recent Announcements</h3>
        {loading ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p>No announcements yet.</p>
        ) : (
          <div className="list-box">
            {announcements.map((item) => (
              <div key={item._id} className="list-item">
                <div><span>{item.audience}</span></div>
                <p>{item.message}</p>
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
