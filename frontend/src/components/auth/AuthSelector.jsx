import React from 'react';
import './AuthSelector.css';

const AuthSelector = ({ onSelect }) => {
  return (
    <div className="auth-selector">
      <h2>Welcome to Delight</h2>
      <div className="auth-buttons">
        <button 
          className="auth-button user-button"
          onClick={() => onSelect('user')}
        >
          Login as User
        </button>
        <button 
          className="auth-button chef-button"
          onClick={() => onSelect('chef')}
        >
          Login as Chef
        </button>
      </div>
    </div>
  );
};

export default AuthSelector; 