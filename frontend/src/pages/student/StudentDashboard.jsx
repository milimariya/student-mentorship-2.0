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

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/students/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
    };

    if (user) {
      fetchDashboard();
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
    </>
  );
};

export default StudentDashboard;
