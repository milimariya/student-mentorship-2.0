import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    mentor: null,
    activeGoals: 0,
    upcomingMeetings: 0,
    pendingConcerns: 0,
  });
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/students/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await api.get('/announcements');
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Announcements fetch error:', error);
      }
    };

    if (user) {
      fetchDashboard();
      fetchAnnouncements();
    }
  }, [user]);

  return (
    <>
      <h1>Student Dashboard</h1>
      <div className="dashboard-grid">
        <Card title="Mentor Name" size="md">
          <div className="metric-value">{stats.mentor?.user?.name || 'Not assigned yet'}</div>
        </Card>
        <Card title="Active Goals" size="md">
          <div className="metric-value">{stats.activeGoals}</div>
        </Card>
        <Card title="Upcoming Meetings" size="md">
          <div className="metric-value">{stats.upcomingMeetings}</div>
        </Card>
        <Card title="Pending Concerns" size="md">
          <div className="metric-value">{stats.pendingConcerns}</div>
        </Card>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3>Announcements</h3>
        {announcements.length === 0 ? (
          <p>No announcements for you right now.</p>
        ) : (
          <div className="announcement-list">
            {announcements.map((item) => (
              <div key={item._id} className="announcement-item announcement-info">
                <div className="announcement-header">
                  <span>{item.audience === 'all' ? 'Everyone' : item.audience === 'students' ? 'Students' : 'Mentors'}</span>
                </div>
                <p>{item.message}</p>
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StudentDashboard;
