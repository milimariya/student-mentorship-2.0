import { useEffect, useState } from 'react';
import api from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';

const emptyProfile = {
  name: '',
  email: '',
  expertise: '',
  department: '',
  phone: '',
  bio: '',
  availability: 'Available',
};

const MentorProfile = () => {
  const [profile, setProfile] = useState(emptyProfile);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        const { user } = response.data;
        setProfile({
          ...emptyProfile,
          name: user.name || '',
          email: user.email || '',
          expertise: user.profile?.expertise || '',
          department: user.profile?.department || '',
          phone: user.profile?.phone || '',
          bio: user.profile?.bio || '',
          availability: user.profile?.availability || 'Available',
        });
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || 'Unable to load profile');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    setProfile({ ...profile, [event.target.name]: event.target.value });
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaved(false);

    try {
      await api.put('/mentors/profile', {
        expertise: profile.expertise,
        department: profile.department,
        phone: profile.phone,
        bio: profile.bio,
        availability: profile.availability,
      });
      setSaved(true);
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Unable to update profile');
    }
  };

  return (
    <>
      <h1>My Profile</h1>
      <Card title="Profile Details">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="grid-two">
            <div className="form-group">
              <label htmlFor="mentor-name">Name</label>
              <input id="mentor-name" value={profile.name} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="mentor-email">Email</label>
              <input id="mentor-email" type="email" value={profile.email} readOnly />
            </div>
          </div>

          <div className="grid-two">
            <div className="form-group">
              <label htmlFor="mentor-expertise">Expertise</label>
              <input id="mentor-expertise" name="expertise" value={profile.expertise} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="mentor-department">Department</label>
              <input id="mentor-department" name="department" value={profile.department} onChange={handleChange} />
            </div>
          </div>

          <div className="grid-two">
            <div className="form-group">
              <label htmlFor="mentor-phone">Phone</label>
              <input id="mentor-phone" name="phone" type="tel" value={profile.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="mentor-availability">Availability</label>
              <select id="mentor-availability" name="availability" value={profile.availability} onChange={handleChange}>
                <option>Available</option>
                <option>Unavailable</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mentor-bio">Bio</label>
            <textarea id="mentor-bio" name="bio" rows="4" value={profile.bio} onChange={handleChange} />
          </div>

          {error && <p role="alert">{error}</p>}
          {saved && <p role="status">Profile updated successfully.</p>}
          <Button type="submit">Save Changes</Button>
        </form>
      </Card>
    </>
  );
};

export default MentorProfile;