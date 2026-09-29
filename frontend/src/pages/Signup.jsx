import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import useAuth from '../hooks/useAuth';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    year: '',
    expertise: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await signup(form);
      navigate(`/${response.user.role}/dashboard`);
    } catch (err) {
      const responseError = err.response?.data;
      const message = responseError?.message;
      const details = responseError?.error;
      setError(
        message === 'Registration failed' && details
          ? `${message}: ${details}`
          : message || details || 'Signup failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card wide-card">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="grid-two">
            <FormInput label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
            <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="grid-two">
            <FormInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Choose a password" required />
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={form.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
          </div>

          <div className="grid-two">
            <FormInput label="Department" name="department" value={form.department} onChange={handleChange} placeholder="Department" />
            {form.role === 'mentor' ? (
              <FormInput label="Expertise" name="expertise" value={form.expertise} onChange={handleChange} placeholder="Expertise area" />
            ) : (
              <FormInput label="Year" name="year" value={form.year} onChange={handleChange} placeholder="Year or cohort" />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" name="bio" value={form.bio} onChange={handleChange} placeholder="Tell us about yourself" rows="4" />
          </div>

          {error && <div className="error-message">{error}</div>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
