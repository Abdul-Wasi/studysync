// src/components/ComingSoon.jsx


import React from 'react';
import "../styles/ComingSoon.css";

const ComingSoon = () => {
  return (
    <div className="coming-soon-container">
      <h1>🚀 Something Awesome is Coming!</h1>
      <p>We’re working hard to bring you the best tools for university students.</p>
      <p>Stay tuned – launching soon!</p>
      <div className="notify">
        <input type="email" placeholder="Enter your email" />
        <button>Notify Me</button>
      </div>
    </div>
  );
};

export default ComingSoon;
