import React, { useState } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants/token';
import api from '../../api';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../Redux/actions/authActions';
import './superuserlogin.css';

const SuperAdminLogin = () => {
  const [username, setUsername] = useState(''); // ✅ use 'username'
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { username, password }; // ✅ use 'username' in API request

    try {
      const res = await api.post('/api/admin/login/', data);

      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      localStorage.setItem('admin', JSON.stringify({ is_superuser: res.data.is_superuser }));

      dispatch(login(res.data));

      alert('Admin login successful!');
      navigate('/SuperAdminHome');
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-title">Superuser Login</h2>

        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input"
            placeholder="Enter your superuser username"
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default SuperAdminLogin;
