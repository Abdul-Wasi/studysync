// src/pages/Tools.jsx

import React from "react";
import { Link } from "react-router-dom";
import "../styles/Tools.css";

const Tools = () => {
  return (
    <div className="tools-page">
      <h1>Explore Our Tools</h1>
      <p className="subtitle">Everything you need to stay on top of your academics.</p>

      <div className="tools-grid">
        <Link to="/tools/attendance" className="tool-card">
          <i className="fas fa-user-check tool-icon"></i>
          <h3>Attendance Calculator</h3>
          <p>
            Calculate your current attendance and see how many classes you can skip or need to attend.
          </p>
        </Link>

        <Link to="/tools/sgpa" className="tool-card">
          <i className="fas fa-graduation-cap tool-icon"></i>
          <h3>SGPA Calculator</h3>
          <p>Easily compute your SGPA from your semester grades.</p>
        </Link>


        <div className="tool-card coming-soon">
          <i className="fas fa-chart-pie tool-icon"></i>
          <h3>Attendance Visualizer</h3>
          <p>Coming Soon: Get graphs showing your attendance patterns over time.</p>
        </div>

        <div className="tool-card coming-soon">
          <i className="fas fa-calendar-alt tool-icon"></i>
          <h3>Study Planner</h3>
          <p>Coming Soon: Plan your study schedule and stay organized daily.</p>
        </div>

        <div className="tool-card coming-soon">
          <i className="fas fa-comments tool-icon"></i>
          <h3>Discussion Forum</h3>
          <p>Coming Soon: Ask questions, share answers, and engage with peers.</p>
        </div>
      </div>
    </div>
  );
};

export default Tools;
