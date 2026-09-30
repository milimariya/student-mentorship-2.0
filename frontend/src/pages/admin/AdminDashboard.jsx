import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    students: 0,
    mentors: 0,
    admins: 0,
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setDashboard(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const metrics = [
    { label: 'Total Users', value: dashboard.totalUsers },
    { label: 'Students', value: dashboard.students },
    { label: 'Mentors', value: dashboard.mentors },
    { label: 'Admins', value: dashboard.admins },
  ];

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="page-center">Loading dashboard...</div>
      ) : (
        <>
          <div className="dashboard-grid">
            {metrics.map((metric) => (
              <div key={metric.label} className="card metric-card">
                <h3>{metric.label}</h3>
                <div className="metric-value">{metric.value}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Recent Users</h3>
            {dashboard.recentUsers.length === 0 ? (
              <p>No users found yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td><span className="badge">{user.role}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
