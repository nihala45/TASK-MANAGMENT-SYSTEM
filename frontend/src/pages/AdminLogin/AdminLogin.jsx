import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants/token';
import { login } from '../../Redux/actions/authActions';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      if (!username || !password) {
          setError('Please fill in both fields');
          return;
      }
  
      setLoading(true);
  
      try {
          const res = await api.post('/admin/loginn/', { username, password }, {
              headers: {
                  'Content-Type': 'application/json',
                  // No need for CSRF token with JWT
              }
          });
          
          const { access, refresh, username: adminUsername } = res.data;
  
          // Store tokens
          localStorage.setItem(ACCESS_TOKEN, access);
          localStorage.setItem(REFRESH_TOKEN, refresh);
          
          // Set default authorization header for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  
          dispatch(login({
              accessToken: access,
              refreshToken: refresh,
              username: adminUsername,
              role: 'admin'
          }));
  
          navigate('/adminhome');
      } catch (error) {
          console.error('Login failed:', error);
          setError(error.response?.data?.error || 'Login failed. Please try again.');
      } finally {
          setLoading(false);
      }
  };

    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit} className="form-container">
                <h2>Admin Login</h2>
                
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input"
                        placeholder="Enter username"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        placeholder="Enter password"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="submit-button" 
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;