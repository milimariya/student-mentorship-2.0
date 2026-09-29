import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/api';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const me = await api.get('/auth/me');
        const studentId = me.data.user.profile?._id;
        if (!studentId) return;
        const response = await api.get(`/meetings/${studentId}`);
        setMeetings(response.data);
      } catch (error) {
        console.error('Meeting load failed:', error);
      }
    };

    loadMeetings();
  }, []);

  return (
    <Card title="Meetings">
      <div className="list-box">
        {meetings.length > 0 ? meetings.map((meeting) => (
          <div key={meeting._id} className="list-item">
            <strong>{new Date(meeting.date).toLocaleDateString()}</strong>
            <p>{meeting.type} meeting</p>
            <p>Status: <span className="badge">{meeting.status}</span></p>
            <p>Agenda: {meeting.agenda || 'General discussion'}</p>
          </div>
        )) : <p>No meetings found.</p>}
      </div>
    </Card>
  );
};

export default Meetings;
