import Card from '../../components/Card';

const Meetings = () => {
  const meetings = [
    { date: '2026-10-02', type: 'Academic Review', status: 'scheduled' },
    { date: '2026-10-08', type: 'Career Planning', status: 'requested' },
    { date: '2026-10-15', type: 'Mentor Check-in', status: 'completed' },
  ];

  return (
    <Card title="Manage Meetings">
      <div className="list-box">
        {meetings.map((meeting, index) => (
          <div key={index} className="list-item">
            <strong>{meeting.date}</strong>
            <p>{meeting.type}</p>
            <span className="badge">{meeting.status}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Meetings;
