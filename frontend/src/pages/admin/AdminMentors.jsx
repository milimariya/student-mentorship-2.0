import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminMentors = () => {
  const [pendingMentors, setPendingMentors] = useState([]);
  const [approvedMentors, setApprovedMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMentors = async () => {
    try {
      const response = await api.get('/admin/mentors');
      setPendingMentors(response.data.pendingMentors || []);
      setApprovedMentors(response.data.approvedMentors || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load mentors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleApprove = async (mentorId) => {
    try {
      await api.patch(`/admin/mentors/${mentorId}/approve`);
      fetchMentors();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to approve mentor');
    }
  };

  const renderMentorTable = (mentors, showApproveButton = false) => (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Expertise</th>
            {showApproveButton && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {mentors.length === 0 ? (
            <tr>
              <td colSpan={showApproveButton ? 5 : 4}>
                {showApproveButton ? 'No mentor applications pending approval.' : 'No approved mentors yet.'}
              </td>
            </tr>
          ) : (
            mentors.map((mentor) => (
              <tr key={mentor._id}>
                <td>{mentor.user?.name}</td>
                <td>{mentor.user?.email}</td>
                <td>{mentor.department || 'N/A'}</td>
                <td>{mentor.expertise || 'N/A'}</td>
                {showApproveButton && (
                  <td>
                    <button className="btn btn-primary" onClick={() => handleApprove(mentor._id)}>
                      Approve
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h2>Mentor Approval</h2>
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="page-center">Loading mentors...</div>
      ) : (
        <>
          <div>
            <h3>Pending Approval</h3>
            {renderMentorTable(pendingMentors, true)}
          </div>

          <div>
            <h3>Approved Mentors</h3>
            {renderMentorTable(approvedMentors, false)}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminMentors;
