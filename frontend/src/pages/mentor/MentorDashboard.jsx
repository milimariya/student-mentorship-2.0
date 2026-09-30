import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';

const MentorDashboard = () => {
  const [stats, setStats] = useState({
    assignedStudents: 0,
    upcomingMeetings: 0,
    pendingConcerns: 0,
    studentsNeedingAttention: 0,
  });
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/mentors/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Mentor dashboard error:', error);
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

    fetchDashboard();
    fetchAnnouncements();
  }, []);

  return (
    <>
      <h1>Mentor Dashboard</h1>
      <div className="dashboard-grid">
        <Card title="Assigned Students"><div className="metric-value">{stats.assignedStudents}</div></Card>
        <Card title="Upcoming Meetings"><div className="metric-value">{stats.upcomingMeetings}</div></Card>
        <Card title="Pending Concerns"><div className="metric-value">{stats.pendingConcerns}</div></Card>
        <Card title="Students Needing Attention"><div className="metric-value">{stats.studentsNeedingAttention}</div></Card>
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

export default MentorDashboard;
