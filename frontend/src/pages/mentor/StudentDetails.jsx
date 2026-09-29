import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import api from '../../services/api';

const StudentDetails = () => {
  const { studentId } = useParams();
  const [details, setDetails] = useState(null);
  const [concernEdits, setConcernEdits] = useState({});
  const [concernSaveState, setConcernSaveState] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/mentors/students/${studentId}`);
        setDetails(response.data);
      } catch (error) {
        console.error('Student details error:', error);
      }
    };

    if (studentId) {
      fetchDetails();
    }
  }, [studentId]);

  const getConcernEdit = (concern) => concernEdits[concern._id] || {
    response: concern.response || '',
    status: concern.status,
  };

  const handleConcernChange = (concern, field, value) => {
    setConcernEdits((current) => {
      const edit = current[concern._id] || {
        response: concern.response || '',
        status: concern.status,
      };

      return {
        ...current,
        [concern._id]: { ...edit, [field]: value },
      };
    });
    setConcernSaveState((current) => ({ ...current, [concern._id]: {} }));
  };

  const handleConcernSave = async (event, concern) => {
    event.preventDefault();
    const updates = getConcernEdit(concern);
    setConcernSaveState((current) => ({
      ...current,
      [concern._id]: { saving: true },
    }));

    try {
      const response = await api.put(`/concerns/${concern._id}`, updates);
      setDetails((current) => ({
        ...current,
        concerns: current.concerns.map((item) => (
          item._id === concern._id ? response.data : item
        )),
      }));
      setConcernEdits((current) => ({
        ...current,
        [concern._id]: {
          response: response.data.response,
          status: response.data.status,
        },
      }));
      setConcernSaveState((current) => ({
        ...current,
        [concern._id]: { saved: true },
      }));
    } catch (error) {
      setConcernSaveState((current) => ({
        ...current,
        [concern._id]: {
          error: error.response?.data?.message || 'Unable to update concern',
        },
      }));
    }
  };

  if (!details) {
    return <Card title="Student Details"><p>Loading...</p></Card>;
  }

  return (
    <div className="dashboard-grid">
      <Card title="Student Information" size="lg">
        <div className="list-box">
          <div className="list-item"><strong>Name:</strong> {details.student.user?.name}</div>
          <div className="list-item"><strong>Department:</strong> {details.student.department}</div>
          <div className="list-item"><strong>Year:</strong> {details.student.year}</div>
          <div className="list-item"><strong>Bio:</strong> {details.student.bio}</div>
        </div>
      </Card>

      <Card title="Goals" size="lg">
        <div className="list-box">
          {details.goals?.map((goal) => (
            <div className="list-item" key={goal._id}><strong>{goal.title}</strong> - {goal.status}</div>
          )) || <p>No goals listed.</p>}
        </div>
      </Card>

      <Card title="Student Concerns" size="lg">
        <div className="list-box">
          {details.concerns?.length > 0 ? details.concerns.map((concern) => {
            const edit = getConcernEdit(concern);
            const saveState = concernSaveState[concern._id] || {};

            return (
              <div className="list-item" key={concern._id}>
                <strong>{concern.title}</strong>
                <p>{concern.description}</p>
                <p>Submitted: {new Date(concern.createdAt).toLocaleDateString()}</p>
                <form className="concern-response-form" onSubmit={(event) => handleConcernSave(event, concern)}>
                  <div className="form-group">
                    <label htmlFor={`concern-response-${concern._id}`}>Mentor response</label>
                    <textarea
                      id={`concern-response-${concern._id}`}
                      rows="3"
                      value={edit.response}
                      onChange={(event) => handleConcernChange(concern, 'response', event.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`concern-status-${concern._id}`}>Status</label>
                    <select
                      id={`concern-status-${concern._id}`}
                      value={edit.status}
                      onChange={(event) => handleConcernChange(concern, 'status', event.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="active">Active</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  {saveState.error && <div className="error-message" role="alert">{saveState.error}</div>}
                  {saveState.saved && <div className="success-message" role="status">Concern updated.</div>}
                  <button className="btn btn-primary" type="submit" disabled={saveState.saving}>
                    {saveState.saving ? 'Saving...' : 'Save response'}
                  </button>
                </form>
              </div>
            );
          }) : <p>No concerns raised by this student.</p>}
        </div>
      </Card>
    </div>
  );
};

export default StudentDetails;
