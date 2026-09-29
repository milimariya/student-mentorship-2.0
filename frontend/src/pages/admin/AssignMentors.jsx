import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import api from '../../services/api';

const AssignMentors = () => {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, mentorRes] = await Promise.all([
          api.get('/admin/students'),
          api.get('/admin/mentors'),
        ]);

        setStudents(studentRes.data);
        setMentors(mentorRes.data);
      } catch (error) {
        console.error('Assignment data fetch error:', error);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/assign-mentor', {
        studentId: selectedStudent,
        mentorId: selectedMentor,
      });
      alert('Mentor assigned successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to assign mentor');
    }
  };

  return (
    <Card title="Assign Mentors">
      <form className="auth-form" onSubmit={handleAssign}>
        <div className="form-group">
          <label>Student</label>
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>{student.user?.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Mentor</label>
          <select value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)}>
            <option value="">Select a mentor</option>
            {mentors.map((mentor) => (
              <option key={mentor._id} value={mentor._id}>{mentor.user?.name}</option>
            ))}
          </select>
        </div>

        <Button type="submit">Assign Mentor</Button>
      </form>
    </Card>
  );
};

export default AssignMentors;
