import { useEffect, useState } from 'react';
import api from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    department: '',
    year: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        const userData = response.data.user;
        setProfile({
          name: userData.name,
          email: userData.email,
          department: userData.profile?.department || '',
          year: userData.profile?.year || '',
          phone: userData.profile?.phone || '',
          bio: userData.profile?.bio || '',
        });
      } catch (error) {
        console.error('Profile load error:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await api.get('/auth/me');
      const studentId = userResponse.data.user.profile?._id;
      await api.put(`/students/${studentId}`, {
        department: profile.department,
        year: profile.year,
        phone: profile.phone,
        bio: profile.bio,
      });
      alert('Profile updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to update profile');
    }
  };

  return (
    <Card title="Edit Profile">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="grid-two">
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={profile.name} readOnly />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" value={profile.email} readOnly />
          </div>
        </div>

        <div className="grid-two">
          <div className="form-group">
            <label>Department</label>
            <input name="department" value={profile.department} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input name="year" value={profile.year} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input name="phone" value={profile.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea name="bio" rows="4" value={profile.bio} onChange={handleChange} />
        </div>

        <Button type="submit">Save Changes</Button>
      </form>
    </Card>
  );
};

export default StudentProfile;
