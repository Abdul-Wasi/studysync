// src/components/ComingSoon.jsx
import React from 'react';
import '../styles/ComingSoon.css';

const ComingSoon = () => {
  return (
    <div className="coming-soon-container">
      <h2>🚀 Coming Soon!</h2>
      <p>This feature is currently under development. Stay tuned for updates!</p>
      <div className="loading-spinner">
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  );
};

export default ComingSoon;