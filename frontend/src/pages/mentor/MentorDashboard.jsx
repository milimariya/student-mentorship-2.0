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

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/mentors/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Mentor dashboard error:', error);
      }
    };

    fetchDashboard();
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
    </>
  );
};

export default MentorDashboard;
