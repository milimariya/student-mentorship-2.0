import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, isActive: response.data.user.isActive }
            : user
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update user status');
    }
  };

  return (
    <div>
      <div className="admin-actions">
        <h2>User Management</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="page-center">Loading users...</div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="badge">{user.role}</span></td>
                  <td>
                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-warning'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`status-toggle ${user.isActive ? 'deactivate' : 'activate'}`}
                      onClick={() => handleToggleStatus(user._id)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
