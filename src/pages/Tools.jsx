import React from "react";
import "../styles/Tools.css"
import { Link } from "react-router-dom";

const Tools = () => {
  return (
    <div className="tools">
      <h2>Explore Our Tools</h2>
      <div className="tools-grid">
        <Link to="/tools/attendance" className="tool-card">
          <h3>Attendance Calculator</h3>
          <p>Track and calculate your attendance percentage.</p>
        </Link>
      </div>
    </div>
  );
};

export default Tools;
