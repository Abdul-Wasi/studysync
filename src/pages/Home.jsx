import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import "../styles/Home.css";
import {
  FaCalculator,
  FaClipboardList,
  FaChartPie,
  FaBrain,
  FaCalendarAlt,
  FaQuoteRight,
  FaWallet,
  FaComments
} from 'react-icons/fa';

const Home = () => {
  // Define your tool data including paths
  const toolsData = [
    {
      icon: FaCalculator,
      title: "Attendance Calculator",
      description: "Check how many classes you can miss or need to attend.",
      path: "/tools/attendance"
    },
    // Note: 'Requirement Estimator' and 'Attendance Visualizer' are not defined as separate routes in your App.jsx yet.
    // For now, I'm linking them to /tools/coming-soon.
    // You'll need to create specific components and routes for them if they become standalone tools.
    {
      icon: FaClipboardList,
      title: "Requirement Estimator",
      description: "Find how many more classes you need to reach x%.",
      path: "/tools/coming-soon" // Link to Coming Soon or implement new tool
    },
    {
      icon: FaChartPie,
      title: "Attendance Visualizer",
      description: "Get semester-wise charts of your attendance trends.",
      path: "/tools/coming-soon" // Link to Coming Soon or implement new tool
    },
    {
      icon: FaBrain,
      title: "SGPA Calculator",
      description: "Calculate your semester SGPA based on grades and credits.",
      path: "/tools/sgpa-calculator"
    },
    {
      icon: FaCalendarAlt,
      title: "Study Planner",
      description: "Organize your study goals and tasks with a smart planner.",
      path: "/tools/studyPlanner"
    },
    {
      icon: FaQuoteRight,
      title: "Citation Generator",
      description: "Generate citations in different academic formats instantly.",
      path: "/tools/citationGenerator"
    },
    {
      icon: FaWallet,
      title: "Budgeting Tool",
      description: "Plan your budget and keep track of expenses efficiently.",
      path: "/tools/budgetingTool"
    },
    {
      icon: FaComments,
      title: "Discussion Forum",
      description: "Collaborate, ask doubts, and engage in student discussions.",
      path: "/tools/coming-soon" // Link to Coming Soon or implement new tool
    }
  ];

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to StudySync 🚀</h1>
      <p className="home-subtitle">
        Your all-in-one academic companion — calculate, plan, analyze & connect.
      </p>

      <div className="home-features">
        {toolsData.map((tool, index) => (
          <Link to={tool.path} className="feature-card" key={index}>
            <tool.icon className="feature-icon" /> {/* Render icon component */}
            <h3 className="feature-title">{tool.title}</h3>
            <p className="feature-desc">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;