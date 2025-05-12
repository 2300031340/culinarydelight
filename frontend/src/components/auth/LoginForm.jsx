import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = ({ onClose, onAuthSuccess }) => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('USER');
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    otp: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setStep(1);
    setFormData({
      emailOrPhone: '',
      password: '',
      otp: ''
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.emailOrPhone) {
      setError('Please enter your email or phone number');
      return;
    }
    // Here you would typically make an API call to send OTP
    setStep(2);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = '/api/auth/login';
      const requestData = {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
        otp: formData.otp,
        userType: userType
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.userType);
      }

      onAuthSuccess(data);
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          {step > 1 && (
            <button className="back-arrow" onClick={handleBack} aria-label="Go back">
              <span style={{ fontSize: '1.5rem', color: '#4299e1', fontWeight: 700 }}>&larr;</span>
            </button>
          )}
          <h2>Welcome Back</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="user-type-selector">
          <button
            className={`type-button ${userType === 'USER' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('USER')}
          >
            <i className="fas fa-user"></i>
            <span>User</span>
          </button>
          <button
            className={`type-button ${userType === 'CHEF' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('CHEF')}
          >
            <i className="fas fa-utensils"></i>
            <span>Chef</span>
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="form-group">
              <label>Email or Phone Number</label>
              <input
                type="text"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                placeholder="Enter your email or phone number"
                autoComplete="email"
                spellCheck="false"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                spellCheck="false"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter the OTP sent to your email/phone"
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
              <button type="submit" className="login-button">
                Verify & Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm; 