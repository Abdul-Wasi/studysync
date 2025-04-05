// src/pages/About.jsx

import React from "react";
import "../styles/About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About UniTools</h1>
        <p className="intro">
          UniTools is your one-stop platform designed to empower students with intelligent academic tools. Whether it’s managing attendance, calculating SGPA, or planning studies — we’ve got your back.
        </p>

        <div className="mission-section">
          <h2>🎯 Our Mission</h2>
          <p>
            To simplify student life by offering free, accessible, and intuitive academic tools that save time and boost performance.
          </p>
        </div>

        <div className="team-section">
          <h2>🤝 Meet the Team</h2>
          <p>
            UniTools is proudly built by passionate students who understand the challenges of university life and strive to solve them using technology.
          </p>
        </div>

        <div className="vision-section">
          <h2>🚀 Our Vision</h2>
          <p>
            To evolve into a community-driven educational toolkit hub and become every student's trusted digital companion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
