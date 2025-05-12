import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    experienceYears: '',
    bio: '',
    userType: 'USER' // Default to USER
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

      // Prepare the data according to the backend's expected format
      const requestData = {
        email: formData.email,
        password: formData.password,
        userType: formData.userType
      };

      if (!isLogin) {
        if (formData.userType === 'CHEF') {
          Object.assign(requestData, {
            name: formData.name,
            experienceYears: parseInt(formData.experienceYears),
            bio: formData.bio
          });
        } else {
          Object.assign(requestData, {
            username: formData.username
          });
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store the JWT token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.userType);
      }

      onAuthSuccess(data);
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
          <div className="auth-toggle">
            <button
              className={`toggle-btn ${formData.userType === 'USER' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, userType: 'USER' })}
            >
              User
            </button>
            <button
              className={`toggle-btn ${formData.userType === 'CHEF' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, userType: 'CHEF' })}
            >
              Chef
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && formData.userType === 'USER' && (
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {!isLogin && formData.userType === 'CHEF' && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  name="experienceYears"
                  placeholder="Years of Experience"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="bio"
                  placeholder="Bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          <div className="auth-switch">
            <span>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button
              type="button"
              className="switch-button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm; 