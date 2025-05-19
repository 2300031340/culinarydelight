import React from 'react';
import Lottie from 'lottie-react';
import cookingAnimation from '../assets/animations/food-loading.json';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium' }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <Lottie
        animationData={cookingAnimation}
        loop={true}
        style={{ width: size === 'small' ? '100px' : size === 'medium' ? '200px' : '300px' }}
      />
      <p className="loading-text">Cooking up something delicious...</p>
    </div>
  );
};

export default LoadingSpinner; 