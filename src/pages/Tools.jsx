import React from "react";
import { Link } from "react-router-dom";
import "../styles/Tools.css";

const toolsList = [
  { name: "Attendance Calculator", path: "/tools/attendance", icon: "fa-calendar-check" },
  { name: "SGPA Calculator", path: "/tools/sgpa", icon: "fa-graduation-cap" },
  { name: "Study Planner", path: "/tools/study-planner", icon: "fa-book-open" },
  { name: "Discussion Forum", path: "/tools/forum", icon: "fa-comments" },
];

const Tools = () => {
  return (
    <div className="tools-page">
      <h2>Explore Our Tools</h2>
      <p>Select a tool to simplify your academic journey.</p>

      <div className="tools-grid">
        {toolsList.map((tool, index) => (
          <Link to={tool.path} key={index} className="tool-card">
            <i className={`fas ${tool.icon}`}></i>
            <h3>{tool.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tools;
