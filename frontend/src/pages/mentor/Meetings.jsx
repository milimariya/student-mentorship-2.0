import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import api from '../../services/api';

const emptyForm = {
  studentId: '',
  date: '',
  time: '',
  type: 'academic',
  agenda: '',
};

const formatDate = (value) => {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString();
};

const Meetings = () => {
  const [students, setStudents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsResponse, meetingsResponse] = await Promise.all([
        api.get('/mentors/students'),
        api.get('/meetings/mentor'),
      ]);
      setStudents(studentsResponse.data);
      setMeetings(meetingsResponse.data);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/meetings', form);
      setForm(emptyForm);
      setSuccess('Meeting scheduled.');
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to schedule meeting');
    } finally {
      setSaving(false);
    }
  };

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="mentor-meetings">
      <h1>Meetings</h1>
      <div className="meeting-layout">
        <Card title="Schedule a Meeting" size="lg">
          <form className="meeting-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="studentId">Student</label>
              <select id="studentId" name="studentId" value={form.studentId} onChange={handleChange} required>
                <option value="">Select an assigned student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>{student.user?.name || 'Student'}</option>
                ))}
              </select>
            </div>

            <div className="grid-two">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input id="date" name="date" type="date" min={minDate} value={form.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="time">Time</label>
                <input id="time" name="time" type="time" value={form.time} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="type">Meeting type</label>
              <select id="type" name="type" value={form.type} onChange={handleChange}>
                <option value="academic">Academic</option>
                <option value="career">Career</option>
                <option value="wellbeing">Wellbeing</option>
                <option value="review">Review</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="agenda">Agenda</label>
              <textarea id="agenda" name="agenda" value={form.agenda} onChange={handleChange} rows="3" placeholder="Topics to discuss" />
            </div>

            {error && <div className="error-message" role="alert">{error}</div>}
            {success && <div className="success-message" role="status">{success}</div>}
            {!loading && students.length === 0 && <p>No students are assigned to you yet.</p>}

            <Button type="submit" disabled={saving || loading || students.length === 0}>
              {saving ? 'Scheduling...' : 'Schedule meeting'}
            </Button>
          </form>
        </Card>

        <Card title="Scheduled Meetings" size="lg">
          {loading ? <p>Loading meetings...</p> : meetings.length > 0 ? (
            <div className="list-box">
              {meetings.map((meeting) => (
                <div key={meeting._id} className="list-item">
                  <strong>{meeting.student?.user?.name || 'Student'}</strong>
                  <p>{formatDate(meeting.date)} at {meeting.time}</p>
                  <p>{meeting.type} meeting</p>
                  {meeting.agenda && <p>Agenda: {meeting.agenda}</p>}
                  <span className="badge">{meeting.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No meetings scheduled yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Meetings;
