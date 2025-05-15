// src/components/Tools.jsx

import React from "react";
import { Link } from "react-router-dom";
import "../styles/Tools.css";

const Tools = () => {
  return (
    <div className="tools-page">
      <div className="tools-container">
        <h1>Explore Our Tools</h1>
        <p className="subtitle">Everything you need to stay on top of your academics.</p>

        <div className="tools-grid">
          {/* Attendance Calculator */}
          <Link to="/tools/attendance" className="tool-card">
            <i className="fas fa-user-check tool-icon"></i>
            <h3>Attendance Calculator</h3>
            <p>Calculate your current attendance and see how many classes you can skip or need to attend.</p>
          </Link>

          {/* SGPA Calculator */}
          <Link to="/tools/sgpa-calculator" className="tool-card">
            <i className="fas fa-graduation-cap tool-icon"></i>
            <h3>SGPA Calculator</h3>
            <p>Easily compute your SGPA from your semester grades.</p>
          </Link>

          {/* Study Planner */}
          <Link to="/tools/studyPlanner" className="tool-card">
            <i className="fas fa-calendar-alt tool-icon"></i>
            <h3>Study Planner</h3>
            <p>Plan your study schedule and stay organized daily.</p>
          </Link>

          {/* Citation Generator */}
          <Link to="/tools/citationGenerator" className="tool-card">
            <i className="fas fa-quote-right tool-icon"></i>
            <h3>Citation Generator</h3>
            <p>Generate citations in different formats for your academic papers.</p>
          </Link>

          {/* Budgeting Tool */}
          <Link to="/tools/budgetingTool" className="tool-card">
            <i className="fas fa-wallet tool-icon"></i>
            <h3>Budgeting Tool</h3>
            <p>Plan your budget and keep track of your expenses smartly.</p>
          </Link>

          {/* Attendance Visualizer - Coming Soon */}
          <div className="tool-card coming-soon">
            <i className="fas fa-chart-pie tool-icon"></i>
            <h3>Attendance Visualizer</h3>
            <p>Coming Soon: Get graphs showing your attendance patterns over time.</p>
          </div>

          {/* Discussion Forum - Coming Soon */}
          <div className="tool-card coming-soon">
            <i className="fas fa-comments tool-icon"></i>
            <h3>Discussion Forum</h3>
            <p>Coming Soon: Ask questions, share answers, and engage with peers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
