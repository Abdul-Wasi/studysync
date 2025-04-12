// src/components/Home.js

import React from 'react';
import "../styles/Home.css";import { FaCalculator, FaClipboardList, FaChartBar, FaBrain, FaCalendarAlt, FaComments } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to UniTools 🚀</h1>
      <p className="home-subtitle">
        Your all-in-one academic companion — calculate, plan, analyze & connect.
      </p>

      <div className="home-features">
        <div className="feature-card">
          <FaCalculator className="feature-icon" />
          <h3 className="feature-title">Attendance Calculator</h3>
          <p className="feature-desc">
            Check how many classes you can miss or need to attend.
          </p>
        </div>

        <div className="feature-card">
          <FaClipboardList className="feature-icon" />
          <h3 className="feature-title">Requirement Estimator</h3>
          <p className="feature-desc">
            Find how many more classes you need to reach 75%.
          </p>
        </div>

        <div className="feature-card">
          <FaChartBar className="feature-icon" />
          <h3 className="feature-title">Attendance Visualizer</h3>
          <p className="feature-desc">
            Graph your attendance data semester-wise.
          </p>
        </div>

        <div className="feature-card">
          <FaBrain className="feature-icon" />
          <h3 className="feature-title">SGPA Calculator</h3>
          <p className="feature-desc">
            Calculate your semester SGPA based on grades and credits.
          </p>
        </div>

        <div className="feature-card">
          <FaCalendarAlt className="feature-icon" />
          <h3 className="feature-title">Study Planner</h3>
          <p className="feature-desc">
            Organize your study goals and tasks with a smart planner.
          </p>
        </div>

        <div className="feature-card">
          <FaComments className="feature-icon" />
          <h3 className="feature-title">Discussion Forum</h3>
          <p className="feature-desc">
            Collaborate, ask doubts, and engage in student discussions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
