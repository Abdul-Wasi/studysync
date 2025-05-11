// src/components/UnderMaintenance.jsx

import React from 'react';
import '../styles/UnderMaintenance.css';

const UnderMaintenance = () => {
  return (
    <div className="container">
      <div className="box">
        <div className="animation">
          <div className="one spin-one"></div>
          <div className="two spin-two"></div>
          <div className="three spin-one"></div>
        </div>
        <h1>Sorry</h1>
        <p>We are currently under maintenance!</p>
        <p>
          W'll be back soon.
        </p>
      </div>
    </div>
  );
};

export default UnderMaintenance;
