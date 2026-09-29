import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    totalActiveMentorships: 0,
    totalMeetings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Admin dashboard error:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <h1>Admin Dashboard</h1>
      <div className="dashboard-grid">
        <Card title="Total Students"><div className="metric-value">{stats.totalStudents}</div></Card>
        <Card title="Total Mentors"><div className="metric-value">{stats.totalMentors}</div></Card>
        <Card title="Active Mentorships"><div className="metric-value">{stats.totalActiveMentorships}</div></Card>
        <Card title="Total Meetings"><div className="metric-value">{stats.totalMeetings}</div></Card>
      </div>
    </>
  );
};

export default AdminDashboard;
