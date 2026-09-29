import { Link } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const items = {
    student: [
      { label: 'Dashboard', to: '/student/dashboard' },
      { label: 'Profile', to: '/student/profile' },
      { label: 'My Mentor', to: '/student/my-mentor' },
      { label: 'Goals', to: '/student/goals' },
      { label: 'Concerns', to: '/student/concerns' },
      { label: 'Meetings', to: '/student/meetings' },
      { label: 'Feedback', to: '/student/feedback' },
    ],
    mentor: [
      { label: 'Dashboard', to: '/mentor/dashboard' },
      { label: 'My Students', to: '/mentor/students' },
      { label: 'Meetings', to: '/mentor/meetings' },
      { label: 'Feedback', to: '/mentor/feedback' },
    ],
    admin: [
      { label: 'Dashboard', to: '/admin/dashboard' },
      { label: 'Students', to: '/admin/students' },
      { label: 'Mentors', to: '/admin/mentors' },
      { label: 'Assign Mentors', to: '/admin/assign-ment' },
    ],
  };

  return (
    <aside className="sidebar">
      <ul>
        {items[role]?.map((item) => (
          <li key={item.to}>
            <Link to={item.to}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
