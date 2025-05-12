import React, { useState } from 'react';
import './SignUpForm.css';

function isValidEmail(email) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  // Accepts 10 digit numbers (India-style), can be adjusted for other formats
  return /^\d{10}$/.test(phone);
}

const SignUpForm = ({ onClose, onAuthSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('USER');
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
    username: '',
    name: '',
    experienceYears: '',
    bio: '',
    specialties: [],
    agreeToTerms: false,
    otp: ''
  });
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSpecialtyChange = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const validateStep1 = () => {
    if (!formData.emailOrPhone || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    // Validate email or phone
    if (isValidEmail(formData.emailOrPhone)) {
      // valid email
    } else if (isValidPhone(formData.emailOrPhone)) {
      // valid phone
    } else {
      // Not valid
      if (/\D/.test(formData.emailOrPhone)) {
        setError('Invalid email address');
      } else {
        setError('Invalid phone number format. Enter 10 digits.');
      }
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (userType === 'USER') {
      if (!formData.username) {
        setError('Username is required');
        return false;
      }
    } else {
      if (!formData.name || !formData.experienceYears || !formData.bio) {
        setError('All fields are required');
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    setError('');
    if (step === 1 && validateStep1()) {
      // Simulate sending OTP
      setOtpSent(true);
      setStep(2);
    }
    if (step === 2 && otpSent) {
      // Simulate OTP verification (replace with real API call)
      if (formData.otp === '123456') { // For demo, correct OTP is 123456
        setOtpVerified(true);
        setStep(3);
        setError('');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setError('');
    } else if (step === 3) {
      setStep(2);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateStep3()) {
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    try {
      const endpoint = '/api/auth/register';
      const requestData = {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
        userType: userType
      };

      if (userType === 'USER') {
        Object.assign(requestData, {
          username: formData.username
        });
      } else {
        Object.assign(requestData, {
          name: formData.name,
          experienceYears: parseInt(formData.experienceYears),
          bio: formData.bio,
          specialties: formData.specialties
        });
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
        throw new Error(data.message || 'Registration failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.userType);
      }

      onAuthSuccess(data);
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    }
  };

  const specialties = [
    'Italian', 'French', 'Indian', 'Chinese', 'Japanese',
    'Mexican', 'Thai', 'Mediterranean', 'Vegan', 'Baking'
  ];

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          {step > 1 && (
            <button className="back-arrow" onClick={handleBack} aria-label="Go back">
              <span style={{ fontSize: '1.5rem', color: '#4299e1', fontWeight: 700 }}>&larr;</span>
            </button>
          )}
          <h2>Create Your Account</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Account</span>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Verification</span>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Profile</span>
          </div>
        </div>

        {step === 1 && (
          <div className="step-content">
            <div className="user-type-selector">
              <button
                className={`type-button ${userType === 'USER' ? 'active' : ''}`}
                onClick={() => setUserType('USER')}
              >
                <i className="fas fa-user"></i>
                <span>User</span>
              </button>
              <button
                className={`type-button ${userType === 'CHEF' ? 'active' : ''}`}
                onClick={() => setUserType('CHEF')}
              >
                <i className="fas fa-utensils"></i>
                <span>Chef</span>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  spellCheck="false"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  spellCheck="false"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="next-button">
                Next Step
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
              <div className="form-group">
                <label>Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder={`Enter the OTP sent to your ${isValidEmail(formData.emailOrPhone) ? 'email' : 'phone'}`}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="button-group">
                <button type="submit" className="next-button">
                  Verify OTP
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <form onSubmit={handleSubmit}>
              {userType === 'USER' ? (
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    autoComplete="username"
                    spellCheck="false"
                  />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      spellCheck="false"
                    />
                  </div>

                  <div className="form-group">
                    <label>Years of Experience</label>
                    <input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      placeholder="Enter years of experience"
                      min="0"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself"
                      rows="4"
                      spellCheck="true"
                    />
                  </div>

                  <div className="form-group">
                    <label>Specialties</label>
                    <div className="specialties-grid">
                      {specialties.map(specialty => (
                        <button
                          key={specialty}
                          type="button"
                          className={`specialty-button ${formData.specialties.includes(specialty) ? 'active' : ''}`}
                          onClick={() => handleSpecialtyChange(specialty)}
                        >
                          {specialty}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="button-group">
                <button type="submit" className="submit-button">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="login-link">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="link-button">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm; 