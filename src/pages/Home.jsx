import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import heroImage from "../assets/hero-image.jpeg";

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-text">
          <h1>Unlock the Power of Smart Learning</h1>
          <p>Essential tools for students & scholars to manage academics effortlessly.</p>
          <Link to="/tools" className="cta-button">
            Explore Tools
          </Link>
        </div>
        <img src={heroImage} alt="Study Illustration" className="hero-image" />
      </div>

      {/* Features Section */}
      <div className="features">
        <h2>Why Choose UniTools?</h2>
        <div className="feature-list">
          <div className="feature-card">
            <i className="fas fa-calculator"></i>
            <h3>Smart Calculators</h3>
            <p>Attendance, GPA, and study planning in one place.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-users"></i>
            <h3>Discussion Forum</h3>
            <p>Engage with peers, share knowledge, and solve doubts.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-chart-line"></i>
            <h3>Progress Tracking</h3>
            <p>Visualize academic progress with graphs & stats.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
