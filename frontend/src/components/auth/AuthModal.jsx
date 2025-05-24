import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('USER');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userType
        }),
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
      setError(err.message || 'An error occurred during authentication');
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal-container">
        <div className="auth-modal-content">
          <div className="auth-header">
            <h1>Good to see you again</h1>
            <button className="auth-modal-close" onClick={onClose}>×</button>
          </div>

          <div className="auth-toggle">
            <button
              className={`toggle-btn ${userType === 'USER' ? 'active' : ''}`}
              onClick={() => setUserType('USER')}
            >
              User
            </button>
            <button
              className={`toggle-btn ${userType === 'CHEF' ? 'active' : ''}`}
              onClick={() => setUserType('CHEF')}
            >
              Chef
            </button>
            <button
              className={`toggle-btn ${userType === 'ADMIN' ? 'active' : ''}`}
              onClick={() => setUserType('ADMIN')}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Your email</label>
              <div className="input-container">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="email"
                  placeholder="e.g. elon@tesla.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Your password</label>
              <div className="input-container">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  placeholder="e.g. iloverecipes123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="sign-in-button">
              Sign in
            </button>

            <div className="auth-links">
              <a href="#" className="auth-link">Don't have an account?</a>
              <a href="#" className="auth-link">Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 